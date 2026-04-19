<script lang="ts">
  import { SquarePen, Archive, Trash2, Calendar, Clock } from "@lucide/svelte";
  import type { PatientVisitRecord } from "../../types";
  import { formatDate, formatTime } from "../../utils/date";
  import { statusConfig } from "../../utils/visit-status";

  let {
    record,
    onEdit,
    onArchive,
    onDelete,
  }: {
    record: PatientVisitRecord;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
  } = $props();
</script>

<div
  class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
>
  <div class="card-body p-6">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-3">
          <h3 class="card-title text-lg">{record.patientName}</h3>

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

      <div class="flex gap-1">
        {#if !["archived", "deleted"].includes(record.status)}
          <div class="tooltip tooltip-accent" data-tip="Upraviť">
            <button class="btn btn-ghost btn-sm" onclick={onEdit}>
              <SquarePen size="16" />
            </button>
          </div>

          <div class="tooltip tooltip-accent" data-tip="Archivovať">
            <button class="btn btn-ghost btn-sm" onclick={onArchive}>
              <Archive size="16" />
            </button>
          </div>
        {/if}

        {#if record.status !== "deleted"}
          <div class="tooltip tooltip-accent" data-tip="Zmazať">
            <button
              class="btn btn-ghost btn-sm text-orange-600"
              onclick={onDelete}
            >
              <Trash2 size="16" />
            </button>
          </div>
        {/if}
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
