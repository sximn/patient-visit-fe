import type { VisitStatus } from "../types";

export const statusConfig: Record<
  VisitStatus,
  { label: string; class: string }
> = {
  open: { label: "Otvorený", class: "badge-primary" },
  closed: { label: "Uzavretý", class: "badge-secondary" },
  archived: { label: "Archivovaný", class: "badge-outline" },
  deleted: { label: "Vymazaný", class: "badge-warning" },
};
