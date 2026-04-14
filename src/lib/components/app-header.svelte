<script lang="ts">
  import type { Theme, UserRole } from "../types";
  import { Stethoscope, User, Shield, LogOut, Moon, Sun } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";

  let {
    theme = $bindable(),
  }: {
    theme: Theme;
  } = $props();

  const roleLabels: Record<UserRole, string> = {
    doctor: "Lekár",
    patient: "Pacient",
    admin: "Administrátor",
  } as const;

  const { setCurrentUser, currentUser } = $derived.by(() => {
    const v = useVisitContext();
    return { setCurrentUser: v.setCurrentUser, currentUser: v.currentUser! };
  });
</script>

<header class="border-b border-border bg-card">
  <div class="container mx-auto px-4 h-16 flex items-center justify-between">
    <div class="flex items-center gap-6">
      <div
        class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
      >
        <Stethoscope class="w-5 h-5 text-primary" />
      </div>
      <div>
        <h1 class="font-semibold text-foreground">Ambulantná dokumentácia</h1>
        <p class="text-xs text-muted-foreground">Nemocnica</p>
      </div>

      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary"
      >
        {@render renderRoleIcon(currentUser.role)}
        <span class="text-sm font-medium text-secondary-foreground">
          {currentUser.name}
        </span>
        <span class="text-xs text-muted-foreground">
          ({roleLabels[currentUser.role]})
        </span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      {#if theme === "dark"}
        <button class="btn group" onclick={() => (theme = "light")}>
          <Sun
            class="w-4 h-4 group-hover:rotate-45 transition-transform duration-300"
          />
        </button>
      {:else}
        <button class="btn group" onclick={() => (theme = "dark")}>
          <Moon
            class="w-4 h-4 group-hover:rotate-15 transition-transform duration-300"
          />
        </button>
      {/if}

      <button class="btn group" onclick={() => setCurrentUser(null)}>
        <LogOut
          class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300"
        />
        Odhlásiť
      </button>
    </div>
  </div>
</header>

{#snippet renderRoleIcon(role: UserRole)}
  {#if role === "doctor"}
    <Stethoscope class="w-4 h-4 text-secondary-foreground" />
  {:else if role === "patient"}
    <User class="w-4 h-4 text-secondary-foreground" />
  {:else if role === "admin"}
    <Shield class="w-4 h-4 text-secondary-foreground" />
  {/if}
{/snippet}
