"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { benchFilters, people } from "@/data/people";
import { PersonPhoto } from "@/components/PersonPhoto";
import { isProminent, roleGroups } from "@/lib/roles";
import type { Person } from "@/lib/types";

function PersonCard({ person }: { person: Person }) {
  const prominent = isProminent(person);

  return (
    <Link
      href={`/notes/${person.id}`}
      className={`flex gap-3 rounded-2xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
        prominent ? "border-gold ring-2 ring-gold/50" : "border-line"
      }`}
    >
      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-paper">
        <PersonPhoto src={person.photo} alt="" />
      </div>
      <div className="min-w-0">
        {prominent && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Prominent</p>
        )}
        <p className="font-serif text-lg leading-tight">{person.name}</p>
        <p className="mt-1 text-sm text-ink">{person.role}</p>
        <p className="text-sm text-muted">{person.party}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-maroon">{person.benchLabel}</p>
      </div>
    </Link>
  );
}

function PersonGrid({ people: list }: { people: Person[] }) {
  return (
    <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((person) => (
        <li key={person.id}>
          <PersonCard person={person} />
        </li>
      ))}
    </ul>
  );
}

export function NotesBrowser() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All");
  const [bench, setBench] = useState("all");
  const [role, setRole] = useState("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter((person) => {
      const stateOk =
        state === "All" || person.state === state || person.state === "Telangana and Andhra Pradesh";
      const benchOk = bench === "all" || person.bench === bench || (bench === "opposition" && person.bench === "outside");
      const group = roleGroups.find((item) => item.id === role);
      const roleOk = role === "all" || (group?.roles as readonly string[] | undefined)?.includes(person.role);
      const haystack = [person.name, person.party, person.role, person.constituency, person.portfolio, person.state]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return stateOk && benchOk && roleOk && (!needle || haystack.includes(needle));
    });
  }, [bench, query, role, state]);

  const prominent = visible.filter(isProminent);
  const groups = roleGroups
    .map((group) => ({
      ...group,
      people: visible
        .filter((person) => (group.roles as readonly string[]).includes(person.role))
        .sort((a, b) => Number(isProminent(b)) - Number(isProminent(a)) || a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.people.length > 0);

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
          {prominent.length > 0 ? ` · ${prominent.length} prominent` : ""}
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
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Role">
        <button
          type="button"
          onClick={() => setRole("all")}
          className={`rounded-full px-3 py-1.5 text-sm ${
            role === "all" ? "bg-ink text-paper" : "bg-card text-muted ring-1 ring-line"
          }`}
        >
          All roles
        </button>
        {roleGroups.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRole(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              role === item.id ? "bg-ink text-paper" : "bg-card text-muted ring-1 ring-line"
            }`}
          >
            {item.label}
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

      {visible.length === 0 && <p className="mt-8 text-muted">No one matches that search. Try a shorter name.</p>}

      {prominent.length > 0 && (
        <section className="mt-8" aria-labelledby="prominent-heading">
          <h2 id="prominent-heading" className="font-serif text-3xl">
            Learn these first
          </h2>
          <p className="mt-1 text-sm text-muted">
            The names that come up most often. They are listed again under their post, with a gold border.
          </p>
          <PersonGrid people={prominent} />
        </section>
      )}

      {groups.map((group) => (
        <section key={group.id} className="mt-10" aria-labelledby={`${group.id}-heading`}>
          <h2 id={`${group.id}-heading`} className="font-serif text-3xl">
            {group.label}
            <span className="ml-2 text-lg text-muted">{group.people.length}</span>
          </h2>
          <PersonGrid people={group.people} />
        </section>
      ))}
    </div>
  );
}
