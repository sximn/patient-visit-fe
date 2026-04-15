<script lang="ts">
  import { untrack } from "svelte";

  type Item = {
    id: string;
    name: string;
  };

  let {
    value = "",
    fetchFn,
    onItemSelected,
    placeholder = "Hľadaj...",
  }: {
    value?: string;
    fetchFn: (query: string) => Promise<Item[]>;
    onItemSelected?: (selected: Item) => void;
    placeholder?: string;
  } = $props();

  let query = $state(untrack(() => value));
  let results = $state<Item[]>([]);
  let open = $state(false);
  let loading = $state(false);

  let highlightedIndex = $state(-1);

  let debounceTimer: ReturnType<typeof setTimeout>;
  let rootEl: HTMLDivElement;

  function selectItem(item: Item) {
    query = item.name;
    open = false;
    highlightedIndex = -1;

    onItemSelected?.(item);
  }

  async function search(q: string) {
    if (!q.trim()) {
      results = [];
      open = false;
      return;
    }

    loading = true;

    try {
      results = await fetchFn(q);
      highlightedIndex = -1;
    } finally {
      loading = false;
    }
  }

  function onInput(e: Event) {
    query = (e.target as HTMLInputElement).value;

    loading = true;
    open = true;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      search(query);
    }, 250);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open && e.key !== "ArrowDown") return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, results.length - 1);
        open = true;
        break;

      case "ArrowUp":
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        break;

      case "Enter":
        e.preventDefault();
        if (results[highlightedIndex]) {
          selectItem(results[highlightedIndex]);
        }
        break;

      case "Escape":
        open = false;
        highlightedIndex = -1;
        break;
    }
  }

  function onBlur() {
    setTimeout(() => {
      open = false;
    }, 150);
  }

  function onFocus() {
    if (results.length > 0) open = true;
  }

  function onMouseDownItem(e: Event, item: Item) {
    e.preventDefault();
    selectItem(item);
  }
</script>

<div class="relative w-full" bind:this={rootEl}>
  <input
    class="input input-bordered w-full"
    bind:value={query}
    {placeholder}
    oninput={onInput}
    onkeydown={onKeyDown}
    onfocus={onFocus}
    onblur={onBlur}
    autocomplete="off"
  />

  {#if open}
    <ul
      class="menu bg-base-100 rounded-box shadow-lg w-full absolute z-50 mt-1 max-h-64 overflow-y-auto border border-accent"
    >
      {#if loading}
        <li class="p-2 text-sm opacity-60">Vyhľadávanie...</li>
      {:else if results.length === 0}
        <li class="p-2 text-sm opacity-60 italic">
          Nenašli sa žiadne výsledky
        </li>
      {:else}
        {#each results as item, i}
          <li>
            <button
              type="button"
              class={i === highlightedIndex ? "bg-accent" : ""}
              onmousedown={(e) => onMouseDownItem(e, item)}
            >
              {item.name}
            </button>
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>
