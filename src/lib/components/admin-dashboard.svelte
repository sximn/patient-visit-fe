<script lang="ts">
  import { FileText, Funnel } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";
  import { createEmptyRecordForm } from "../utils/record-form";
  import type { PatientVisitRecord } from "../types";
  import VisitFilter from "./visit/visit-filter.svelte";
  import { formatDate } from "../utils/date";
  import VisitStatusBadge from "./visit/visit-status-badge.svelte";
  import AdminVisitRecordDialog from "./visit/admin-visit-record-dialog.svelte";

  const { records, doctors } = $derived(useVisitContext());

  const doctorRecords = $derived(records);

  let selectedRecord = $state<PatientVisitRecord | null>(null);
  let openRecordDialog = $state(false);
  let formData = $state(createEmptyRecordForm());
  let filterEl: ReturnType<typeof VisitFilter>;

  function handleRecordSelected(record: PatientVisitRecord) {
    openRecordDialog = true;
    selectedRecord = record;
    formData = {
      ...selectedRecord,
    };
  }
</script>

<div class="container grid mx-auto px-4 py-6 gap-6">
  <div class="flex justify-between">
    <div>
      <h2 class="text-2xl font-bold text-foreground">Správa záznamov</h2>
      <p class="text-muted-foreground">Vyhľadávanie a audit dokumentácie</p>
    </div>
  </div>

  <div
    class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
  >
    <div class="card-body p-6">
      <div class="flex gap-2 justify-start items-center">
        <Funnel size="18" />
        <h3 class="card-title text-lg">Filtre vyhľadávania</h3>
      </div>

      <VisitFilter {doctors} bind:this={filterEl} />
    </div>

    <div
      class="flex items-center justify-between mt-4 p-4 border-t border-base-300"
    >
      <p class="text-sm text-muted-foreground">
        Nájdených:
        <span class="font-medium text-foreground">{0}</span>
        záznamov
      </p>
      <div class="flex items-center gap-2">
        <button class="btn btn-block" onclick={() => filterEl.clearFilters()}>
          Vyčistiť filtre
        </button>
      </div>
    </div>
  </div>

  {#if doctorRecords.length === 0}
    <div class="card py-12 text-center">
      <FileText size="48" class="mx-auto opacity-30 mb-6" />
      <p class="text-muted-foreground text-sm">
        Neboli nájdené žiadne záznamy o návštevách ambulancie.
      </p>
    </div>
  {:else}
    <div
      class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
    >
      <div class="card-body p-6">
        <div>
          <h3 class="card-title text-lg">Výsledky vyhľadávania</h3>
          <p>Kliknite na záznam pre zobrazenie detailov</p>
        </div>

        <div
          class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100"
        >
          <table class="table table-sm table-auto w-full">
            <thead>
              <tr>
                <th>Pacient</th>
                <th>Lekár</th>
                <th>Dátum</th>
                <th>Stav</th>
              </tr>
            </thead>
            <tbody>
              {#each doctorRecords as record, i (record.id)}
                {@const bg = i % 2 === 0 ? "bg-background" : "bg-base-200"}
                {@const hoverBg =
                  i % 2 === 0 ? "hover:bg-base-300/70" : "hover:bg-base-300/90"}
                <tr
                  class="{bg} {hoverBg} cursor-pointer"
                  onclick={() => handleRecordSelected(record)}
                >
                  <td>
                    {record.patientName}
                  </td>
                  <td>
                    {record.doctorName}
                  </td>
                  <td>
                    {formatDate(record.createdAt)}
                  </td>
                  <td>
                    <VisitStatusBadge status={record.status} />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>

{#if selectedRecord}
  <AdminVisitRecordDialog record={selectedRecord} />
{/if}
