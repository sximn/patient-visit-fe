import { describe, it, expect } from "vitest";
import { searchPatients } from "./patient-search";
import { mockUsers } from "../../mocks";

describe("searchPatients", () => {
  it("returns empty array for empty query", () => {
    expect(searchPatients("", mockUsers)).toEqual([]);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(searchPatients("   ", mockUsers)).toEqual([]);
  });

  it("finds patients by partial name (case-insensitive)", () => {
    const results = searchPatients("lazar", mockUsers);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Lazar Pacientový");
  });

  it("finds patients by partial email", () => {
    const results = searchPatients("dedo@", mockUsers);
    expect(results).toHaveLength(1);
    expect(results[0].email).toBe("dedo@email.sk");
  });

  it("never returns doctors or admins", () => {
    // we have "doktor" in the names of doctors -> verify that searchPatients does not return doctors
    const results = searchPatients("doktor", mockUsers);
    expect(results.every((u) => u.role === "patient")).toBe(true);
  });

  it("returns multiple matches when query fits several patients", () => {
    // "email.sk" is in all 3 patients emails
    const results = searchPatients("email.sk", mockUsers);
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((u) => u.role === "patient")).toBe(true);
  });

  it("returns empty array when no patient matches", () => {
    expect(searchPatients("xyz-no-match", mockUsers)).toEqual([]);
  });
});
