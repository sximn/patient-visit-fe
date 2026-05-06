<script lang="ts">
  import { Plus, FileText } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";
  import { createEmptyRecordForm } from "../utils/record-form";
  import type { PatientVisitRecord } from "../types";
  import VisitRecordActionCard from "./visit/visit-record-action-card.svelte";
  import VisitRecordDialog from "./visit/visit-record-dialog.svelte";
  import ConfirmDeleteDialog from "./common/confirm-delete-dialog.svelte";
  import ConfirmArchiveDialog from "./common/confirm-archive-dialog.svelte";
  import { onMount } from "svelte";
  import { useApiContext } from "../api/api.svelte";
  import { mapFormDataToCreateUpdateVisit } from "../api/mapper";

  let {
    initializeData,
  }: {
    initializeData?: () => void;
  } = $props();

  const {
    currentUser,
    records,
    patients,
    addRecord,
    updateRecord,
    archiveRecord,
    deleteRecord,
  } = $derived(useVisitContext());

  const apiContext = useApiContext();

  const doctorRecords = $derived(
    records.filter((r) => r.doctorId === currentUser?.id),
  );

  let activeDialog = $state<"create" | "edit" | null>(null);
  let selectedRecord = $state<PatientVisitRecord | null>(null);
  let pendingArchiveId = $state<string | null>(null);
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

  async function handleSubmit() {
    if (!currentUser) {
      console.error("user not initialized");
      return;
    }

    if (activeDialog === "create") {
      const patient = patients.find((p) => p.id === formData.patientId);

      if (!patient) return;

      const { data, error } = await apiContext.createPatientVisit(
        mapFormDataToCreateUpdateVisit({
          doctorId: currentUser.id,
          record: formData,
        }),
      );

      if (error) {
        console.error("failed to perform", activeDialog, error);
        return;
      }

      const generatedId = data.id;
      if (!generatedId) {
        console.error("faield to retrieve data, refresh the page", error);
        return;
      }

      addRecord(generatedId, {
        ...formData,
        patientName: patient.name,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
      });
    }

    if (activeDialog === "edit" && selectedRecord) {
      const { error } = await apiContext.updatePatientVisit(
        selectedRecord.id,
        mapFormDataToCreateUpdateVisit({
          doctorId: currentUser.id,
          record: formData,
        }),
      );

      if (error) {
        console.error("failed to perform", activeDialog, error);
        return;
      }
      updateRecord(selectedRecord.id, formData);
    }

    activeDialog = null;
  }

  function confirmArchive() {
    if (!pendingArchiveId) return;

    archiveRecord(pendingArchiveId);
    pendingArchiveId = null;
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;

    const { error } = await apiContext.deletePatientVisit(pendingDeleteId);
    if (error) {
      console.error("failed to delete record", error);
      return;
    }
    deleteRecord(pendingDeleteId);

    pendingDeleteId = null;
  }

  onMount(() => {
    initializeData?.();
  });
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
        <VisitRecordActionCard
          {record}
          onEdit={() => openEdit(record)}
          onArchive={() => (pendingArchiveId = record.id)}
          onDelete={() => (pendingDeleteId = record.id)}
        />
      {/each}
    </div>
  {/if}
</div>

<VisitRecordDialog
  open={!!activeDialog}
  mode={activeDialog ?? "create"}
  bind:formData
  onSubmit={handleSubmit}
  onClose={() => (activeDialog = null)}
/>

<ConfirmArchiveDialog
  open={pendingArchiveId !== null}
  onConfirm={confirmArchive}
  onClose={() => (pendingArchiveId = null)}
/>

<ConfirmDeleteDialog
  open={pendingDeleteId !== null}
  onConfirm={confirmDelete}
  onClose={() => (pendingDeleteId = null)}
/>
