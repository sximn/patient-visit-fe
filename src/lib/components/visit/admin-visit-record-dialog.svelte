<script lang="ts">
  import { onMount } from "svelte";
  import type { PatientVisitRecord } from "../../types";
  import { formatDate } from "../../utils/date";
  import VisitStatusBadge from "./visit-status-badge.svelte";

  let dialogEl: HTMLDialogElement;

  let {
    record,
  }: {
    record: PatientVisitRecord;
  } = $props();

  function closeDialog() {
    dialogEl?.close();
  }

  onMount(() => {
    dialogEl.show();
  });
</script>

<dialog bind:this={dialogEl} class="modal">
  <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg">
      Detail záznamu - {record.patientName}
    </h3>
    <p class="text-sm text-base-content/60 mb-4">
      {record.doctorName} | {formatDate(record.visitDate)}
    </p>

    {#if record}
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-base-content/60">ID záznamu:</span>
            <span class="ml-2 font-mono">{record.id}</span>
          </div>
          <div>
            <span class="text-base-content/60">Stav:</span>
            <VisitStatusBadge status={record.status} />
          </div>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-lg bg-base-200">
            <h4 class="text-sm font-medium mb-1">Anamnéza</h4>
            <p class="text-sm text-base-content/60">
              {record.anamnesis}
            </p>
          </div>

          <div class="p-3 rounded-lg bg-base-200">
            <h4 class="text-sm font-medium mb-1">Nález</h4>
            <p class="text-sm text-base-content/60">
              {record.findings}
            </p>
          </div>

          <div class="p-3 rounded-lg bg-base-200">
            <h4 class="text-sm font-medium mb-1">Záver</h4>
            <p class="text-sm text-base-content/60">
              {record.conclusion}
            </p>
          </div>

          {#if record.notes}
            <div class="p-3 rounded-lg bg-base-300">
              <h4 class="text-sm font-medium mb-1">Poznámky</h4>
              <p class="text-sm text-base-content/60">
                {record.notes}
              </p>
            </div>
          {/if}
        </div>

        <div class="text-xs text-base-content/60 pt-2 border-t">
          <p>
            Vytvorené:
            {formatDate(record.createdAt)}
          </p>
          <p>
            Aktualizované:
            {formatDate(record.updatedAt)}
          </p>
        </div>
      </div>
    {/if}

    <div class="modal-action">
      <button class="btn" onclick={closeDialog}>Zavrieť</button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
