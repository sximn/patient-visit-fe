<svelte:options
  customElement={{
    tag: "sukus-patient-visit-documentation-app",
    props: {
      basePath: {
        attribute: "base-path",
      },
      apiBase: {
        attribute: "api-base",
      },
    },
  }}
/>

<script module lang="ts">
  import rawStyles from "../app.css?inline";
  import ApiProvider from "../lib/components/api-provider.svelte";
  import AppShellRouter from "../lib/components/app-shell-router.svelte";
  import type { Theme } from "../lib/types";

  // build the patched sheet
  const shadowSheet = new CSSStyleSheet();
  const patched = rawStyles
    .replace(/:root/g, ":host")
    // replace daisyUI's inline SVG noise because it uses a data: URI,
    // which triggers the app's strict CSP
    .replace(/--fx-noise\s*:\s*url\([^;]*\)\s*;/g, "--fx-noise:none;");
  shadowSheet.replaceSync(patched);

  // extract @property initial values and add to :host
  const vars: string[] = [];
  for (const rule of shadowSheet.cssRules) {
    if (rule instanceof CSSPropertyRule && (rule as any).initialValue) {
      vars.push(`${rule.name}: ${(rule as any).initialValue}`);
    }
  }
  if (vars.length) {
    shadowSheet.insertRule(`:host { ${vars.join("; ")} }`);
  }

  // also push @property rules to document so inheritance works
  const globalSheet = new CSSStyleSheet();
  for (const rule of shadowSheet.cssRules) {
    if (rule instanceof CSSPropertyRule) {
      globalSheet.insertRule(rule.cssText);
    }
  }
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, globalSheet];
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { resolveTheme } from "../lib/utils/theme";

  let {
    basePath,
    apiBase,
  }: {
    basePath: string;
    apiBase: string;
  } = $props();

  let theme = $state(resolveTheme(localStorage.getItem("@polyfea/theme")));
  let host: HTMLElement;

  onMount(() => {
    // attach the patched sheet to this component shadow root
    const root = host.getRootNode() as ShadowRoot;
    if (root?.adoptedStyleSheets) {
      root.adoptedStyleSheets = [shadowSheet];
    }

    document.addEventListener("polyfea-theme-changed", (e: Event) => {
      const ce = e as CustomEvent;
      if ("isDark" in ce.detail && typeof ce.detail.isDark === "boolean") {
        theme = ce.detail.isDark ? "dark" : "light";
      }
    });
  });
</script>

<div bind:this={host} class="size-full min-h-fit" data-theme={theme}>
  <ApiProvider {basePath} {apiBase}>
    <AppShellRouter bind:theme />
  </ApiProvider>
</div>
