<svelte:options customElement="sukus-patient-visit-documentation-app" />

<script module>
  import appStyles from "../app.css?inline";
  import AppShellRouter from "../lib/components/app-shell-router.svelte";
  import type { Theme } from "../lib/types";
</script>

<script lang="ts">
  let theme: Theme = $state("dark");
  const styles = "<style>" + appStyles + "</style>";
</script>

{@html styles}

<div class="size-full" data-theme={theme}>
  <AppShellRouter bind:theme />
</div>
