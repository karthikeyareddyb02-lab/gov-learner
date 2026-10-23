import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { DaySky } from "@/components/DaySky";
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
  description: "About leaders, flashcards, and four 25-mark tests for Telangana and Andhra Pradesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">
        <DaySky />
        <Suspense fallback={<div className="mx-3 mt-3 h-12 rounded-full bg-card/70" />}>
          <SiteHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
