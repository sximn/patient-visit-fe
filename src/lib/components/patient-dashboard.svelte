<script lang="ts">
  import { FileText } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";
  import VisitRecordPreviewCard from "./visit/visit-record-preview-card.svelte";

  const { currentUser, records } = $derived(useVisitContext());

  const patientRecords = $derived(
    records.filter((r) => r.patientId === currentUser?.id),
  );
</script>

<div class="container mx-auto px-4 py-6">
  <div class="flex justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">
        Moja zdravotná dokumentácia
      </h2>
      <p class="text-muted-foreground">
        Prehľad záznamov z ambulantných návštev
      </p>
    </div>
  </div>

  {#if patientRecords.length === 0}
    <div class="card py-12 text-center">
      <FileText size="48" class="mx-auto opacity-30" />
      <h3 class="font-semibold text-foreground mb-2">Žiadne záznamy</h3>
      <p class="text-muted-foreground text-sm">
        Zatiaľ nemáte žiadne záznamy o návštevách ambulancie.
      </p>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each patientRecords as record (record.id)}
        <VisitRecordPreviewCard {record} />
      {/each}
    </div>
  {/if}
</div>
