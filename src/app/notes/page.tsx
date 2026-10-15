import { NotesBrowser } from "@/components/NotesBrowser";

export default function NotesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl">Notes</h1>
      <p className="mt-2 max-w-2xl text-muted">
        People are grouped by post. The gold cards are the prominent ones to learn first: the chief ministers,
        governors, and the names that come up again and again.
      </p>
      <div className="mt-6">
        <NotesBrowser />
      </div>
    </main>
  );
}
