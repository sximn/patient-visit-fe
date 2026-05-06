<script lang="ts">
  import RoleSelector from "./role-selector.svelte";
  import { setVisitContext } from "../visit.svelte.js";
  import AppHeader from "./app-header.svelte";
  import type { PatientVisitRecord, Theme, User } from "../types";
  import DoctorDashboard from "./doctor-dashboard.svelte";
  import PatientDashboard from "./patient-dashboard.svelte";
  import AdminDashboard from "./admin-dashboard.svelte";
  import { onMount } from "svelte";
  import { useApiContext } from "../api/api.svelte";
  import {
    mapDoctorToUser,
    mapPatientToUser,
    mapPatientVisitToRecord,
  } from "../api/mapper";
  import type { components } from "../api/api-schema";

  let {
    theme = $bindable(),
  }: {
    theme: Theme;
  } = $props();

  const visitStore = setVisitContext();
  const apiContext = useApiContext();

  async function fetchAndStorePatients() {
    const { data, error } = await apiContext.fetchPatients();
    if (error || !data) {
      return;
    }

    const patients: User[] = [];
    data.forEach((p) => {
      const user = mapPatientToUser(p);
      if (user) {
        patients.push(user);
      } else {
        console.error("cannot parse patient data", p);
      }
    });
    visitStore.patients = patients;
  }

  async function fetchAndStoreDoctors() {
    const { data, error } = await apiContext.fetchDoctors();
    if (error || !data) {
      return;
    }

    const doctors: User[] = [];
    data.forEach((d) => {
      const user = mapDoctorToUser(d);
      if (user) {
        doctors.push(user);
      } else {
        console.error("cannot parse doctor data", d);
      }
    });
    visitStore.doctors = doctors;
  }

  function mapAndStoreRecord(data: components["schemas"]["PatientVisit"][]) {
    const records: PatientVisitRecord[] = [];
    data.forEach((v) => {
      const record = mapPatientVisitToRecord(v);
      if (record) {
        records.push(record);
      } else {
        console.error("cannot parse visit record data", v);
      }
    });
    visitStore.records = records;
  }

  async function fetchAndStoreRecords() {
    const { data, error } = await apiContext.fetchAllVisits();
    if (error || !data) {
      return;
    }
    mapAndStoreRecord(data);
  }
  async function fetchAndStoreDoctorRecords(doctorId: string) {
    const { data, error } = await apiContext.fetchDoctorVisits(doctorId);
    if (error || !data) {
      return;
    }
    mapAndStoreRecord(data);
  }
  async function fetchAndStorePatientRecords(patientId: string) {
    const { data, error } = await apiContext.fetchPatientVisits(patientId);
    if (error || !data) {
      return;
    }
    mapAndStoreRecord(data);
  }

  function initializeData() {
    const user = visitStore.currentUser;
    if (!user) {
      return;
    }

    const { role, id } = user;

    switch (role) {
      case "admin":
        fetchAndStoreDoctors();
        fetchAndStorePatients();
        fetchAndStoreRecords();
        break;

      case "doctor":
        fetchAndStorePatients();
        fetchAndStoreDoctorRecords(id);
        break;

      case "patient":
        fetchAndStorePatientRecords(id);
        break;
    }
  }

  onMount(async () => {
    // dev only:
    // visitStore.setCurrentUser(mockUsers.filter((u) => u.role === "admin")[0]);
  });
</script>

{#if !visitStore.currentUser}
  <RoleSelector />
{:else}
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader bind:theme />
    <main>
      {#if visitStore.currentUser.role === "doctor"}
        <DoctorDashboard {initializeData} />
      {:else if visitStore.currentUser.role === "patient"}
        <PatientDashboard {initializeData} />
      {:else if visitStore.currentUser.role === "admin"}
        <AdminDashboard {initializeData} />
      {/if}
    </main>
  </div>
{/if}
