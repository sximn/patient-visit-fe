<svelte:options customElement="sukus-patient-visit-documentation-app" />

<script module lang="ts">
  import rawStyles from "../app.css?inline";
  import AppShellRouter from "../lib/components/app-shell-router.svelte";
  import type { Theme } from "../lib/types";

  // build the patched sheet
  const shadowSheet = new CSSStyleSheet();
  const patched = rawStyles.replace(/:root/g, ":host");
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

  let theme: Theme = $state("light");
  let host: HTMLElement;

  onMount(() => {
    // attach the patched sheet to this component shadow root
    const root = host.getRootNode() as ShadowRoot;
    if (root?.adoptedStyleSheets) {
      root.adoptedStyleSheets = [shadowSheet];
    }
  });
</script>

<div bind:this={host} class="size-full" data-theme={theme}>
  <AppShellRouter bind:theme />
</div>