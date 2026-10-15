import { TestRunner } from "@/components/TestRunner";

export default function TestPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl">Test, out of 100</h1>
      <p className="mt-2 max-w-2xl text-muted">
        One hundred questions, one mark each. Every question shows a photo. Type the answer and move on.
        The paper is marked at the end.
      </p>
      <div className="mt-6">
        <TestRunner />
      </div>
    </main>
  );
}
