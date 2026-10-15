"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { benchFilters, people } from "@/data/people";
import { PersonPhoto } from "@/components/PersonPhoto";

export function NotesBrowser() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All");
  const [bench, setBench] = useState("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter((person) => {
      const stateOk =
        state === "All" ||
        person.state === state ||
        person.state === "Telangana and Andhra Pradesh";
      const benchOk = bench === "all" || person.bench === bench || (bench === "opposition" && person.bench === "outside");
      const haystack = [person.name, person.party, person.role, person.constituency, person.portfolio, person.state]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return stateOk && benchOk && (!needle || haystack.includes(needle));
    });
  }, [bench, query, state]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block flex-1 text-sm font-medium text-muted">
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, party, constituency"
            className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2 text-base text-ink outline-none ring-maroon/30 focus:ring-2"
          />
        </label>
        <p className="text-sm text-muted">
          {visible.length} of {people.length}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="State">
        {["All", "Telangana", "Andhra Pradesh"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setState(item)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              state === item ? "bg-ink text-paper" : "bg-card text-muted ring-1 ring-line"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Where they work">
        {benchFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setBench(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              bench === item.id ? "bg-maroon text-paper" : "bg-card text-muted ring-1 ring-line"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((person) => (
          <li key={person.id}>
            <Link
              href={`/notes/${person.id}`}
              className="flex gap-3 rounded-2xl border border-line bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-paper">
                <PersonPhoto src={person.photo} alt="" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">{person.name}</p>
                <p className="mt-1 text-sm text-ink">{person.role}</p>
                <p className="text-sm text-muted">{person.party}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-maroon">
                  {person.benchLabel}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mt-8 text-muted">No one matches that search. Try a shorter name.</p>
      )}
    </div>
  );
}
