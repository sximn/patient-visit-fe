<script module lang="ts">
  export type Filter = {
    patientId?: User["id"];
    doctorId?: User["id"];
    visitDateSince?: string;
    visitDateUntil?: string;
    status?: VisitStatus;
  };
</script>

<script lang="ts">
  import { VISIT_STATUSES, type User, type VisitStatus } from "../../types";
  import { statusConfig } from "../../utils/visit-status";
  import { useVisitContext } from "../../visit.svelte";
  import PatientAutocomplete from "../common/patient-autocomplete.svelte";
  import { searchPatients } from "../common/patient-search";

  let {
    doctors,
    onFilterChange,
  }: {
    doctors: User[];
    onFilterChange?: (filter: Filter) => void;
  } = $props();

  const visitStore = useVisitContext();

  let patientAutocompleteEl: ReturnType<typeof PatientAutocomplete>;
  let filterData: Filter = $state({});

  $effect(() => {
    onFilterChange?.(filterData);
  });

  function handlePatientSelect(patient: { id: string; name: string }) {
    filterData.patientId = patient.id;
  }

  export async function asyncSearchPatients(query: string): Promise<User[]> {
    return Promise.try(searchPatients, query, visitStore.patients);
  }

  export function clearFilters() {
    filterData = {};
    patientAutocompleteEl.clearSearch();
    // onFilterChange?.(filterData);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <div class="space-y-2">
    <label class="label" for="patient">
      <span class="label-text">
        Pacient <span class="text-warning">*</span>
      </span>
    </label>
    <PatientAutocomplete
      bind:this={patientAutocompleteEl}
      id="patient"
      name="patient"
      fetchFn={asyncSearchPatients}
      onItemSelected={(i) => handlePatientSelect(i)}
    />
  </div>

  <div class="space-y-2">
    <label class="label" for="doctor">
      <span class="label-text">
        Lekár <span class="text-warning">*</span>
      </span>
    </label>
    <select
      id="doctor"
      name="doctor"
      class="select select-bordered w-full"
      bind:value={filterData.doctorId}
    >
      <option value={undefined}>Vybrať</option>
      {#each doctors as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
  </div>

  <div class="space-y-2">
    <label class="label" for="date-since">
      <span class="label-text">Dátum od</span>
    </label>
    <input
      id="date-since"
      name="date-since"
      type="date"
      class="input input-bordered"
      bind:value={filterData.visitDateSince}
    />
  </div>
  <div class="space-y-2">
    <label class="label" for="date-until">
      <span class="label-text">Dátum do</span>
    </label>
    <input
      id="date-until"
      name="date-until"
      type="date"
      class="input input-bordered"
      bind:value={filterData.visitDateUntil}
    />
  </div>
  <div class="space-y-2">
    <label class="label w-full text-base-content" for="status">
      <span class="label-text">Stav</span>
    </label>
    <select
      class="select select-bordered"
      id="status"
      name="status"
      bind:value={filterData.status}
    >
      <option value={undefined}>Všetky stavy</option>
      {#each VISIT_STATUSES as status}
        <option value={status}>{statusConfig[status].label}</option>
      {/each}
    </select>
  </div>
</div>
