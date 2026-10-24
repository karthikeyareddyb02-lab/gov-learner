import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SaluteMark } from "@/components/SaluteMark";
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
    <main className="shell">
      <Link href="/test" className="with-salute text-sm font-medium text-maroon">
        <SaluteMark />
        All tests
      </Link>
      <h1 className="page-title">
        Test {paper.number}: {paper.title}
      </h1>
      <p className="lede">{paper.blurb} The paper is out of 25.</p>
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
