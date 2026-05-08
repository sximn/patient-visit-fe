import { describe, it, expect } from "vitest";
import { formatDate, formatTime } from "./date";

describe("formatDate", () => {
  it("formats a date string in Slovak locale", () => {
    expect(formatDate("2024-03-15")).toBe("15. 3. 2024");
  });
});

describe("formatTime", () => {
  it("formats a time string as HH:MM in Slovak locale", () => {
    expect(formatTime("2024-03-15T09:05:00")).toBe("09:05");
  });

  it("pads hours and minutes with leading zeros", () => {
    expect(formatTime("2024-03-15T08:04:00")).toBe("08:04");
  });
});
