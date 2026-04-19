<script lang="ts">
  import type { VisitStatus } from "../../types";
  import { statusConfig } from "../../utils/visit-status";

  let {
    status,
  }: {
    status: VisitStatus;
  } = $props();

  const badgeClass = $derived(statusConfig[status].class);
  const label = $derived(statusConfig[status].label);
</script>

<div class="badge {badgeClass}">
  {label}
</div>
