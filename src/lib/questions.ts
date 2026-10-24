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
      marks: 1,
    };
  }

  if (kind === "role") {
    return {
      id: `${person.id}:role`,
      personId: person.id,
      prompt: "Type this person's post.",
      accept: person.roleAliases,
      marks: 1,
    };
  }

  if (kind === "bench") {
    return {
      id: `${person.id}:bench`,
      personId: person.id,
      prompt: "Where does this person sit? Type state government, opposition, governor, or Union government.",
      accept: person.benchAliases,
      marks: 1,
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
    marks: 1,
  };
}

function nameQuestion(person: Person): Question {
  return {
    id: `${person.id}:name`,
    personId: person.id,
    prompt: "Type this person's name.",
    accept: person.aliases,
    marks: 1,
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

function shortQuestions(ids: readonly string[], kind: "name" | "place" | DetailKind): Question[] {
  return questionsFor(ids, kind).map((question) => ({ ...question, marks: 1 as const }));
}

function longQuestion(person: Person): Question {
  return {
    id: `${person.id}:long`,
    personId: person.id,
    marks: 3,
    prompt:
      "Write one sentence. Include the post, the party, and where they sit: state government, opposition, governor, or Union government. All three are required for 3 marks.",
    accept: [`${person.role}; ${person.party}; ${person.benchLabel}`],
    parts: [person.roleAliases, person.partyAliases, person.benchAliases],
  };
}

function mixedPaper(shortIds: readonly string[], longIds: readonly string[], kind: "name" | "place" | DetailKind) {
  return [...shortQuestions(shortIds, kind), ...longIds.map((id) => longQuestion(byId(id)))];
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
    blurb: "Ten names are 1 mark. Five sentences are 3 marks each.",
    questions: mixedPaper(roster.slice(0, 10), roster.slice(10, 15), "name"),
  },
  {
    id: "parties",
    number: 2,
    title: "Parties",
    blurb: "Ten parties are 1 mark. Five sentences are 3 marks each. Appointed posts use Appointed.",
    questions: mixedPaper(roster.slice(15, 25), roster.slice(25, 30), "party"),
  },
  {
    id: "posts",
    number: 3,
    title: "Posts",
    blurb: "Ten posts are 1 mark. Five sentences are 3 marks each.",
    questions: mixedPaper(roster.slice(5, 15), roster.slice(20, 25), "role"),
  },
  {
    id: "places",
    number: 4,
    title: "State and side",
    blurb: "Ten state or side answers are 1 mark. Five sentences are 3 marks each.",
    questions: mixedPaper(roster.slice(10, 20), roster.slice(0, 5), "place"),
  },
];

for (const paper of papers) {
  const shortCount = paper.questions.filter((question) => question.marks === 1).length;
  const longCount = paper.questions.filter((question) => question.marks === 3).length;
  const total = paper.questions.reduce((sum, question) => sum + question.marks, 0);
  if (paper.questions.length !== 15 || shortCount !== 10 || longCount !== 5 || total !== 25) {
    throw new Error(
      `${paper.title} must have 10 short and 5 long questions, 25 marks. It has ${paper.questions.length} questions and ${total} marks.`,
    );
  }
}

export function paperMarks(questions: Question[]) {
  return questions.reduce((sum, question) => sum + question.marks, 0);
}

export function getPaper(id: string) {
  return papers.find((paper) => paper.id === id);
}

export function questionPerson(question: Question) {
  return byId(question.personId);
}
