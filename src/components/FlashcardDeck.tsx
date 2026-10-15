"use client";

import { useMemo, useState } from "react";
import { people } from "@/data/people";
import { PersonPhoto } from "@/components/PersonPhoto";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function FlashcardDeck() {
  const openingDeck = useMemo(() => shuffle(people.map((person) => person.id)), []);
  const [queue, setQueue] = useState(openingDeck);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState(0);

  const current = people.find((person) => person.id === queue[0]);
  const finished = queue.length === 0;

  function mark(remembered: boolean) {
    if (!current) return;
    setQueue((items) => {
      const rest = items.slice(1);
      return remembered ? rest : [...rest, current.id];
    });
    setFlipped(false);
    if (remembered) setKnown((count) => count + 1);
    else setAgain((count) => count + 1);
  }

  if (finished) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-line bg-card px-6 py-10 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-maroon">Deck finished</p>
        <h2 className="mt-2 font-serif text-4xl">You marked {known} cards as known.</h2>
        <p className="mt-3 text-muted">{again} cards were sent to the back of the deck before they stuck.</p>
        <button
          type="button"
          onClick={() => {
            setQueue(shuffle(people.map((person) => person.id)));
            setKnown(0);
            setAgain(0);
            setFlipped(false);
          }}
          className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
        >
          Shuffle and start again
        </button>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          {people.length - queue.length + 1} / {people.length} still in this pass
        </span>
        <span>{known} known</span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="block w-full overflow-hidden rounded-3xl border border-line bg-card text-left shadow-sm"
        aria-expanded={flipped}
      >
        <div className="aspect-[4/5] bg-paper">
          <PersonPhoto src={current.photo} alt="" priority />
        </div>
        <div className="px-5 py-4">
          {flipped ? (
            <>
              <h2 className="font-serif text-3xl">{current.name}</h2>
              <p className="mt-1 text-lg">
                {current.role}
                {current.constituency ? ` · ${current.constituency}` : ""}
              </p>
              <p className="text-muted">{current.party}</p>
              <p className="mt-3 text-sm font-medium text-maroon">{current.benchLabel}</p>
              <p className="mt-3 text-sm leading-6 text-ink">{current.facts[0]}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">Front of the card</p>
              <h2 className="mt-1 font-serif text-3xl">Who is this?</h2>
              <p className="mt-2 text-muted">Tap the card to turn it over.</p>
            </>
          )}
        </div>
      </button>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => mark(false)}
          className="rounded-full border border-line bg-card px-4 py-3 text-sm font-medium"
        >
          Show it again
        </button>
        <button
          type="button"
          onClick={() => mark(true)}
          className="rounded-full bg-green px-4 py-3 text-sm font-medium text-white"
        >
          I knew it
        </button>
      </div>
    </section>
  );
}
