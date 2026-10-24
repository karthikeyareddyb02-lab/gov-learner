import Link from "next/link";
import { SaluteMark } from "@/components/SaluteMark";
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
    <main className="shell">
      <p className="kicker">Telangana and Andhra Pradesh</p>
      <h1 className="page-title">Learn the faces, the posts, and the parties.</h1>
      <p className="lede">
        {people.length} leaders, three flashcard levels, and four tests of 15 questions. Each paper is 25 marks.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/notes" className="with-salute salute-card rounded-3xl bg-ink p-5 text-paper shadow-[0_14px_40px_rgba(11,42,74,0.18)] transition hover:-translate-y-0.5 hover:bg-maroon">
          <SaluteMark />
          <p className="kicker text-gold">01 · Start here</p>
          <h2 className="card-title">About leaders</h2>
          <p className="mt-2 text-paper/80">Photo, post, party, and whether they sit in the government or the opposition.</p>
        </Link>
        <Link href="/flashcards" className="with-salute salute-card panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <SaluteMark />
          <p className="kicker">02</p>
          <h2 className="card-title">Flashcards</h2>
          <p className="mt-2 text-muted">Easy, medium, and hard. Ten portraits in each deck.</p>
        </Link>
        <Link href="/test" className="with-salute salute-card panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <SaluteMark />
          <p className="kicker">03</p>
          <h2 className="card-title">4 tests / 25</h2>
          <p className="mt-2 text-muted">Ten short answers and five 3-mark sentences. Each paper is 25 marks.</p>
        </Link>
      </div>

      <section className="mt-16 border-t border-line/80 pt-10">
        <p className="kicker">Background</p>
        <h2 className="section-title mt-2">How these jobs fit together</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <article key={job.title} className="panel p-5">
              <h3 className="font-serif text-xl">{job.title}</h3>
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
