import { FlashcardDeck } from "@/components/FlashcardDeck";
import { people } from "@/data/people";

export default function FlashcardsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl">Flashcards</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {people.length} cards. Look at the photo, say the name, then turn the card. Mark it known, or send it
        to the back of the deck.
      </p>
      <div className="mt-6">
        <FlashcardDeck />
      </div>
    </main>
  );
}
