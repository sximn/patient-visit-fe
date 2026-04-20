<script lang="ts">
  import RoleSelector from "./role-selector.svelte";
  import { setVisitContext } from "../visit.svelte.js";
  import AppHeader from "./app-header.svelte";
  import type { Theme } from "../types";
  import DoctorDashboard from "./doctor-dashboard.svelte";
  import PatientDashboard from "./patient-dashboard.svelte";
  import AdminDashboard from "./admin-dashboard.svelte";
  import { onMount } from "svelte";
  import { mockUsers } from "../mocks";

  let {
    theme = $bindable(),
  }: {
    theme: Theme;
  } = $props();
  const visitStore = setVisitContext();

  onMount(() => {
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
        <DoctorDashboard />
      {:else if visitStore.currentUser.role === "patient"}
        <PatientDashboard />
      {:else if visitStore.currentUser.role === "admin"}
        <AdminDashboard />
      {/if}
    </main>
  </div>
{/if}
