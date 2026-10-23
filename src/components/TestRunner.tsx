"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { answersMatch } from "@/lib/grade";
import { questionPerson } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { PersonPhoto } from "@/components/PersonPhoto";
import { SaluteMark } from "@/components/SaluteMark";

type SavedTest = {
  index: number;
  answers: string[];
  submitted: boolean;
};

export function TestRunner({
  paperId,
  title,
  questions,
}: {
  paperId: string;
  title: string;
  questions: Question[];
}) {
  const storageKey = `gov-learner-test-${paperId}`;
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedTest;
        if (Array.isArray(parsed.answers) && parsed.answers.length === total) {
          setAnswers(parsed.answers);
          setIndex(parsed.index ?? 0);
          setSubmitted(Boolean(parsed.submitted));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setReady(true);
  }, [storageKey, total]);

  useEffect(() => {
    if (!ready) return;
    const payload: SavedTest = { index, answers, submitted };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [answers, index, ready, storageKey, submitted]);

  const marks = questions.map((question, questionIndex) =>
    answersMatch(answers[questionIndex] ?? "", question.accept),
  );
  const score = marks.filter(Boolean).length;
  const question = questions[index];
  const person = question ? questionPerson(question) : null;

  function updateAnswer(value: string) {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? value : answer)));
  }

  function reset() {
    setAnswers(questions.map(() => ""));
    setIndex(0);
    setSubmitted(false);
    window.localStorage.removeItem(storageKey);
  }

  if (!question || !person) return null;

  if (submitted) {
    const missed = questions
      .map((item, itemIndex) => ({ item, itemIndex, correct: marks[itemIndex] }))
      .filter((entry) => !entry.correct);

    return (
      <section>
        <div className="panel px-6 py-8">
          <p className="kicker">{title}</p>
          <h2 className="mt-2 font-serif text-5xl leading-none tracking-tight">
            {score} <span className="text-2xl text-muted">/ {total}</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Each question is one mark. A close spelling counts. {missed.length} answers still need another look.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="with-salute rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
              <SaluteMark />
              Take this test again
            </button>
            <Link href="/test" className="with-salute rounded-full px-5 py-2.5 text-sm font-medium text-maroon">
              <SaluteMark />
              All tests
            </Link>
          </div>
        </div>
        <ol className="mt-6 space-y-3">
          {missed.map(({ item, itemIndex }) => {
            const missedPerson = questionPerson(item);
            return (
              <li key={item.id} className="panel flex gap-3 p-3">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                  <PersonPhoto src={missedPerson.photo} alt="" />
                </div>
                <div>
                  <p className="text-sm text-muted">Question {itemIndex + 1}</p>
                  <p className="font-medium">{item.prompt}</p>
                  <p className="mt-1 text-sm">
                    You typed: <span className="text-maroon">{answers[itemIndex] || "—"}</span>
                  </p>
                  <p className="text-sm">
                    Answer: <span className="font-medium">{item.accept[0]}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>1 mark</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-maroon" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className="panel mt-4 overflow-hidden">
        <div className="aspect-[4/5] bg-paper/70">
          <PersonPhoto src={person.photo} alt="" priority />
        </div>
        <form
          className="px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (index === total - 1) setSubmitted(true);
            else setIndex((value) => value + 1);
          }}
        >
          <label htmlFor="answer" className="card-title block">
            {question.prompt}
          </label>
          <input
            id="answer"
            value={answers[index] ?? ""}
            onChange={(event) => updateAnswer(event.target.value)}
            autoComplete="off"
            className="field mt-4 px-3 py-3 text-lg"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              disabled={index === 0}
              className="with-salute rounded-full px-4 py-2 text-sm font-medium text-muted disabled:opacity-40"
            >
              <SaluteMark />
              Back
            </button>
            <button type="submit" className="with-salute rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
              <SaluteMark />
              {index === total - 1 ? "Finish and mark" : "Next question"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
