import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getPaper, papers } from "@/lib/questions";

export function generateStaticParams() {
  return papers.map((paper) => ({ id: paper.id }));
}

function PaperFallback() {
  return <div className="mx-auto mt-8 h-96 max-w-xl rounded-3xl bg-line" />;
}

async function Paper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/test" className="text-sm font-medium text-maroon">
        All tests
      </Link>
      <h1 className="mt-2 font-serif text-4xl">
        Test {paper.number}: {paper.title}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">{paper.blurb} One mark each, out of 25.</p>
      <div className="mt-6">
        <TestRunner paperId={paper.id} title={paper.title} questions={paper.questions} />
      </div>
    </main>
  );
}

export default function TestPaperPage({ params }: PageProps<"/test/[id]">) {
  return (
    <Suspense fallback={<PaperFallback />}>
      <Paper params={params} />
    </Suspense>
  );
}
