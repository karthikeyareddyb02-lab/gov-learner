"use client";

import { useEffect, useState } from "react";
import { answersMatch } from "@/lib/grade";
import { questionPerson, testQuestions } from "@/lib/questions";
import { PersonPhoto } from "@/components/PersonPhoto";

const storageKey = "gov-learner-test-v1";

type SavedTest = {
  index: number;
  answers: string[];
  submitted: boolean;
};

export function TestRunner() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => testQuestions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedTest;
        if (Array.isArray(parsed.answers) && parsed.answers.length === testQuestions.length) {
          setAnswers(parsed.answers);
          setIndex(parsed.index ?? 0);
          setSubmitted(Boolean(parsed.submitted));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: SavedTest = { index, answers, submitted };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [answers, index, ready, submitted]);

  const marks = testQuestions.map((question, questionIndex) =>
    answersMatch(answers[questionIndex] ?? "", question.accept),
  );
  const score = marks.filter(Boolean).length;
  const question = testQuestions[index];
  const person = questionPerson(question);

  function updateAnswer(value: string) {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? value : answer)));
  }

  function reset() {
    setAnswers(testQuestions.map(() => ""));
    setIndex(0);
    setSubmitted(false);
    window.localStorage.removeItem(storageKey);
  }

  if (submitted) {
    const missed = testQuestions
      .map((item, itemIndex) => ({ item, itemIndex, correct: marks[itemIndex] }))
      .filter((entry) => !entry.correct);

    return (
      <section>
        <div className="rounded-3xl border border-line bg-card px-6 py-8">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-maroon">Result</p>
          <h2 className="mt-2 font-serif text-5xl">
            {score} <span className="text-2xl text-muted">/ 100</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Each question is one mark. A close spelling counts. {missed.length} answers still need another look.
          </p>
          <button type="button" onClick={reset} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
            Take the test again
          </button>
        </div>
        <ol className="mt-6 space-y-3">
          {missed.map(({ item, itemIndex }) => {
            const missedPerson = questionPerson(item);
            return (
              <li key={item.id} className="flex gap-3 rounded-2xl border border-line bg-card p-3">
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
          Question {index + 1} of 100
        </span>
        <span>1 mark</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-maroon" style={{ width: `${((index + 1) / 100) * 100}%` }} />
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-card">
        <div className="aspect-[4/5] bg-paper">
          <PersonPhoto src={person.photo} alt="" priority />
        </div>
        <form
          className="px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (index === testQuestions.length - 1) setSubmitted(true);
            else setIndex((value) => value + 1);
          }}
        >
          <label htmlFor="answer" className="block font-serif text-2xl leading-snug">
            {question.prompt}
          </label>
          <input
            id="answer"
            value={answers[index] ?? ""}
            onChange={(event) => updateAnswer(event.target.value)}
            autoComplete="off"
            className="mt-4 w-full rounded-xl border border-line bg-paper px-3 py-3 text-lg outline-none ring-maroon/30 focus:ring-2"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              disabled={index === 0}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted disabled:opacity-40"
            >
              Back
            </button>
            <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
              {index === testQuestions.length - 1 ? "Finish and mark" : "Next question"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
