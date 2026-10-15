import { NotesBrowser } from "@/components/NotesBrowser";

export default function NotesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl">Notes</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Open a card for the short facts: the post, the party, and whether that person is in the government,
        in the opposition, a governor, or in the Union government in Delhi.
      </p>
      <div className="mt-6">
        <NotesBrowser />
      </div>
    </main>
  );
}
