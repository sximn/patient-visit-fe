export type Theme = "dark" | "light";

export type UserRole = "doctor" | "patient" | "admin";

export type User = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
};

export const VISIT_STATUSES = [
  "open",
  "closed",
  "archived",
  "deleted", // TODO: -> initially wanted to implement soft delete, but assignment requires CRUD fullstack functionality, so we delete the record from the DB | so I should remove the status ... ale necham ho tu, aby prezila aspon myslienka soft deletu
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export type PatientVisitRecord = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  anamnesis: string;
  findings: string;
  conclusion: string;
  notes: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
