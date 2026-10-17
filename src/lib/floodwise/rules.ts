import { CITY_RESOURCES } from "./resources";
import type { AssessmentResult, AttentionLevel, CompleteAnswers, Resource } from "./types";

const ISSUE_PHRASE = {
  yard: "standing water in your yard",
  street: "flooding in the street",
  home: "water entering your home",
  drain: "a blocked storm drain or roadside ditch",
} as const;

const TIMING_PHRASE = {
  rain: "during or shortly after heavy rain",
  tide: "during high tide or coastal water events",
  "no-rain": "even when it hasn't rained",
  unsure: "",
} as const;

export const ATTENTION_LABEL: Record<AttentionLevel, string> = {
  routine: "Routine concern",
  prompt: "Needs prompt attention",
  hazard: "Potential safety hazard",
};

export function buildSummary(a: CompleteAnswers): string {
  const city = CITY_RESOURCES[a.city].name;
  const timing = TIMING_PHRASE[a.timing];
  return timing
    ? `You're seeing ${ISSUE_PHRASE[a.issue]} ${timing} in ${city}.`
    : `You're seeing ${ISSUE_PHRASE[a.issue]} in ${city}, and you're not sure when it happens.`;
}

/** Life-threatening: shown immediately, overrides everything else. */
export function isEmergency(dangers: CompleteAnswers["dangers"]): boolean {
  return dangers.includes("trapped");
}

export function getAttention(a: CompleteAnswers): { level: AttentionLevel; reason: string } {
  const d = a.dangers;
  if (d.includes("trapped") || d.includes("electrical") || d.includes("rising") || d.includes("sewage")) {
    return { level: "hazard", reason: "You reported a condition that can put people at risk." };
  }
  if (a.severity === "entered") {
    return { level: "prompt", reason: "Water has entered a building or made a road impassable." };
  }
  if (a.severity === "spreading") {
    return { level: "prompt", reason: "Water is spreading or getting close to a structure." };
  }
  if (a.issue === "home") {
    return { level: "prompt", reason: "Water inside a home can cause damage quickly." };
  }
  if (a.timing === "no-rain" && a.issue === "yard") {
    return { level: "prompt", reason: "Water without rain can point to a leak that keeps running." };
  }
  if (a.severity === "unsure" || d.includes("unsure")) {
    return { level: "prompt", reason: "Some answers were uncertain, so we're being cautious." };
  }
  return { level: "routine", reason: "Based on your answers, this sounds like a minor drainage issue to watch." };
}

export function getPrecautions(a: CompleteAnswers): string[] {
  const p: string[] = [];
  const d = a.dangers;
  if (d.includes("electrical"))
    p.push(
      "Stay out of water near outlets, cords, or equipment. Don't touch anything electrical while standing in water or wet areas. If you can't safely reach your breaker panel from a dry spot, leave it alone and contact your power company or a licensed electrician.",
    );
  if (d.includes("rising"))
    p.push(
      "Never walk, wade, or drive through moving or rising water — even shallow water can knock you over or sweep a car away. Move to higher ground if water is coming toward you.",
    );
  if (d.includes("sewage"))
    p.push(
      "Avoid contact with water that may contain sewage. Keep children and pets away, and wash hands well if you've been near it. Leave cleanup to qualified professionals.",
    );
  if (d.includes("unsure"))
    p.push("If you're unsure whether something is dangerous, treat it as if it is and keep your distance.");
  if (a.issue === "street" || a.severity === "entered")
    p.push("Don't drive through flooded roads. Turn around and find another route.");
  return p;
}

type Cause = AssessmentResult["causes"][number];
const C = {
  saturated: { title: "Saturated soil", detail: "After heavy or repeated rain, the ground can fill up and stop absorbing water, so it sits on the surface." },
  grading: { title: "Surface drainage", detail: "The way land slopes may send water toward a low spot, a walkway, or your foundation instead of away from it." },
  runoff: { title: "Blocked runoff routes", detail: "Clogged gutters, downspouts, swales (shallow grassy channels), or pipes can stop water from leaving the area." },
  tidal: { title: "Coastal tidal influence", detail: "In low-lying Hampton Roads neighborhoods, high tides can push water up through drains and ditches or keep them from emptying." },
  leak: { title: "Possible plumbing or water-line issue", detail: "Water appearing without rain may come from a leaking pipe, water line, irrigation system, or appliance." },
  groundwater: { title: "High groundwater", detail: "In some low areas the water table sits close to the surface, especially in wet seasons." },
  debris: { title: "Debris in drains", detail: "Leaves, grass clippings, and trash can cover storm drain openings (inlets) and slow water from leaving the street." },
  capacity: { title: "Heavy rainfall overwhelming the system", detail: "During intense storms, rain can arrive faster than pipes and ditches are designed to carry it away." },
  ditch: { title: "Overgrown or filled ditch", detail: "Vegetation and built-up sediment (soil and sand) can reduce how much water a roadside ditch can hold." },
  foundation: { title: "Water reaching the foundation", detail: "Surface water collecting next to walls can find its way in through cracks, doors, or low openings." },
  backup: { title: "Possible sewer backup", detail: "When sewer lines are overloaded or blocked, wastewater can come back up through floor drains or fixtures." },
} satisfies Record<string, Cause>;

export function getCauses(a: CompleteAnswers): Cause[] {
  const list: Cause[] = [];
  const add = (c: Cause) => !list.includes(c) && list.push(c);
  if (a.dangers.includes("sewage") && a.issue === "home") add(C.backup);
  if (a.timing === "tide") add(C.tidal);
  if (a.timing === "no-rain") {
    if (a.issue === "street" || a.issue === "drain") {
      add(C.groundwater);
      add(C.leak);
    } else {
      add(C.leak);
      add(C.groundwater);
    }
  }
  switch (a.issue) {
    case "yard":
      if (a.timing !== "no-rain") add(C.saturated);
      add(C.grading);
      add(C.runoff);
      break;
    case "street":
      add(C.debris);
      if (a.timing !== "no-rain") add(C.capacity);
      add(C.tidal);
      break;
    case "home":
      add(C.foundation);
      add(C.runoff);
      if (a.timing !== "no-rain") add(C.leak);
      break;
    case "drain":
      add(C.debris);
      add(C.ditch);
      if (a.timing !== "no-rain") add(C.capacity);
      break;
  }
  return list.slice(0, 3);
}

type Action = AssessmentResult["actions"][number];

export function getActions(a: CompleteAnswers): Action[] {
  const out: Action[] = [];
  const d = a.dangers;
  const city = CITY_RESOURCES[a.city].name;

  if (isEmergency(d))
    out.push({ kind: "safety", title: "Call 911 now", detail: "If anyone is trapped, injured, or in immediate danger, call 911 before anything else." });
  if (d.includes("electrical"))
    out.push({ kind: "safety", title: "Keep away from electrical hazards", detail: "Stay out of the area. Contact your power company or a licensed electrician; don't touch submerged equipment." });
  if (d.includes("rising"))
    out.push({ kind: "safety", title: "Move to higher ground", detail: "Get away from fast or rising water. Never enter it on foot or by car. Call 911 if you or others can't get to safety." });
  if (d.includes("sewage"))
    out.push({ kind: "safety", title: "Avoid the water and get help", detail: a.city === "chesapeake"
      ? "Don't touch it. Use Chesapeake's water and sewer problem page below, and contact a licensed plumber for problems inside your home."
      : "Don't touch it. Contact VB311 to ask where to report it, and a licensed plumber for problems inside your home." });

  if (a.issue === "home") {
    out.push({ kind: "safety", title: "Protect people first, then belongings", detail: "If it's safe and dry where you stand, move valuables up and away. Don't stay in a room with rising water or electrical risk." });
    out.push({ kind: "professional", title: a.timing === "no-rain" ? "Call a licensed plumber" : "Consider a qualified professional", detail: a.timing === "no-rain"
      ? "Water without rain often means a leak. If you know where your main water shut-off is and can reach it safely, consider turning it off."
      : "A water-damage restoration company, plumber, or foundation/waterproofing contractor can find the source and dry things out. Check with your insurance about coverage." });
    out.push({ kind: "report", title: "Ask the city if outside water is involved", detail: `If water is coming from the street, a ditch, or public drainage, contact ${city} using the resources below. They can help sort out what's public and what's private.` });
  }

  if (a.issue === "street") {
    out.push({ kind: "safety", title: "Stay off flooded roads", detail: "Don't drive, walk, or let children play in street floodwater. It can hide open drains, debris, and deep spots." });
    out.push({ kind: "safety", title: "Move cars to higher ground — only if safe", detail: "If your vehicle is parked where water is rising and you can reach it without entering floodwater, move it. Otherwise, leave it." });
    out.push({ kind: "report", title: `Report the flooding to ${city}`, detail: "Streets and public storm drains are usually maintained by the city. Use the contacts below to let them know." });
  }

  if (a.issue === "drain") {
    out.push({ kind: "safety", title: "Don't clear it during flooding", detail: "Never open, enter, or reach into a storm drain or ditch while water is flowing. Currents near drains are strong." });
    out.push({ kind: "report", title: `Let ${city} know about the blockage`, detail: "A storm drain or roadside ditch in the public right-of-way is often city-maintained. Report it using the contacts below." });
    out.push({ kind: "observe", title: "Once it's dry, you can help", detail: "When there's no water flowing, it's generally fine to rake leaves or trash away from the top of a grate on your street — never lift the grate." });
  }

  if (a.issue === "yard") {
    out.push({ kind: "observe", title: "Watch how fast it drains", detail: "Note whether the water is gone within a day or two after rain. Water that lingers for days is worth looking into." });
    out.push({ kind: "observe", title: "Check gutters and downspouts", detail: "From the ground, see if downspouts are clogged or empty right next to the house. Extensions can carry water farther away." });
    if (a.severity !== "minor")
      out.push({ kind: "professional", title: "Get advice on yard drainage", detail: "A landscaper or drainage contractor can assess grading and options like regrading or a French drain." });
    out.push({ kind: "report", title: "Ask the city if it's coming from public drainage", detail: "If water seems to come from a street, ditch, or neighboring drainage system, the city can tell you whether it's theirs to look at." });
  }

  if (a.timing === "tide" && a.issue !== "home")
    out.push({ kind: "observe", title: "Compare with tide times", detail: "Note whether the water lines up with high tide. Tidal flooding often repeats, which helps you plan ahead." });

  if (a.timing === "no-rain" && a.issue !== "home")
    out.push({ kind: "observe", title: "Check for a leak", detail: "Look for running irrigation, a wet spot over your water line, or a higher-than-usual water bill. A plumber can confirm a leak." });

  return out.slice(0, 5);
}

export function getResources(a: CompleteAnswers): Resource[] {
  const list = [...CITY_RESOURCES[a.city].resources];
  const score = (r: Resource) =>
    (a.dangers.includes("sewage") && r.sewage ? 10 : 0) + (r.relevantTo.includes(a.issue) ? 1 : 0);
  return list.sort((x, y) => score(y) - score(x));
}

export function getDocumentation(a: CompleteAnswers): string[] {
  const list = [
    "When the problem started and how long it lasted.",
    a.timing === "tide" ? "Whether it lined up with high tide." : "Whether it followed rain or high tide.",
    "Exactly where the water appeared (yard, street, room, drain).",
    "Whether conditions are getting better or worse.",
    "Photos taken from a safe, dry location.",
  ];
  if (a.issue === "home") list.push("Damaged items and rooms affected, for insurance.");
  return list;
}

export function assess(a: CompleteAnswers): AssessmentResult {
  const attention = getAttention(a);
  return {
    summary: buildSummary(a),
    emergency: isEmergency(a.dangers),
    attention: attention.level,
    attentionLabel: ATTENTION_LABEL[attention.level],
    attentionReason: attention.reason,
    precautions: getPrecautions(a),
    causes: getCauses(a),
    actions: getActions(a),
    resources: getResources(a),
    documentation: getDocumentation(a),
  };
}
