<script lang="ts">
  import { Stethoscope, User, Shield, ArrowRight } from "@lucide/svelte";
  import { useVisitContext } from "../visit.svelte";
  import type { UserRole } from "../types";
  import { mockUsers } from "../mocks";

  const visit = useVisitContext();

  const roleConfig = {
    doctor: {
      icon: Stethoscope,
      title: "Lekár",
      description: "Vytvára a upravuje záznamy o návštevách pacientov",
    },
    patient: {
      icon: User,
      title: "Pacient",
      description: "Prezerá si svoju zdravotnú dokumentáciu",
    },
    admin: {
      icon: Shield,
      title: "Admin",
      description: "Vyhľadáva a spravuje záznamy v systéme",
    },
  } as const;

  function handleSelectRole(role: UserRole) {
    const user = visit.users.find((u) => u.role === role);
    if (user) {
      visit.setCurrentUser(user);
    }
  }
</script>

<div
  class="min-h-screen bg-background flex items-center justify-center p-4 text-base-content"
>
  <div class="w-full max-w-4xl">
    <div class="text-center mb-10">
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
      >
        <Stethoscope class="w-10 h-10 text-primary" />
      </div>
      <h1 class="text-4xl font-extrabold mb-2 tracking-tight">
        Správa dokumentácie pacientov pri návšteve ambulancie
      </h1>
    </div>

    <div
      class="overflow-x-auto w-full mx-auto border border-secondary rounded-lg"
    >
      <table class="table table-auto w-full">
        <thead>
          <tr>
            <th>Meno</th>
            <th>Rola</th>
            <th>Impersonovať</th>
          </tr>
        </thead>
        <tbody>
          {#each mockUsers as mockUser (mockUser.id)}
            {@const Icon = roleConfig[mockUser.role].icon}
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  <div
                    class="rounded-2xl border border-secondary h-12 w-12 flex justify-center items-center"
                  >
                    <Icon class="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div class="font-bold">{mockUser.name}</div>
                    <div class="text-sm opacity-50">{mockUser.email}</div>
                  </div>
                </div>
              </td>
              <td>
                {roleConfig[mockUser.role].title}
              </td>
              <td>
                <button
                  class="btn btn-ghost group"
                  onclick={() => handleSelectRole(mockUser.role)}
                >
                  <span>Pokračovať</span>
                  <span class="inline-flex w-4 items-center justify-center">
                    <ArrowRight
                      class="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <p class="text-center text-xs text-base-content/40 mt-10">
      Demo verzia - vyberať rolu pre prístup do systému
    </p>
  </div>
</div>
