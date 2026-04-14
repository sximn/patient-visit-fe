import { getContext, setContext } from "svelte";
import type { PatientVisitRecord, User } from "./types";
import { mockUsers, mockVisitRecords } from "./mocks";

class VisitStore {
  currentUser = $state<User | null>(null);
  records = $state<PatientVisitRecord[]>(mockVisitRecords);
  users = $state<User[]>(mockUsers);

  doctors = $derived(this.users.filter((u) => u.role === "doctor"));
  patients = $derived(this.users.filter((u) => u.role === "patient"));

  setCurrentUser = (user: User | null) => {
    this.currentUser = user;
  };

  addRecord = (
    record: Omit<PatientVisitRecord, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const newRecord: PatientVisitRecord = {
      ...record,
      id: `v${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.records = [newRecord, ...this.records];
  };

  updateRecord = (id: string, updates: Partial<PatientVisitRecord>) => {
    const index = this.records.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.records[index] = {
        ...this.records[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  };

  archiveRecord = (id: string) => {
    this.updateRecord(id, { status: "archived" });
  };

  deleteRecord = (id: string) => {
    this.updateRecord(id, {
      status: "deleted",
      deletedAt: new Date().toISOString(),
    });
  };
}

const VISIT_KEY = Symbol("VISIT_CONTEXT");

export function setVisitContext() {
  return setContext(VISIT_KEY, new VisitStore());
}

export function useVisitContext() {
  const context = getContext<VisitStore>(VISIT_KEY);
  if (!context) {
    throw new Error("useVisitContext must be used after setVisitContext");
  }
  return context;
}
