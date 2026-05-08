import type { User } from "../../types";

export function searchPatients(query: string, patients: User[]): User[] {
  const q = query.trim().toLowerCase();

  if (!q) return [];

  return patients.filter((user) => {
    return (
      user.role === "patient" &&
      (user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q))
    );
  });
}
