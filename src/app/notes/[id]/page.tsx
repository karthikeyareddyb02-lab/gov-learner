import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PersonPhoto } from "@/components/PersonPhoto";
import { SaluteMark } from "@/components/SaluteMark";
import { getPerson, people } from "@/data/people";
import { difficultyLabel, difficultyOf } from "@/lib/difficulty";
import { isProminent } from "@/lib/roles";

export function generateStaticParams() {
  return people.map((person) => ({ id: person.id }));
}

function NoteFallback() {
  return (
    <main className="shell grid max-w-5xl gap-8 md:grid-cols-[240px_1fr]">
      <div className="aspect-[4/5] rounded-3xl bg-white/40" />
      <div>
        <div className="h-4 w-24 rounded bg-line" />
        <div className="mt-4 h-12 w-2/3 rounded bg-line" />
      </div>
    </main>
  );
}

async function Note({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = getPerson(id);
  if (!person) notFound();

  const rows = [
    ["Post", person.role],
    ["Party", person.party],
    ["State", person.state],
    ["Where they work", person.benchLabel],
    ["Constituency", person.constituency],
    ["Departments", person.portfolio],
  ].filter((row) => row[1]);

  const level = difficultyOf(person.id);

  return (
    <main className="shell grid max-w-5xl gap-8 md:grid-cols-[240px_1fr]">
      <div className="panel overflow-hidden">
        <div className="aspect-[4/5]">
          <PersonPhoto src={person.photo} alt={person.name} priority />
        </div>
        <p className="px-4 py-3 text-xs text-muted">{person.credit}</p>
      </div>
      <article>
        <Link href="/notes" className="with-salute text-sm font-medium text-maroon">
          <SaluteMark />
          About leaders
        </Link>
        <p className="mt-4 w-fit rounded-full bg-ink px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-paper">
          {difficultyLabel(level)}
          {isProminent(person) ? " · Prominent" : ""}
        </p>
        <h1 className="page-title">{person.name}</h1>
        <p className="lede">{person.role}</p>
        <dl className="panel mt-6 divide-y divide-line">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr]">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-6 space-y-3">
          {person.facts.map((fact) => (
            <li key={fact} className="leading-7">
              {fact}
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}

export default function NotePage({ params }: PageProps<"/notes/[id]">) {
  return (
    <Suspense fallback={<NoteFallback />}>
      <Note params={params} />
    </Suspense>
  );
}
