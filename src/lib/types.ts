export type Theme = "dark" | "light";

export type UserRole = "doctor" | "patient" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type VisitStatus = "open" | "closed" | "archived" | "deleted";

export interface PatientVisitRecord {
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
}

export interface SearchFilters {
  patientName?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: VisitStatus | "all";
}
