export type Difficulty = "easy" | "medium" | "hard";

export const levels = [
  {
    id: "easy",
    label: "Easy",
    hint: "Chief ministers, former chief ministers, and the other faces that lead the news.",
  },
  {
    id: "medium",
    label: "Medium",
    hint: "Governors, the deputy chief minister, and ministers people often recognize.",
  },
  {
    id: "hard",
    label: "Hard",
    hint: "The rest of the cabinet and the former governors. These take a second look.",
  },
] as const;

const byId: Record<string, Difficulty> = {
  "revanth-reddy": "easy",
  "chandrababu-naidu": "easy",
  kcr: "easy",
  jagan: "easy",
  "pawan-kalyan": "easy",
  ktr: "easy",
  "harish-rao": "easy",
  "kishan-reddy": "easy",
  sharmila: "easy",
  "nara-lokesh": "easy",
  "bhatti-vikramarka": "medium",
  "shiv-pratap-shukla": "medium",
  "abdul-nazeer": "medium",
  "ponnam-prabhakar": "medium",
  "cp-radhakrishnan": "medium",
  "akbaruddin-owaisi": "medium",
  "bandi-sanjay": "medium",
  "uttam-kumar-reddy": "medium",
  seethakka: "medium",
  "sabitha-indra-reddy": "medium",
  "damodar-rajanarsimha": "hard",
  "ponguleti-srinivas-reddy": "hard",
  "jishnu-dev-varma": "hard",
  "tamilisai-soundararajan": "hard",
  "esl-narasimhan": "hard",
  "satya-kumar-yadav": "hard",
  "nadendla-manohar": "hard",
  "vangalapudi-anitha": "hard",
  "payyavula-keshav": "hard",
  harichandan: "hard",
};

const rank: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

export function difficultyOf(id: string): Difficulty {
  const level = byId[id];
  if (!level) throw new Error(`No difficulty set for ${id}.`);
  return level;
}

export function difficultyLabel(level: Difficulty) {
  return levels.find((item) => item.id === level)?.label ?? level;
}

export function compareDifficulty(aId: string, bId: string) {
  return rank[difficultyOf(aId)] - rank[difficultyOf(bId)];
}

export function assertStudyDifficulties(ids: string[]) {
  const listed = Object.keys(byId);
  const missing = ids.filter((id) => !byId[id]);
  const extra = listed.filter((id) => !ids.includes(id));
  if (missing.length || extra.length) {
    throw new Error(`Difficulty list does not match the study list. Missing: ${missing.join(", ")}. Extra: ${extra.join(", ")}.`);
  }
  for (const level of ["easy", "medium", "hard"] as const) {
    const count = ids.filter((id) => byId[id] === level).length;
    if (count !== 10) throw new Error(`${level} must have 10 people. It has ${count}.`);
  }
}
