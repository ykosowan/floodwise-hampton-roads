export type City = "virginia-beach" | "chesapeake";
export type Issue = "yard" | "street" | "home" | "drain";
export type Timing = "rain" | "tide" | "no-rain" | "unsure";
export type Severity = "minor" | "spreading" | "entered" | "unsure";
export type Danger = "electrical" | "rising" | "sewage" | "trapped" | "none" | "unsure";

export interface Answers {
  city?: City;
  issue?: Issue;
  timing?: Timing;
  severity?: Severity;
  dangers: Danger[];
}

export type CompleteAnswers = Required<Omit<Answers, "dangers">> & { dangers: Danger[] };

export type AttentionLevel = "routine" | "prompt" | "hazard";

export interface Resource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  url?: string;
  /** Issues this resource is most relevant to; used for ordering only. */
  relevantTo: Issue[];
  /** Shown first when possible sewage contamination is reported. */
  sewage?: boolean;
}

export interface CityResources {
  city: City;
  name: string;
  resources: Resource[];
}

export interface AssessmentResult {
  summary: string;
  emergency: boolean;
  attention: AttentionLevel;
  attentionLabel: string;
  attentionReason: string;
  precautions: string[];
  causes: { title: string; detail: string }[];
  actions: { title: string; detail: string; kind: "safety" | "observe" | "report" | "professional" }[];
  resources: Resource[];
  documentation: string[];
}
