import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gov Learner",
  description: "Notes, flashcards, and four 25-mark tests for Telangana and Andhra Pradesh leaders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Suspense fallback={<div className="h-14 border-b border-line bg-card" />}>
          <SiteHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
