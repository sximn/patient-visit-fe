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

  let {
    basePath,
    apiBase,
  }: {
    basePath: string;
    apiBase: string;
  } = $props();

  function extractInitialTheme(): Theme {
    // 1) check localStorage
    const raw = localStorage.getItem("@polyfea/theme");
    if (raw) {
      try {
        const themeObj = JSON.parse(raw);
        if ("isDark" in themeObj && typeof themeObj.isDark === "boolean") {
          return themeObj.isDark ? "dark" : "light";
        }
      } catch {
        // ignore malformed data and continue with other options
      }
    }

    // 2) fall back to system preference
    if (window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
      if (window.matchMedia("(prefers-color-scheme: light)").matches)
        return "light";
    }

    // 3) default to light
    return "light";
  }

  let theme = $state(extractInitialTheme());
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
