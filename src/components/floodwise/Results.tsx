import { useMemo } from "react";
import { assess } from "@/lib/floodwise/rules";
import { CITY_OPTIONS, DANGER_OPTIONS, ISSUE_OPTIONS, SEVERITY_OPTIONS, TIMING_OPTIONS } from "@/lib/floodwise/questions";
import type { AttentionLevel, CompleteAnswers } from "@/lib/floodwise/types";
import { EmergencyAlert, PrecautionList } from "./EmergencyAlert";

const ATTENTION_STYLE: Record<AttentionLevel, { cls: string; icon: string }> = {
  routine: { cls: "bg-success-soft text-success-foreground border-success-foreground/30", icon: "●" },
  prompt: { cls: "bg-warning-soft text-warning-foreground border-warning", icon: "▲" },
  hazard: { cls: "bg-danger-soft text-destructive border-destructive", icon: "⚠" },
};

const KIND_LABEL = { safety: "Safety", observe: "Observe", report: "Report", professional: "Get help" } as const;

const label = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? v;

export function Results({ answers, onRestart }: { answers: CompleteAnswers; onRestart: () => void }) {
  const r = useMemo(() => assess(answers), [answers]);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const style = ATTENTION_STYLE[r.attention];

  return (
    <article className="space-y-6">
      {r.emergency && <EmergencyAlert />}
      <header className="space-y-4">
        <p className="eyebrow text-accent">Your FloodWise action plan · {date}</p>
        <p className="text-2xl font-extrabold leading-snug sm:text-3xl">{r.summary}</p>
        <div className={`inline-flex items-start gap-3 rounded-xl border-2 px-4 py-3 ${style.cls}`}>
          <span aria-hidden="true" className="text-lg leading-6">{style.icon}</span>
          <div>
            <p className="font-extrabold">{r.attentionLabel}</p>
            <p className="text-sm">{r.attentionReason}</p>
          </div>
        </div>
      </header>

      <PrecautionList items={r.precautions} />

      <Section title="What might be happening" note="These are possibilities, not a diagnosis.">
        <ul className="space-y-4">
          {r.causes.map((c) => (
            <li key={c.title}>
              <p className="font-bold">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What to do next">
        <ol className="space-y-4">
          {r.actions.map((a, i) => (
            <li key={a.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-extrabold text-navy-foreground">{i + 1}</span>
              <div>
                <p className="font-bold">
                  {a.title}{" "}
                  <span className={`ml-1 rounded-full px-2 py-0.5 align-middle text-xs font-bold ${a.kind === "safety" ? "bg-danger-soft text-destructive" : "bg-secondary text-muted-foreground"}`}>
                    {KIND_LABEL[a.kind]}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{a.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title={`Who to contact in ${label(CITY_OPTIONS, answers.city)}`}
        note="Public streets, storm drains, and ditches are often city-maintained; problems on private property are usually the owner's. When in doubt, ask the city. Response times vary."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {r.resources.map((res) => (
            <li key={res.id} className="rounded-xl border border-border bg-background p-4">
              <p className="font-bold">{res.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{res.description}</p>
              {res.phone && (
                <a href={`tel:${res.phone.replace(/-/g, "")}`} className="mt-2 block font-bold text-primary underline underline-offset-4">
                  {res.phone}
                </a>
              )}
              {res.url && (
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="mt-2 block break-words text-sm font-semibold text-primary underline underline-offset-4">
                  Visit official page<span className="sr-only"> (opens in new tab)</span> ↗
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">In an emergency, call 911. Sources: official city websites listed above. FloodWise is not affiliated with either city.</p>
      </Section>

      <Section title="What to note down" note="Optional — only if it's safe. Nothing is uploaded or collected.">
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {r.documentation.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </Section>

      <Section title="Your answers">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="font-bold">City</dt><dd>{label(CITY_OPTIONS, answers.city)}</dd>
          <dt className="font-bold">What's happening</dt><dd>{label(ISSUE_OPTIONS, answers.issue)}</dd>
          <dt className="font-bold">When</dt><dd>{label(TIMING_OPTIONS, answers.timing)}</dd>
          <dt className="font-bold">How serious</dt><dd>{label(SEVERITY_OPTIONS, answers.severity)}</dd>
          <dt className="font-bold">Dangers</dt><dd>{answers.dangers.map((d) => label(DANGER_OPTIONS, d)).join("; ")}</dd>
        </dl>
      </Section>

      <p className="text-xs text-muted-foreground">
        FloodWise Hampton Roads is an independent educational resource, not professional advice or an emergency service.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <button type="button" onClick={() => window.print()} className="min-h-12 rounded-full bg-primary px-7 font-bold text-primary-foreground hover:bg-navy">
          Print / Save as PDF
        </button>
        <button type="button" onClick={onRestart} className="min-h-12 rounded-full border border-input px-7 font-bold">
          Start over
        </button>
      </div>
    </article>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <h2 className="text-xl font-extrabold">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
