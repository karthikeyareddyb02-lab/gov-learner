import Link from "next/link";
import { people } from "@/data/people";

const jobs = [
  {
    title: "Governor",
    body: "The President appoints the Governor. This is the constitutional head of the state, not the leader of the elected government.",
  },
  {
    title: "Chief Minister",
    body: "The Chief Minister leads the party or alliance that has a majority in the Assembly. This is the real head of the state government.",
  },
  {
    title: "Minister",
    body: "Ministers are chosen by the Chief Minister. They run departments such as finance, health, or transport, and they are in the government.",
  },
  {
    title: "MLA",
    body: "An MLA is elected from one constituency. Telangana has 119 Assembly seats. Andhra Pradesh has 175. An MLA may be in the government or in the opposition.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-maroon">Telangana and Andhra Pradesh</p>
      <h1 className="mt-2 max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
        Learn the faces, the posts, and the parties.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        {people.length} notes, a flashcard deck, and four tests of 25 questions. Each question shows a
        photo and is worth one mark. A close spelling still scores.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/notes" className="rounded-3xl border border-line bg-card p-5 hover:shadow-md">
          <p className="text-sm font-medium text-maroon">01</p>
          <h2 className="mt-2 font-serif text-3xl">Notes</h2>
          <p className="mt-2 text-muted">Photo, post, party, constituency, and which government they work in.</p>
        </Link>
        <Link href="/flashcards" className="rounded-3xl border border-line bg-card p-5 hover:shadow-md">
          <p className="text-sm font-medium text-maroon">02</p>
          <h2 className="mt-2 font-serif text-3xl">Flashcards</h2>
          <p className="mt-2 text-muted">{people.length} cards. The photo is the front. Tap to check the answer.</p>
        </Link>
        <Link href="/test" className="rounded-3xl bg-ink p-5 text-paper hover:bg-maroon">
          <p className="text-sm font-medium text-gold">03</p>
          <h2 className="mt-2 font-serif text-3xl">4 tests / 25</h2>
          <p className="mt-2 text-paper/80">Names, parties, posts, and state. Each paper is 25 marks.</p>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-3xl">How these jobs fit together</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <article key={job.title} className="rounded-2xl border border-line bg-card p-5">
              <h3 className="font-serif text-2xl">{job.title}</h3>
              <p className="mt-2 leading-7 text-muted">{job.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          A person can belong to a party and still sit outside the government. Harish Rao is BRS, and BRS is
          in the opposition in Telangana. Jagan is YSRCP, and YSRCP is in the opposition in Andhra Pradesh.
          The Telangana cabinet also includes Tummala Nageswara Rao, Vakiti Srihari, and Gaddam Vivek Venkat
          Swamy. Their portraits are not in this first deck.
        </p>
      </section>
    </main>
  );
}
