import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CITY_OPTIONS,
  DANGER_OPTIONS,
  ISSUE_OPTIONS,
  ISSUE_SCENARIOS,
  SEVERITY_OPTIONS,
  TIMING_OPTIONS,
  toggleDanger,
  type Option,
} from "@/lib/floodwise/questions";
import { getPrecautions, isEmergency } from "@/lib/floodwise/rules";
import type { Answers, CompleteAnswers, Issue } from "@/lib/floodwise/types";
import { EmergencyAlert, PrecautionList } from "@/components/floodwise/EmergencyAlert";
import { Results } from "@/components/floodwise/Results";

export const Route = createFileRoute("/assess")({
  validateSearch: (s: Record<string, unknown>): { issue?: Issue } =>
    ISSUE_SCENARIOS.includes(s["issue"] as Issue) ? { issue: s["issue"] as Issue } : {},
  head: () => ({
    meta: [
      { title: "Get your action plan — FloodWise Hampton Roads" },
      { name: "description", content: "Answer five quick questions to get safe, practical next steps for a flooding or drainage problem." },
      { property: "og:title", content: "Get your flooding action plan — FloodWise" },
      { property: "og:description", content: "Five quick questions. Private, free, no account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assess,
});

const STEPS = [
  { key: "city", title: "Where are you?", options: CITY_OPTIONS },
  { key: "issue", title: "What is happening?", options: ISSUE_OPTIONS },
  { key: "timing", title: "When does this happen?", options: TIMING_OPTIONS },
  { key: "severity", title: "How serious is the situation?", options: SEVERITY_OPTIONS },
  { key: "dangers", title: "Are any immediate dangers present?", options: DANGER_OPTIONS },
] as const;

function Assess() {
  const { issue } = Route.useSearch();
  const fresh = (): Answers => ({ issue, dangers: [] });
  const [answers, setAnswers] = useState<Answers>(fresh);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setAnswers({ issue, dangers: [] });
    setStep(0);
    setDone(false);
  }, [issue]);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step, done]);

  const current = STEPS[step]!;
  const value = current.key === "dangers" ? answers.dangers : answers[current.key];
  const emergency = isEmergency(answers.dangers);

  const next = () => {
    if (current.key === "dangers" ? answers.dangers.length === 0 : !value) {
      setError(current.key === "dangers" ? "Please choose at least one option, or “None of these”." : "Please choose an option to continue.");
      return;
    }
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const restart = () => {
    setAnswers({ dangers: [] });
    setStep(0);
    setDone(false);
    setError(null);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only">Your action plan</h1>
        <Results answers={answers as CompleteAnswers} onRestart={restart} />
      </div>
    );
  }

  const partialPrecautions =
    current.key === "dangers"
      ? getPrecautions({
          city: answers.city ?? "chesapeake",
          issue: answers.issue ?? "yard",
          timing: answers.timing ?? "unsure",
          severity: answers.severity ?? "unsure",
          dangers: answers.dangers,
        })
      : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <span key={s.key} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-muted-foreground">Step {step + 1} of {STEPS.length}</p>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        noValidate
      >
        <fieldset aria-describedby={error ? "step-error" : undefined}>
          <legend className="w-full">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold outline-none sm:text-4xl">{current.title}</h1>
            {current.key === "dangers" && <p className="mt-2 text-muted-foreground">Select all that apply.</p>}
          </legend>

          {emergency && <div className="mt-5"><EmergencyAlert /></div>}

          <div className="mt-6 space-y-3">
            {current.key === "dangers"
              ? DANGER_OPTIONS.map((o) => (
                  <Choice
                    key={o.value}
                    type="checkbox"
                    name="dangers"
                    option={o}
                    checked={answers.dangers.includes(o.value)}
                    onChange={() => {
                      setError(null);
                      setAnswers((a) => ({ ...a, dangers: toggleDanger(a.dangers, o.value) }));
                    }}
                  />
                ))
              : (current.options as readonly Option<string>[]).map((o) => (
                  <Choice
                    key={o.value}
                    type="radio"
                    name={current.key}
                    option={o}
                    checked={value === o.value}
                    onChange={() => {
                      setError(null);
                      setAnswers((a) => ({ ...a, [current.key]: o.value }));
                    }}
                  />
                ))}
          </div>
        </fieldset>

        {partialPrecautions.length > 0 && <div className="mt-5"><PrecautionList items={partialPrecautions} /></div>}

        {error && (
          <p id="step-error" role="alert" className="mt-4 rounded-lg bg-danger-soft px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep(step - 1);
            }}
            disabled={step === 0}
            className="min-h-12 rounded-full border border-input px-6 font-bold disabled:invisible"
          >
            Back
          </button>
          <button type="submit" className="min-h-12 rounded-full bg-primary px-8 font-bold text-primary-foreground hover:bg-navy">
            {step === STEPS.length - 1 ? "See my action plan" : "Continue"}
          </button>
        </div>
      </form>
      <p className="mt-8 text-xs text-muted-foreground">Your answers stay in this browser tab and aren't sent anywhere.</p>
    </div>
  );
}

function Choice({
  type,
  name,
  option,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  option: Option<string>;
  checked: boolean;
  onChange: () => void;
}) {
  const id = `${name}-${option.value}`;
  return (
    <label
      htmlFor={id}
      className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border-2 bg-card px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
        checked ? "border-primary bg-secondary" : "border-border hover:border-input"
      }`}
    >
      <input id={id} type={type} name={name} value={option.value} checked={checked} onChange={onChange} className="h-5 w-5 shrink-0 accent-primary" />
      <span>
        <span className="font-semibold">{option.label}</span>
        {option.hint && <span className="block text-sm text-muted-foreground">{option.hint}</span>}
      </span>
    </label>
  );
}
