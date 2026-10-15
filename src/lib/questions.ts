import { people } from "@/data/people";
import type { Question } from "@/lib/types";

const detailKinds = ["party", "role", "bench", "state"] as const;

function detailQuestion(person: (typeof people)[number], kind: (typeof detailKinds)[number]): Question {
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

const nameQuestions: Question[] = people.map((person) => ({
  id: `${person.id}:name`,
  personId: person.id,
  prompt: "Type this person's name.",
  accept: person.aliases,
}));

const detailPeople = [
  "revanth-reddy",
  "kcr",
  "ponnam-prabhakar",
  "harish-rao",
  "jagan",
  "chandrababu-naidu",
  "shiv-pratap-shukla",
  "abdul-nazeer",
  "pawan-kalyan",
  "bhatti-vikramarka",
  "ktr",
  "nara-lokesh",
  "seethakka",
  "satya-kumar-yadav",
  "kishan-reddy",
  "bandi-sanjay",
  "esl-narasimhan",
  "tamilisai-soundararajan",
  "jishnu-dev-varma",
  "cp-radhakrishnan",
  "akbaruddin-owaisi",
  "sharmila",
  "harichandan",
  "uttam-kumar-reddy",
  "vangalapudi-anitha",
  "payyavula-keshav",
  "kandula-durgesh",
  "nadendla-manohar",
  "mohammed-azharuddin",
  "ponguleti-srinivas-reddy",
  "sabitha-indra-reddy",
  "errabelli-dayakar-rao",
  "talasani-srinivas-yadav",
  "srinivas-goud",
  "damodar-rajanarsimha",
  "komatireddy-venkat-reddy",
  "sridhar-babu",
  "jupally-krishna-rao",
  "adluri-laxman-kumar",
  "atchannaidu",
  "farooq",
  "sandhya-rani",
  "savitha",
  "gottipati-ravi",
].map((id) => {
  const person = people.find((item) => item.id === id);
  if (!person) throw new Error(`Missing person for the test: ${id}`);
  return person;
});

const extraQuestions = detailPeople.map((person, index) =>
  detailQuestion(person, detailKinds[index % detailKinds.length]),
);

export const testQuestions: Question[] = [...nameQuestions, ...extraQuestions];

if (testQuestions.length !== 100) {
  throw new Error(`The test must have 100 questions. It has ${testQuestions.length}.`);
}

export function questionPerson(question: Question) {
  const person = people.find((item) => item.id === question.personId);
  if (!person) throw new Error(question.personId);
  return person;
}
