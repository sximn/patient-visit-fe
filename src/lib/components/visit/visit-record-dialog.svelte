<script lang="ts">
  import { mockPatients } from "../../mocks";
  import type { User } from "../../types";
  import type { RecordForm } from "../../utils/record-form";
  import PatientAutocomplete from "../common/patient-autocomplete.svelte";

  let {
    open = false,
    mode,
    formData,
    onSubmit,
    onClose,
  }: {
    open: boolean;
    mode: "create" | "edit";
    formData: RecordForm;
    onSubmit: () => void;
    onClose: () => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let errors = $state({
    patientId: "",
    visitDate: "",
    anamnesis: "",
    findings: "",
  });

  $effect(() => {
    if (open) {
      dialog.showModal();
    }
  });

  function clearErrors() {
    errors = {
      patientId: "",
      visitDate: "",
      anamnesis: "",
      findings: "",
    };
  }

  function validate() {
    clearErrors();

    let valid = true;

    if (mode === "create" && !formData.patientId) {
      errors.patientId = "Vyberte pacienta";
      valid = false;
    }

    if (!formData.visitDate) {
      errors.visitDate = "Dátum návštevy je povinný";
      valid = false;
    }

    if (!formData.anamnesis.trim()) {
      errors.anamnesis = "Vyplňte Anamnézu";
      valid = false;
    }

    if (!formData.findings.trim()) {
      errors.findings = "Nález je povinný";
      valid = false;
    }

    return valid;
  }

  function handleCancel() {
    dialog.close();
    clearErrors();
    onClose?.();
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit?.();
  }

  function handleSelect(patient: { id: string; name: string }) {
    formData.patientId = patient.id;
    errors.patientId = "";
  }

  function fakeDelay(ms = 350) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  export async function searchPatients(query: string): Promise<User[]> {
    await fakeDelay(250 + Math.random() * 300);

    const q = query.trim().toLowerCase();

    if (!q) return [];

    return mockPatients.filter((user) => {
      return (
        user.role === "patient" &&
        (user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q))
      );
    });
  }
</script>

<dialog
  bind:this={dialog}
  class="modal modal-bottom sm:modal-middle"
  oncancel={handleCancel}
>
  <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg">
      {mode === "create" ? "Nový záznam" : "Upraviť záznam"}
    </h3>

    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if mode === "create"}
          <div class="space-y-2">
            <label class="label" for="patient">
              <span class="label-text">
                Pacient <span class="text-warning">*</span>
              </span>
            </label>

            <PatientAutocomplete
              fetchFn={searchPatients}
              onItemSelected={(i) => handleSelect(i)}
            />
            {#if errors.patientId}
              <p class="text-error text-sm">{errors.patientId}</p>
            {/if}
          </div>
        {/if}

        <div class="space-y-2">
          <label class="label" for="date">
            <span class="label-text">
              Dátum návštevy <span class="text-warning">*</span>
            </span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            class="input input-bordered"
            bind:value={formData.visitDate}
          />
          {#if errors.visitDate}
            <p class="text-error text-sm">{errors.visitDate}</p>
          {/if}
        </div>
      </div>

      <div class="space-y-2">
        <label class="label" for="anamnesis">
          <span class="label-text">
            Anamnéza <span class="text-warning">*</span>
          </span>
        </label>
        <textarea
          id="anamnesis"
          name="anamnesis"
          class="textarea textarea-bordered h-24 w-full"
          placeholder="Opíšte anamnézu..."
          bind:value={formData.anamnesis}
        ></textarea>
        {#if errors.anamnesis}
          <p class="text-error text-sm">{errors.anamnesis}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <label class="label" for="findings">
          <span class="label-text">
            Nález <span class="text-warning">*</span>
          </span>
        </label>
        <textarea
          id="findings"
          name="findings"
          class="textarea textarea-bordered h-24 w-full"
          placeholder="Opíšte klinický nález..."
          bind:value={formData.findings}
        ></textarea>
        {#if errors.findings}
          <p class="text-error text-sm">{errors.findings}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <label class="label" for="notes"
          ><span class="label-text">Poznámky</span></label
        >
        <textarea
          id="notes"
          name="notes"
          class="textarea textarea-bordered h-24 w-full"
          placeholder="Dodatočné poznámky (voliteľné)..."
          bind:value={formData.notes}
        ></textarea>
      </div>
    </div>

    {#if mode === "edit"}
      <label class="label w-full text-base-content">
        <span class="label-text">Stav</span>
        <select
          class="select select-bordered"
          id="status"
          name="status"
          bind:value={formData.status}
        >
          <option value="open">Otvorený</option>
          <option value="closed">Uzavretý</option>
        </select>
      </label>
    {/if}

    <div class="modal-action">
      <button class="btn" onclick={handleCancel}>Zrušiť</button>
      <button class="btn btn-primary" onclick={handleSubmit}>
        {mode === "create" ? "Vytvoriť" : "Uložiť"}
      </button>
    </div>
  </div>
</dialog>
