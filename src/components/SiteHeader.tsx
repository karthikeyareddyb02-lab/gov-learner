"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaluteMark } from "@/components/SaluteMark";

const links = [
  { href: "/notes", label: "About leaders" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/test", label: "Test" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-3xl border border-white/60 bg-card/75 px-3 py-2 shadow-[0_10px_30px_rgba(11,42,74,0.08)] backdrop-blur-xl sm:rounded-full sm:px-4">
        <Link href="/" className="shrink-0 font-serif text-lg tracking-tight text-ink">
          Gov Learner
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-xs font-medium sm:text-sm" aria-label="Study">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`with-salute rounded-full px-2.5 py-1.5 sm:px-3 ${
                  active ? "bg-ink text-paper" : "text-muted hover:bg-white/70 hover:text-ink"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <SaluteMark />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
