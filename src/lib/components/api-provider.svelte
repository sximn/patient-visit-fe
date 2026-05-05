<script lang="ts">
  import type { Snippet } from "svelte";
  import { createApiContext } from "../api.svelte";

  let {
    children,
    basePath,
    apiBase,
  }: {
    basePath: string;
    apiBase: string;
    children?: Snippet;
  } = $props();

  const api = createApiContext(basePath, apiBase);
</script>

{@render children?.()}
