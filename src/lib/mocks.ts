import type { PatientVisitRecord, User } from "./types";

export const mockUsers: User[] = [
  {
    id: "d1",
    name: "MUDr. Šefko Doktor",
    role: "doctor",
    email: "sefko@nemocnica.sk",
  },
  {
    id: "d2",
    name: "MUDr. Vedúca Doktorka",
    role: "doctor",
    email: "veduxa@nemocnica.sk",
  },
  {
    id: "p1",
    name: "Lazar Pacientový",
    role: "patient",
    email: "lazar@email.sk",
  },
  {
    id: "p2",
    name: "Dedo Vsevedo",
    role: "patient",
    email: "dedo@email.sk",
  },
  { id: "p3", name: "Niekto Další", role: "patient", email: "niekto@email.sk" },
  {
    id: "a1",
    name: "Adminus Adminový",
    role: "admin",
    email: "admin@nemocnica.sk",
  },
];

// vygenerovane mock-y
export const mockVisitRecords: PatientVisitRecord[] = [
  {
    id: "v1",
    patientId: "p1",
    patientName: "Lazar Pacientový",
    doctorId: "d1",
    doctorName: "MUDr. Šefko Doktor",
    visitDate: "2026-04-10",
    anamnesis:
      "Pacient prichádza s bolesťami hlavy trvajúcimi 3 dni. Udáva stres v práci a nedostatok spánku.",
    findings:
      "TK 130/85, pulz 78/min. Neurologický nález negatívny. Šija voľná.",
    conclusion:
      "Tenzná bolesť hlavy. Odporúčam relaxáciu, úpravu spánkového režimu.",
    notes: "Kontrola o 2 týždne ak ťažkosti pretrvávajú.",
    status: "closed",
    createdAt: "2026-04-10T09:30:00Z",
    updatedAt: "2026-04-10T10:15:00Z",
    deletedAt: null,
  },
  {
    id: "v2",
    patientId: "p2",
    patientName: "Dedo Vsevedo",
    doctorId: "d1",
    doctorName: "MUDr. Šefko Doktor",
    visitDate: "2026-04-12",
    anamnesis: "Preventívna prehliadka. Pacientka bez aktuálnych ťažkostí.",
    findings: "TK 120/80, pulz 72/min. BMI 24. Auskultačne čisté dýchanie.",
    conclusion: "Zdravotný stav v norme. Ďalšia preventívna prehliadka o rok.",
    notes: "",
    status: "closed",
    createdAt: "2026-04-12T14:00:00Z",
    updatedAt: "2026-04-12T14:30:00Z",
    deletedAt: null,
  },
  {
    id: "v3",
    patientId: "p1",
    patientName: "Lazar Pacientový",
    doctorId: "d2",
    doctorName: "MUDr. Vedúca Doktorka",
    visitDate: "2026-04-13",
    anamnesis:
      "Kontrolná návšteva po liečbe antibiotikmi. Infekcia horných dýchacích ciest.",
    findings: "Hrdlo bez známok zápalu. Dýchanie čisté.",
    conclusion:
      "Infekcia vyliečená. Pacient môže pokračovať v bežných aktivitách.",
    notes: "",
    status: "open",
    createdAt: "2026-04-13T08:00:00Z",
    updatedAt: "2026-04-13T08:00:00Z",
    deletedAt: null,
  },
  {
    id: "v4",
    patientId: "p3",
    patientName: "Niekto Další",
    doctorId: "d1",
    doctorName: "MUDr. Šefko Doktor",
    visitDate: "2025-12-15",
    anamnesis: "Bolesti chrbta po námahe.",
    findings: "Obmedzená hybnosť v driekovej oblasti. Svalové napätie.",
    conclusion: "Lumbago. Odporúčaná rehabilitácia.",
    notes: "Archivovaný záznam - pacient preložený k inému lekárovi.",
    status: "archived",
    createdAt: "2025-12-15T11:00:00Z",
    updatedAt: "2026-01-20T09:00:00Z",
    deletedAt: null,
  },
];

export const mockPatients: User[] = [
  {
    id: "p1",
    name: "Lazar Pacientový",
    role: "patient",
    email: "lazar@email.sk",
  },
  {
    id: "p2",
    name: "Dedo Vsevedo",
    role: "patient",
    email: "dedo@email.sk",
  },
  {
    id: "p3",
    name: "Niekto Další",
    role: "patient",
    email: "niekto@email.sk",
  },
  {
    id: "u1",
    name: "Ján Novák",
    role: "patient",
    email: "jan.novak@example.com",
  },
  {
    id: "u2",
    name: "Mária Kováčová",
    role: "patient",
    email: "maria.kovacova@example.com",
  },
  {
    id: "u3",
    name: "Peter Horváth",
    role: "patient",
    email: "peter.horvath@example.com",
  },
  {
    id: "u4",
    name: "Lucia Bieliková",
    role: "patient",
    email: "lucia.bielikova@example.com",
  },
  {
    id: "u5",
    name: "Martin Šimek",
    role: "patient",
    email: "martin.simek@example.com",
  },
  {
    id: "u6",
    name: "Anna Králová",
    role: "patient",
    email: "anna.kralova@example.com",
  },
  {
    id: "u7",
    name: "Tomáš Varga",
    role: "patient",
    email: "tomas.varga@example.com",
  },
  {
    id: "u8",
    name: "Zuzana Poláková",
    role: "patient",
    email: "zuzana.polakova@example.com",
  },
  {
    id: "u9",
    name: "Michal Tóth",
    role: "patient",
    email: "michal.toth@example.com",
  },
  {
    id: "u10",
    name: "Eva Marková",
    role: "patient",
    email: "eva.markova@example.com",
  },
  {
    id: "u11",
    name: "Filip Urban",
    role: "patient",
    email: "filip.urban@example.com",
  },
  {
    id: "u12",
    name: "Barbora Sedláčková",
    role: "patient",
    email: "barbora.sedlackova@example.com",
  },
];
