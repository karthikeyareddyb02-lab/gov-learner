import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PersonPhoto } from "@/components/PersonPhoto";
import { getPerson, people } from "@/data/people";
import { isProminent } from "@/lib/roles";

export function generateStaticParams() {
  return people.map((person) => ({ id: person.id }));
}

function NoteFallback() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[280px_1fr]">
      <div className="aspect-[4/5] rounded-3xl bg-line" />
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

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[280px_1fr]">
      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        <div className="aspect-[4/5]">
          <PersonPhoto src={person.photo} alt={person.name} priority />
        </div>
        <p className="px-4 py-3 text-xs text-muted">{person.credit}</p>
      </div>
      <article>
        <Link href="/notes" className="text-sm font-medium text-maroon">
          All notes
        </Link>
        {isProminent(person) && (
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">Prominent</p>
        )}
        <h1 className="mt-2 font-serif text-5xl leading-tight">{person.name}</h1>
        <p className="mt-2 text-lg text-muted">{person.role}</p>
        <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
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
