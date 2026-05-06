<script lang="ts">
  import type { Snippet } from "svelte";
  import { createApiContext } from "../api/api.svelte";

  let {
    children,
    basePath,
    apiBase,
  }: {
    basePath: string;
    apiBase: string;
    children?: Snippet;
  } = $props();

  // svelte-ignore state_referenced_locally
  const api = createApiContext(basePath, apiBase);
</script>

{@render children?.()}
