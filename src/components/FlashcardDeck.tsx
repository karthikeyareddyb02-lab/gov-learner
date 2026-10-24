"use client";

import { useEffect, useRef, useState } from "react";
import { people } from "@/data/people";
import { difficultyLabel, difficultyOf, levels, type Difficulty } from "@/lib/difficulty";
import { isProminent } from "@/lib/roles";
import { PersonPhoto } from "@/components/PersonPhoto";
import { SaluteMark } from "@/components/SaluteMark";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function idsFor(level: Difficulty) {
  return people.filter((person) => difficultyOf(person.id) === level).map((person) => person.id);
}

const tone: Record<Difficulty, string> = {
  easy: "bg-green text-white",
  medium: "bg-gold text-white",
  hard: "bg-maroon text-white",
};

const badge: Record<Difficulty, string> = {
  easy: "bg-green/10 text-green",
  medium: "bg-gold/15 text-gold",
  hard: "bg-maroon/10 text-maroon",
};

export function FlashcardDeck() {
  const [level, setLevel] = useState<Difficulty>("easy");
  const [queue, setQueue] = useState(() => idsFor("easy"));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState(0);
  const [turning, setTurning] = useState<"out" | "in" | null>(null);
  const pendingMark = useRef<{ id: string; remembered: boolean } | null>(null);

  useEffect(() => {
    setQueue(shuffle(idsFor("easy")));
  }, []);

  const deckSize = idsFor(level).length;
  const current = people.find((person) => person.id === queue[0]);
  const finished = queue.length === 0;
  const selected = levels.find((item) => item.id === level) ?? levels[0];

  useEffect(() => {
    if (turning !== "out") return;
    const timer = window.setTimeout(() => {
      const action = pendingMark.current;
      pendingMark.current = null;
      if (action) {
        setQueue((items) => {
          const rest = items.slice(1);
          return action.remembered ? rest : [...rest, action.id];
        });
        setFlipped(false);
        if (action.remembered) setKnown((count) => count + 1);
        else setAgain((count) => count + 1);
      }
      setTurning("in");
    }, 460);
    return () => window.clearTimeout(timer);
  }, [turning]);

  useEffect(() => {
    if (turning !== "in") return;
    const timer = window.setTimeout(() => setTurning(null), 460);
    return () => window.clearTimeout(timer);
  }, [turning]);

  function start(next: Difficulty) {
    pendingMark.current = null;
    setTurning(null);
    setLevel(next);
    setQueue(shuffle(idsFor(next)));
    setKnown(0);
    setAgain(0);
    setFlipped(false);
  }

  function mark(remembered: boolean) {
    if (!current || pendingMark.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const personId = current.id;
      setQueue((items) => {
        const rest = items.slice(1);
        return remembered ? rest : [...rest, personId];
      });
      setFlipped(false);
      if (remembered) setKnown((count) => count + 1);
      else setAgain((count) => count + 1);
      return;
    }
    pendingMark.current = { id: current.id, remembered };
    setTurning("out");
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="grid grid-cols-3 gap-1 rounded-full bg-card/70 p-1 shadow-sm backdrop-blur-md" role="radiogroup" aria-label="Difficulty">
        {levels.map((item) => {
          const active = item.id === level;
          const count = idsFor(item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => start(item.id)}
              className={`with-salute w-full justify-center rounded-full px-2 py-2 text-sm font-medium ${
                active ? tone[item.id] : "text-muted hover:bg-white/70 hover:text-ink"
              }`}
            >
              <SaluteMark />
              {item.label}
              <span className={active ? "opacity-80" : "text-muted"}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-muted">{selected.hint}</p>

      {finished ? (
        <div className="panel mt-5 px-6 py-10 text-center">
          <p className={`mx-auto w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badge[level]}`}>
            {difficultyLabel(level)} finished
          </p>
          <h2 className="section-title mt-3">You marked {known} cards as known.</h2>
          <p className="mt-3 text-muted">{again} cards were sent to the back of the deck before they stuck.</p>
          <button
            type="button"
            onClick={() => start(level)}
            className="with-salute mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            <SaluteMark />
            Shuffle and start again
          </button>
        </div>
      ) : current ? (
        <>
          <div className="mb-4 mt-5 flex items-center justify-between text-sm text-muted">
            <span>
              {deckSize - queue.length + 1} / {deckSize}
            </span>
            <span>{known} known</span>
          </div>
          <div className="card-stage">
            <button
              key={current.id}
              type="button"
              onClick={() => {
                if (turning) return;
                setFlipped((value) => !value);
              }}
              className={`card-sheet panel flex w-full flex-col items-center gap-5 p-5 text-left sm:flex-row sm:items-stretch sm:p-6 ${
                turning === "out" ? "is-turning-out" : ""
              } ${turning === "in" ? "is-turning-in" : ""}`}
              aria-expanded={flipped}
            >
            <div className="h-44 w-32 shrink-0 overflow-hidden rounded-2xl bg-paper shadow-sm">
              <PersonPhoto src={current.photo} alt="" priority />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center text-center sm:text-left">
              {flipped ? (
                <>
                  <p className={`mx-auto w-fit rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide sm:mx-0 ${badge[level]}`}>
                    {difficultyLabel(level)}
                    {isProminent(current) ? " · Prominent" : ""}
                  </p>
                  <h2 className="section-title mt-2">{current.name}</h2>
                  <p className="mt-1 text-base">
                    {current.role}
                    {current.constituency ? ` · ${current.constituency}` : ""}
                  </p>
                  <p className="text-muted">{current.party}</p>
                  <p className="mt-3 text-sm font-medium text-maroon">{current.benchLabel}</p>
                  <p className="mt-3 text-sm leading-6 text-ink">{current.facts[0]}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Front of the card</p>
                  <h2 className="card-title">Who is this?</h2>
                  <p className="mt-2 text-muted">Tap the card to turn it over.</p>
                </>
              )}
            </div>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => mark(false)}
              disabled={turning !== null}
              className="with-salute justify-center rounded-full border border-white/70 bg-card/80 px-4 py-3 text-sm font-medium backdrop-blur-md disabled:opacity-40"
            >
              <SaluteMark />
              Show it again
            </button>
            <button
              type="button"
              onClick={() => mark(true)}
              disabled={turning !== null}
              className="with-salute justify-center rounded-full bg-green px-4 py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              <SaluteMark />
              I knew it
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
