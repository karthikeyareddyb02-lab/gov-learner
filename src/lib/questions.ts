import { people } from "@/data/people";
import type { Person, Question } from "@/lib/types";

const detailKinds = ["party", "role", "bench", "state"] as const;
type DetailKind = (typeof detailKinds)[number];

function byId(id: string): Person {
  const person = people.find((item) => item.id === id);
  if (!person) throw new Error(`Missing person for the test: ${id}`);
  return person;
}

function detailQuestion(person: Person, kind: DetailKind): Question {
  if (kind === "party") {
    return {
      id: `${person.id}:party`,
      personId: person.id,
      prompt: "Type this person's party. If the post is appointed, type Appointed.",
      accept: person.partyAliases,
    };
  }

  if (kind === "role") {
    return {
      id: `${person.id}:role`,
      personId: person.id,
      prompt: "Type this person's post.",
      accept: person.roleAliases,
    };
  }

  if (kind === "bench") {
    return {
      id: `${person.id}:bench`,
      personId: person.id,
      prompt: "Where does this person sit? Type state government, opposition, governor, or Union government.",
      accept: person.benchAliases,
    };
  }

  const stateAnswers =
    person.state === "Telangana and Andhra Pradesh"
      ? ["Telangana and Andhra Pradesh", "Both", "Telangana", "Andhra Pradesh", "Andhra"]
      : person.state === "Andhra Pradesh"
        ? ["Andhra Pradesh", "Andhra"]
        : ["Telangana"];

  return {
    id: `${person.id}:state`,
    personId: person.id,
    prompt:
      person.id === "cp-radhakrishnan"
        ? "Which state did he serve as Governor?"
        : "Which state is this person linked with? Type Telangana or Andhra Pradesh.",
    accept: person.id === "cp-radhakrishnan" ? ["Telangana"] : stateAnswers,
  };
}

function nameQuestion(person: Person): Question {
  return {
    id: `${person.id}:name`,
    personId: person.id,
    prompt: "Type this person's name.",
    accept: person.aliases,
  };
}

function questionsFor(ids: readonly string[], kind: "name" | "place" | DetailKind): Question[] {
  return ids.map((id, index) => {
    const person = byId(id);
    if (kind === "name") return nameQuestion(person);
    const chosen = kind === "place" ? (index % 2 === 0 ? "state" : "bench") : kind;
    return detailQuestion(person, chosen);
  });
}

const roster = [
  "revanth-reddy",
  "bhatti-vikramarka",
  "uttam-kumar-reddy",
  "damodar-rajanarsimha",
  "ponguleti-srinivas-reddy",
  "ponnam-prabhakar",
  "seethakka",
  "shiv-pratap-shukla",
  "jishnu-dev-varma",
  "cp-radhakrishnan",
  "tamilisai-soundararajan",
  "esl-narasimhan",
  "kcr",
  "ktr",
  "harish-rao",
  "akbaruddin-owaisi",
  "sabitha-indra-reddy",
  "kishan-reddy",
  "bandi-sanjay",
  "chandrababu-naidu",
  "pawan-kalyan",
  "nara-lokesh",
  "satya-kumar-yadav",
  "nadendla-manohar",
  "vangalapudi-anitha",
  "payyavula-keshav",
  "abdul-nazeer",
  "harichandan",
  "jagan",
  "sharmila",
] as const;

export type Paper = {
  id: string;
  number: number;
  title: string;
  blurb: string;
  questions: Question[];
};

export const papers: Paper[] = [
  {
    id: "names",
    number: 1,
    title: "Names",
    blurb: "Look at the photo and type the person's name.",
    questions: questionsFor(roster.slice(0, 25), "name"),
  },
  {
    id: "parties",
    number: 2,
    title: "Parties",
    blurb: "Look at the photo and type the party. Appointed posts use Appointed.",
    questions: questionsFor(roster.slice(5), "party"),
  },
  {
    id: "posts",
    number: 3,
    title: "Posts",
    blurb: "Look at the photo and type the post, such as Chief Minister or Governor.",
    questions: questionsFor([...roster.slice(0, 15), ...roster.slice(20)], "role"),
  },
  {
    id: "places",
    number: 4,
    title: "State and side",
    blurb: "Type the state, or whether they are in the government, the opposition, or a governor.",
    questions: questionsFor([...roster.slice(10), ...roster.slice(0, 5)], "place"),
  },
];

for (const paper of papers) {
  if (paper.questions.length !== 25) {
    throw new Error(`${paper.title} must have 25 questions. It has ${paper.questions.length}.`);
  }
}

export function getPaper(id: string) {
  return papers.find((paper) => paper.id === id);
}

export function questionPerson(question: Question) {
  return byId(question.personId);
}
