import { describe, it, expect } from "vitest";
import {
  mapPatientToUser,
  mapDoctorToUser,
  mapPatientVisitToRecord,
  mapFormDataToCreateUpdateVisit,
} from "./mapper";
import { createEmptyRecordForm } from "../utils/record-form";

const validPatient = {
  id: "p1",
  email: "p@test.com",
  name: "John Doe",
  role: "patient" as const,
};
const validDoctor = {
  id: "d1",
  email: "d@test.com",
  name: "Dr. House",
  role: "doctor" as const,
};
const validVisit = {
  id: "v1",
  patientId: "p1",
  patientName: "John Doe",
  doctorId: "d1",
  doctorName: "Dr. House",
  visitDate: "2026-05-05",
  anamnesis: "headache",
  findings: "nothing serious",
  conclusion: "rest",
  notes: "follow up",
  status: "open" as const,
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
};

describe("mapPatientToUser", () => {
  it("maps a valid patient to a User", () => {
    expect(mapPatientToUser(validPatient)).toEqual(validPatient);
  });

  it("returns null when a required field is missing", () => {
    expect(mapPatientToUser({ ...validPatient, id: undefined })).toBeNull();
    expect(mapPatientToUser({ ...validPatient, email: undefined })).toBeNull();
  });
});

describe("mapDoctorToUser", () => {
  it("maps a valid doctor to a User", () => {
    expect(mapDoctorToUser(validDoctor)).toEqual(validDoctor);
  });

  it("returns null when a required field is missing", () => {
    expect(mapDoctorToUser({ ...validDoctor, name: undefined })).toBeNull();
  });
});

describe("mapPatientVisitToRecord", () => {
  it("maps a valid visit to a PatientVisitRecord", () => {
    const record = mapPatientVisitToRecord(validVisit);
    expect(record).toMatchObject({ id: "v1", patientId: "p1", status: "open" });
    expect(record?.deletedAt).toBeNull();
  });

  it("defaults notes to empty string when missing", () => {
    const record = mapPatientVisitToRecord({ ...validVisit, notes: undefined });
    expect(record?.notes).toBe("");
  });

  it("returns null when a required field is missing", () => {
    expect(
      mapPatientVisitToRecord({ ...validVisit, conclusion: undefined }),
    ).toBeNull();
    expect(
      mapPatientVisitToRecord({ ...validVisit, patientId: undefined }),
    ).toBeNull();
  });
});

describe("mapFormDataToCreateUpdateVisit", () => {
  it("merges doctorId with the record form", () => {
    const form = createEmptyRecordForm();
    expect(
      mapFormDataToCreateUpdateVisit({ doctorId: "d1", record: form }),
    ).toEqual({ doctorId: "d1", ...form });
  });
});
