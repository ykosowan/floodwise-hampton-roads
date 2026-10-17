import { describe, expect, it } from "vitest";
import { assess } from "./rules";
import { toggleDanger, CITY_OPTIONS, ISSUE_OPTIONS, TIMING_OPTIONS, SEVERITY_OPTIONS } from "./questions";
import type { CompleteAnswers, Danger } from "./types";

const base: CompleteAnswers = { city: "chesapeake", issue: "yard", timing: "rain", severity: "minor", dangers: ["none"] };

describe("FloodWise rules", () => {
  it("demo: Chesapeake yard after rain is routine with Chesapeake resources", () => {
    const r = assess(base);
    expect(r.summary).toBe("You're seeing standing water in your yard during or shortly after heavy rain in Chesapeake.");
    expect(r.attention).toBe("routine");
    expect(r.emergency).toBe(false);
    expect(r.resources.every((x) => x.id.startsWith("ch-"))).toBe(true);
  });

  it("people trapped triggers emergency and 911 first", () => {
    const r = assess({ ...base, dangers: ["trapped"] });
    expect(r.emergency).toBe(true);
    expect(r.attention).toBe("hazard");
    expect(r.actions[0]?.title).toBe("Call 911 now");
  });

  it("electrical hazard is a potential safety hazard but not an emergency", () => {
    const r = assess({ ...base, dangers: ["electrical"] });
    expect(r.attention).toBe("hazard");
    expect(r.emergency).toBe(false);
  });

  it("switches resources to Virginia Beach", () => {
    const r = assess({ ...base, city: "virginia-beach" });
    expect(r.resources.every((x) => x.id.startsWith("vb-"))).toBe(true);
  });

  it("'None of these' is mutually exclusive", () => {
    expect(toggleDanger(["electrical", "sewage"], "none")).toEqual(["none"]);
    expect(toggleDanger(["none"], "rising")).toEqual(["rising"]);
  });

  it("every answer combination produces coherent results", () => {
    const dangerSets: Danger[][] = [["none"], ["unsure"], ["electrical", "rising", "sewage"], ["trapped"]];
    for (const c of CITY_OPTIONS) for (const i of ISSUE_OPTIONS) for (const t of TIMING_OPTIONS) for (const s of SEVERITY_OPTIONS) for (const d of dangerSets) {
      const r = assess({ city: c.value, issue: i.value, timing: t.value, severity: s.value, dangers: d });
      expect(r.causes.length).toBeGreaterThanOrEqual(2);
      expect(r.causes.length).toBeLessThanOrEqual(3);
      expect(r.actions.length).toBeGreaterThanOrEqual(3);
      expect(r.actions.length).toBeLessThanOrEqual(5);
      expect(r.resources.length).toBeGreaterThan(0);
    }
  });
});
