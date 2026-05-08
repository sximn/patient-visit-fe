import type { Theme } from "../types";

export function resolveTheme(stored: string | null): Theme {
  // 1) check localStorage extracted
  if (stored) {
    try {
      const themeObj = JSON.parse(stored);
      if ("isDark" in themeObj && typeof themeObj.isDark === "boolean") {
        return themeObj.isDark ? "dark" : "light";
      }
    } catch {
      // ignore malformed data and continue with other options
    }
  }

  // 2) fall back to system preference
  if (typeof globalThis.matchMedia === "function") {
    if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    if (globalThis.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  }

  // 3) default to light
  return "light";
}
