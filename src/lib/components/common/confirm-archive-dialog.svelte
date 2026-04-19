<script lang="ts">
  let {
    open = false,
    onConfirm,
    onClose,
  }: {
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
  } = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (open) dialog?.showModal();
    else dialog?.close();
  });
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Archivovať záznam?</h3>

    <p class="py-4 text-base-content/70">
      Táto akcia je nevratná. Záznam bude archivovaný a nebude možné ho ďalej
      upravovať.
    </p>

    <div class="modal-action">
      <button class="btn" onclick={onClose}>Zrušiť</button>

      <button class="btn btn-accent" onclick={onConfirm}>Archivovať</button>
    </div>
  </div>
</dialog>
