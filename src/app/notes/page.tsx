import { NotesBrowser } from "@/components/NotesBrowser";

export default function NotesPage() {
  return (
    <main className="shell">
      <p className="kicker">Step 1</p>
      <h1 className="page-title">About leaders</h1>
      <p className="lede">
        People are grouped by post, and each group runs from easy to hard. A lighter ring marks the names to learn first.
      </p>
      <div className="mt-6">
        <NotesBrowser />
      </div>
    </main>
  );
}
