"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { answerReport, type AnswerReport } from "@/lib/grade";
import { paperMarks, questionPerson } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { PersonPhoto } from "@/components/PersonPhoto";
import { SaluteMark } from "@/components/SaluteMark";

type SavedTest = {
  index: number;
  answers: string[];
  submitted: boolean;
};

function AnswerAccuracy({ report }: { report: AnswerReport }) {
  if (!report.parts) {
    return (
      <p className="text-sm">
        Accuracy: <span className="font-medium">{report.earned === 1 ? "Accurate" : "Not accurate"}</span>
      </p>
    );
  }

  const found = report.parts.filter((part) => part.found).length;
  return (
    <p className="text-sm">
      Accuracy: <span className="font-medium">{found} of 3 parts</span>
      {" · "}
      {report.parts.map((part, index) => (
        <span key={part.label}>
          {index > 0 ? ", " : null}
          <span className={part.found ? "font-medium" : "text-maroon"}>
            {part.label} {part.found ? "found" : "missing"}
          </span>
        </span>
      ))}
    </p>
  );
}

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
  const total = paperMarks(questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedTest;
        if (Array.isArray(parsed.answers) && parsed.answers.length === questions.length) {
          setAnswers(parsed.answers);
          setIndex(parsed.index ?? 0);
          setSubmitted(Boolean(parsed.submitted));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setReady(true);
  }, [storageKey, questions.length]);

  useEffect(() => {
    if (!ready) return;
    const payload: SavedTest = { index, answers, submitted };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [answers, index, ready, storageKey, submitted]);

  const reports = questions.map((question, questionIndex) =>
    answerReport(answers[questionIndex] ?? "", question),
  );
  const score = reports.reduce((sum, report) => sum + report.earned, 0);
  const accuracy = total === 0 ? 0 : Math.round((score / total) * 100);
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
    const reviewed = questions.map((item, itemIndex) => ({
      item,
      itemIndex,
      report: reports[itemIndex],
    }));
    const fullyAccurate = reviewed.filter((entry) => entry.report.earned === entry.item.marks).length;

    return (
      <section>
        <div className="panel px-6 py-8">
          <p className="kicker">{title}</p>
          <h2 className="mt-2 font-serif text-5xl leading-none tracking-tight">
            {score} <span className="text-2xl text-muted">/ {total}</span>
          </h2>
          <p className="mt-3 font-serif text-3xl leading-none tracking-tight">{accuracy}% accurate</p>
          <p className="mt-3 max-w-xl text-muted">
            {fullyAccurate} of {questions.length} answers are fully accurate. A sentence shows how many of its
            three parts were found. It still scores only when all three are there.
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
          {reviewed.map(({ item, itemIndex, report }) => {
            const reviewedPerson = questionPerson(item);
            const complete = report.earned === item.marks;
            return (
              <li key={item.id} className="panel flex gap-3 p-3">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                  <PersonPhoto src={reviewedPerson.photo} alt="" />
                </div>
                <div>
                  <p className="text-sm text-muted">Question {itemIndex + 1}</p>
                  <p className="font-medium">{item.prompt}</p>
                  <p className="mt-1 text-sm">
                    You typed: <span className={complete ? "font-medium" : "text-maroon"}>{answers[itemIndex] || "—"}</span>
                  </p>
                  <AnswerAccuracy report={report} />
                  <p className="text-sm">
                    Mark: <span className="font-medium">{report.earned} / {item.marks}</span>
                  </p>
                  {complete ? null : (
                    <p className="text-sm">
                      Answer: <span className="font-medium">{item.accept[0]}</span>
                    </p>
                  )}
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
          Question {index + 1} of {questions.length}
        </span>
        <span>{question.marks === 3 ? "3 marks" : "1 mark"}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-maroon" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="panel mt-4 overflow-hidden">
        <p className="border-b border-line px-5 py-3 text-sm leading-snug">
          <span className="font-medium">This test is 25 marks.</span>{" "}
          <span className="text-muted">
            10 short answers are 1 mark each. A close spelling still scores. 5 sentences are 3 marks each, and
            only a complete sentence scores.
          </span>
        </p>
        <div className="flex justify-center px-5 pb-1 pt-5">
          <div className="aspect-[4/5] w-44 overflow-hidden rounded-2xl bg-paper shadow-sm sm:w-52">
            <PersonPhoto src={person.photo} alt="" priority />
          </div>
        </div>
        <form
          className="px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (index === questions.length - 1) setSubmitted(true);
            else setIndex((value) => value + 1);
          }}
        >
          <label htmlFor="answer" className="card-title block">
            {question.prompt}
          </label>
          {question.marks === 3 ? (
            <textarea
              id="answer"
              value={answers[index] ?? ""}
              onChange={(event) => updateAnswer(event.target.value)}
              autoComplete="off"
              rows={4}
              className="field mt-4 px-3 py-3 text-lg"
            />
          ) : (
            <input
              id="answer"
              value={answers[index] ?? ""}
              onChange={(event) => updateAnswer(event.target.value)}
              autoComplete="off"
              className="field mt-4 px-3 py-3 text-lg"
            />
          )}
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
              {index === questions.length - 1 ? "Finish and mark" : "Next question"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
