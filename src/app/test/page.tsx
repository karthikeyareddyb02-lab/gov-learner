import Link from "next/link";
import { papers } from "@/lib/questions";

export default function TestPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl">Four tests, 25 marks each</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Each paper has 25 questions and each question is one mark. Every question shows a photo. A close
        spelling still scores.
      </p>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {papers.map((paper) => (
          <li key={paper.id}>
            <Link href={`/test/${paper.id}`} className="block rounded-3xl border border-line bg-card p-5 hover:shadow-md">
              <p className="text-sm font-medium text-maroon">Test {paper.number}</p>
              <h2 className="mt-2 font-serif text-3xl">{paper.title}</h2>
              <p className="mt-2 text-muted">{paper.blurb}</p>
              <p className="mt-4 text-sm font-medium">25 marks</p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
