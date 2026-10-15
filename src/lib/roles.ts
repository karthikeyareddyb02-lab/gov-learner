import type { Person } from "@/lib/types";

export const roleGroups = [
  { id: "cm", label: "Chief Ministers", roles: ["Chief Minister"] },
  { id: "dcm", label: "Deputy Chief Ministers", roles: ["Deputy Chief Minister"] },
  { id: "governor", label: "Governors", roles: ["Governor"] },
  { id: "former-cm", label: "Former Chief Ministers", roles: ["Former Chief Minister"] },
  { id: "union", label: "Union government", roles: ["Vice President of India", "Union Minister", "Minister of State"] },
  { id: "minister", label: "Ministers", roles: ["Minister"] },
  { id: "former-governor", label: "Former Governors", roles: ["Former Governor"] },
  { id: "former-minister", label: "Former Ministers", roles: ["Former Minister"] },
  { id: "mla", label: "MLAs and party leaders", roles: ["MLA", "Congress president"] },
] as const;

const prominentIds = new Set([
  "revanth-reddy",
  "chandrababu-naidu",
  "kcr",
  "jagan",
  "shiv-pratap-shukla",
  "abdul-nazeer",
  "bhatti-vikramarka",
  "pawan-kalyan",
  "ponnam-prabhakar",
  "harish-rao",
  "ktr",
  "nara-lokesh",
  "kishan-reddy",
  "cp-radhakrishnan",
  "akbaruddin-owaisi",
  "sharmila",
]);

export function isProminent(person: Pick<Person, "id">) {
  return prominentIds.has(person.id);
}

export function roleGroupFor(role: string) {
  return roleGroups.find((group) => (group.roles as readonly string[]).includes(role));
}
