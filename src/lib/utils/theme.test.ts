import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveTheme } from "./theme";

function mockMatchMedia(scheme: "dark" | "light" | null) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches:
      scheme !== null ? query === `(prefers-color-scheme: ${scheme})` : false,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("resolveTheme", () => {
  describe("localStorage value", () => {
    it("returns 'dark' when isDark is true", () => {
      const stored = JSON.stringify({
        scale: 0.83,
        followSystemTheme: false,
        isDark: true,
      });
      expect(resolveTheme(stored)).toBe("dark");
    });

    it("returns 'light' when isDark is false", () => {
      const stored = JSON.stringify({
        scale: 0.83,
        followSystemTheme: false,
        isDark: false,
      });
      expect(resolveTheme(stored)).toBe("light");
    });

    it("ignores stored value and falls through when isDark is missing", () => {
      mockMatchMedia("dark");
      const stored = JSON.stringify({ scale: 0.83, followSystemTheme: false });
      expect(resolveTheme(stored)).toBe("dark");
    });

    it("ignores stored value and falls through when isDark is not a boolean", () => {
      mockMatchMedia("light");
      const stored = JSON.stringify({ scale: 0.83, isDark: "yes" });
      expect(resolveTheme(stored)).toBe("light");
    });

    it("ignores malformed JSON and falls through", () => {
      mockMatchMedia("dark");
      expect(resolveTheme("not-valid-json{{")).toBe("dark");
    });

    it("falls through when stored is null", () => {
      mockMatchMedia("dark");
      expect(resolveTheme(null)).toBe("dark");
    });

    it("falls through when stored is an empty string", () => {
      mockMatchMedia("dark");
      expect(resolveTheme("")).toBe("dark");
    });
  });

  describe("system preference fallback", () => {
    it("returns 'dark' when system prefers dark", () => {
      mockMatchMedia("dark");
      expect(resolveTheme(null)).toBe("dark");
    });

    it("returns 'light' when system prefers light", () => {
      mockMatchMedia("light");
      expect(resolveTheme(null)).toBe("light");
    });

    it("falls through to default when matchMedia is unavailable", () => {
      vi.stubGlobal("matchMedia", undefined);
      expect(resolveTheme(null)).toBe("light");
    });

    it("falls through to default when no scheme matches", () => {
      mockMatchMedia(null);
      expect(resolveTheme(null)).toBe("light");
    });
  });

  describe("default fallback", () => {
    it("returns 'light' when nothing else matches", () => {
      vi.stubGlobal("matchMedia", undefined);
      expect(resolveTheme(null)).toBe("light");
    });
  });
});
