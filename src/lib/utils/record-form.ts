import type { VisitStatus } from "../types";

export function createEmptyRecordForm() {
  return {
    patientId: "",
    visitDate: new Date().toISOString().split("T")[0],
    anamnesis: "",
    findings: "",
    conclusion: "",
    notes: "",
    status: "open" as VisitStatus,
  };
}

export type RecordForm = ReturnType<typeof createEmptyRecordForm>;
