import type { City, Danger, Issue, Severity, Timing } from "./types";

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const CITY_OPTIONS: Option<City>[] = [
  { value: "virginia-beach", label: "Virginia Beach" },
  { value: "chesapeake", label: "Chesapeake" },
];

export const ISSUE_OPTIONS: Option<Issue>[] = [
  { value: "yard", label: "Standing water in my yard" },
  { value: "street", label: "Flooding in the street" },
  { value: "home", label: "Water entering my home" },
  { value: "drain", label: "Blocked storm drain or roadside ditch" },
];

export const TIMING_OPTIONS: Option<Timing>[] = [
  { value: "rain", label: "Only during or shortly after heavy rain" },
  { value: "tide", label: "During high tide or coastal water events" },
  { value: "no-rain", label: "Even when it hasn't rained" },
  { value: "unsure", label: "Not sure" },
];

export const SEVERITY_OPTIONS: Option<Severity>[] = [
  { value: "minor", label: "Minor pooling or slow drainage" },
  { value: "spreading", label: "Water is spreading or approaching a structure" },
  { value: "entered", label: "Water has entered a building or a road is impassable" },
  { value: "unsure", label: "Not sure" },
];

export const DANGER_OPTIONS: Option<Danger>[] = [
  { value: "electrical", label: "Water near electrical equipment or outlets" },
  { value: "rising", label: "Fast-moving or rising water" },
  { value: "sewage", label: "Possible sewage contamination", hint: "Bad smell, toilet paper or waste in the water" },
  { value: "trapped", label: "People trapped, injured, or in immediate danger" },
  { value: "none", label: "None of these" },
  { value: "unsure", label: "Not sure" },
];

/** "None of these" is mutually exclusive with every other danger option. */
export function toggleDanger(current: Danger[], value: Danger): Danger[] {
  if (current.includes(value)) return current.filter((d) => d !== value);
  if (value === "none") return ["none"];
  return [...current.filter((d) => d !== "none"), value];
}

export const ISSUE_SCENARIOS: Issue[] = ["yard", "street", "home", "drain"];
