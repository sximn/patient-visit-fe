import type { PatientVisitRecord, User } from "../types";
import type { RecordForm } from "../utils/record-form";
import type { components, paths } from "./api-schema";

type PatientSuccessResponse =
  paths["/patients"]["get"]["responses"][200]["content"]["application/json"];

type DoctorSuccessResponse =
  paths["/doctors"]["get"]["responses"][200]["content"]["application/json"];

export function mapPatientToUser(patient: PatientSuccessResponse[number]) {
  if (!patient.id || !patient.email || !patient.name || !patient.role) {
    return null;
  }
  let u: User = {
    id: patient.id,
    email: patient.email,
    name: patient.name,
    role: patient.role,
  };
  return u;
}

export function mapDoctorToUser(doctor: DoctorSuccessResponse[number]) {
  if (!doctor.id || !doctor.email || !doctor.name || !doctor.role) {
    return null;
  }
  let u: User = {
    id: doctor.id,
    email: doctor.email,
    name: doctor.name,
    role: doctor.role,
  };
  return u;
}

export function mapPatientVisitToRecord(
  visit: components["schemas"]["PatientVisit"],
) {
  /*
    {
        "id": "2282ba60-7c96-4ab0-bb19-945237cd3850",
        "patientId": "p3",
        "patientName": "Niekto Další",
        "doctorId": "d1",
        "doctorName": "MUDr. Šefko Doktor",
        "visitDate": "2026-05-05",
        "anamnesis": "Nieco zle to vyzera byt",
        "findings": "Nejaky nebezpecny nalez\n",
        "notes": "treba to riesit veru",
        "status": "open",
        "createdAt": "2026-05-05T17:51:45.346Z",
        "updatedAt": "2026-05-05T17:51:45.346Z"
    }
    */
  if (
    !visit.id ||
    !visit.patientId ||
    !visit.patientName ||
    !visit.doctorId ||
    !visit.doctorName ||
    !visit.visitDate ||
    !visit.anamnesis ||
    !visit.findings ||
    !visit.conclusion ||
    !visit.status ||
    !visit.createdAt ||
    !visit.updatedAt
  ) {
    return null;
  }
  let record: PatientVisitRecord = {
    id: visit.id,
    patientId: visit.patientId,
    patientName: visit.patientName,
    doctorId: visit.doctorId,
    doctorName: visit.doctorName,
    visitDate: visit.visitDate,
    anamnesis: visit.anamnesis,
    findings: visit.findings,
    conclusion: visit.conclusion,
    notes: visit.notes ?? "", // notes are optional
    status: visit.status,
    createdAt: visit.createdAt,
    updatedAt: visit.updatedAt,
    deletedAt: null,
  };
  return record;
}

export function mapFormDataToCreateUpdateVisit({
  doctorId,
  record,
}: {
  doctorId: string;
  record: RecordForm;
}): components["schemas"]["PatientVisitCreateUpdate"] {
  return {
    doctorId,
    ...record,
  };
}
