<script lang="ts">
  import { Plus, FileText } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";
  import { createEmptyRecordForm } from "../utils/record-form";
  import type { PatientVisitRecord } from "../types";
  import VisitRecordCard from "./visit/visit-record-card.svelte";
  import VisitRecordDialog from "./visit/visit-record-dialog.svelte";
  import ConfirmDeleteDialog from "./common/confirm-delete-dialog.svelte";

  const {
    currentUser,
    records,
    patients,
    addRecord,
    updateRecord,
    archiveRecord,
    deleteRecord,
  } = $derived(useVisitContext());

  const doctorRecords = $derived(
    records.filter((r) => r.doctorId === currentUser?.id),
  );

  let activeDialog = $state<"create" | "edit" | null>(null);
  let selectedRecord = $state<PatientVisitRecord | null>(null);
  let pendingDeleteId = $state<string | null>(null);
  let formData = $state(createEmptyRecordForm());

  function openCreate() {
    formData = createEmptyRecordForm();
    selectedRecord = null;
    activeDialog = "create";
  }

  function openEdit(record: PatientVisitRecord) {
    selectedRecord = record;
    formData = {
      ...record,
    };

    activeDialog = "edit";
  }

  function handleSubmit() {
    if (activeDialog === "create") {
      const patient = patients.find((p) => p.id === formData.patientId);

      if (!patient || !currentUser) return;

      addRecord({
        ...formData,
        patientName: patient.name,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
      });
    }

    if (activeDialog === "edit" && selectedRecord) {
      updateRecord(selectedRecord.id, formData);
    }

    activeDialog = null;
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;

    deleteRecord(pendingDeleteId);

    pendingDeleteId = null;
  }
</script>

<div class="container mx-auto px-4 py-6">
  <div class="flex justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold">Moje záznamy</h2>
    </div>

    <button class="btn btn-primary" onclick={openCreate}>
      <Plus size="16" />
      Nový záznam
    </button>
  </div>

  {#if doctorRecords.length === 0}
    <div class="card py-12 text-center">
      <FileText size="48" class="mx-auto opacity-30" />

      <button class="btn btn-primary mt-4" onclick={openCreate}>
        Vytvoriť prvý záznam
      </button>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each doctorRecords as record (record.id)}
        <VisitRecordCard
          {record}
          onEdit={() => openEdit(record)}
          onArchive={() => archiveRecord(record.id)}
          onDelete={() => (pendingDeleteId = record.id)}
        />
      {/each}
    </div>
  {/if}
</div>

<VisitRecordDialog
  open={activeDialog !== null}
  mode={activeDialog ?? "create"}
  {patients}
  {formData}
  onSubmit={handleSubmit}
  onClose={() => (activeDialog = null)}
/>

<ConfirmDeleteDialog
  open={pendingDeleteId !== null}
  onConfirm={confirmDelete}
  onClose={() => (pendingDeleteId = null)}
/>
