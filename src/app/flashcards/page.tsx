import { FlashcardDeck } from "@/components/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <main className="shell">
      <p className="kicker">Step 2</p>
      <h1 className="page-title">Flashcards</h1>
      <p className="lede">
        Pick a level. Each deck has 10 portraits. Look at the photo, say the name, then turn the card.
      </p>
      <div className="mt-6">
        <FlashcardDeck />
      </div>
    </main>
  );
}
