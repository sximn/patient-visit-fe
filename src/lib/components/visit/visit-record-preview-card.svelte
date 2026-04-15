<script lang="ts">
  import { Calendar, Clock, Stethoscope } from "@lucide/svelte";
  import type { PatientVisitRecord, VisitStatus } from "../../types";
  import { formatDate, formatTime } from "../../utils/date";

  let {
    record,
  }: {
    record: PatientVisitRecord;
  } = $props();

  const statusConfig: Record<VisitStatus, { label: string; class: string }> = {
    open: { label: "Otvorený", class: "badge-primary" },
    closed: { label: "Uzavretý", class: "badge-secondary" },
    archived: { label: "Archivovaný", class: "badge-outline" },
    deleted: { label: "Vymazaný", class: "badge-warning" },
  };
</script>

<div
  class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
>
  <div class="card-body p-6">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-base-content">
            <Stethoscope size="18" />
            <h3 class="card-title text-lg">{record.doctorName}</h3>
          </div>

          <div class="badge {statusConfig[record.status].class}">
            {statusConfig[record.status].label}
          </div>
        </div>

        <div class="flex items-center gap-4 mt-1 text-sm text-base-content/60">
          <span class="flex items-center gap-1">
            <Calendar size="14" />
            {formatDate(record.visitDate)}
          </span>

          <span class="flex items-center gap-1">
            <Clock size="14" />
            {formatDate(record.updatedAt)}
            {formatTime(record.updatedAt)}
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-3 text-sm mt-4">
      <p><strong>Anamnéza:</strong> {record.anamnesis}</p>
      <p><strong>Nález:</strong> {record.findings}</p>
      <p><strong>Záver:</strong> {record.conclusion}</p>

      {#if record.notes}
        <p><strong>Poznámky:</strong> {record.notes}</p>
      {/if}
    </div>
  </div>
</div>
