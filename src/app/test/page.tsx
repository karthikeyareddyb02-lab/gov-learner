import Link from "next/link";
import { SaluteMark } from "@/components/SaluteMark";
import { papers } from "@/lib/questions";

export default function TestPage() {
  return (
    <main className="shell">
      <p className="kicker">Step 3</p>
      <h1 className="page-title">Four tests, 25 marks each</h1>
      <p className="lede">
        Each paper has 25 questions and each question is one mark. Every question shows a photo. A close
        spelling still scores.
      </p>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {papers.map((paper) => (
          <li key={paper.id}>
            <Link href={`/test/${paper.id}`} className="with-salute salute-card panel block p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <SaluteMark />
              <p className="kicker">Test {paper.number}</p>
              <h2 className="card-title">{paper.title}</h2>
              <p className="mt-2 text-muted">{paper.blurb}</p>
              <p className="mt-4 text-sm font-medium">25 marks</p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
