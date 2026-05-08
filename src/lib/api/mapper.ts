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
