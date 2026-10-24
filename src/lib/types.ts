export type Bench = "government" | "opposition" | "governor" | "union" | "outside";

export type Person = {
  id: string;
  name: string;
  aliases: string[];
  state: "Telangana" | "Andhra Pradesh" | "Telangana and Andhra Pradesh";
  role: string;
  roleAliases: string[];
  party: string;
  partyAliases: string[];
  bench: Bench;
  benchLabel: string;
  benchAliases: string[];
  constituency?: string;
  portfolio?: string;
  facts: string[];
  photo: string;
  credit: string;
};

export type Question = {
  id: string;
  personId: string;
  prompt: string;
  accept: string[];
  marks: 1 | 3;
  parts?: [string[], string[], string[]];
};
