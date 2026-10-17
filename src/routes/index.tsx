import { createFileRoute, Link } from "@tanstack/react-router";
import { Contours } from "@/components/floodwise/SiteChrome";
import type { Issue } from "@/lib/floodwise/types";
import heroImg from "@/assets/hero-flood.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FloodWise Hampton Roads — Know what to do next" },
      { name: "description", content: "Free, private, plain-language action plans for yard, street, home and drain flooding in Virginia Beach and Chesapeake." },
      { property: "og:title", content: "FloodWise Hampton Roads" },
      { property: "og:description", content: "When water shows up where it shouldn't, know what to do next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SCENARIOS: { issue: Issue; title: string; icon: string }[] = [
  { issue: "yard", title: "Water in my yard", icon: "M4 20h16M6 16c2 0 2-1.5 4-1.5S12 16 14 16s2-1.5 4-1.5M8 10l4-5 4 5M9 10v3h6v-3" },
  { issue: "street", title: "Flooding in my street", icon: "M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2.5-1.5 4.5-1.5S19 18 21 18M5 13l2-5h10l2 5M7 13h10" },
  { issue: "home", title: "Water entering my home", icon: "M4 11l8-6 8 6M6 10v9h12v-9M9 17c1 0 1-.8 1.5-.8S12 17 12 17s1-.8 1.5-.8S15 17 15 17" },
  { issue: "drain", title: "Blocked drain or ditch", icon: "M4 8h16v3H4zM7 8v3M10 8v3M13 8v3M16 8v3M12 14v2m-2 2c1 0 1-.6 2-.6s1 .6 2 .6" },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" width={1600} height={1067} className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/40" aria-hidden="true" />
        <Contours className="absolute inset-0 h-full w-full opacity-50" />
        <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
          <p className="eyebrow text-accent">Free community resource</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.05] text-navy-foreground sm:text-6xl">
            Water where it shouldn't be?
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-foreground/80">
            From flooded streets to standing water in your yard, FloodWise helps Hampton Roads residents understand what might be
            happening and what to do next.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/assess"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-card transition-colors hover:bg-navy"
            >
              Get My Action Plan
            </Link>
            <p className="text-sm text-navy-foreground/75">Free. Private. No account needed. About 2 minutes.</p>
          </div>

          <h2 className="mt-12 text-sm font-bold text-navy-foreground">Or start with what you're seeing:</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SCENARIOS.map((s) => (
              <li key={s.issue}>
                <Link
                  to="/assess"
                  search={{ issue: s.issue }}
                  className="scenario-card card-surface group flex h-full min-h-36 flex-col justify-between gap-4 p-4"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary/70 transition-transform duration-500 ease-out motion-safe:group-hover:scale-x-100"
                  />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary transition-all duration-300 ease-out group-hover:bg-primary/15 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-105">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary/45 opacity-0 motion-safe:group-hover:ripple"
                    />
                    <svg viewBox="0 0 24 24" className="h-9 w-9 stroke-primary" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <span className="flex items-end justify-between gap-2 font-bold leading-snug">
                    {s.title}
                    <span aria-hidden="true" className="text-primary transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <p className="eyebrow text-primary">How it works</p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ["Tell us what you're seeing.", "Pick your city and the kind of water problem."],
              ["Answer a few simple questions.", "When it happens, how serious it is, and any dangers."],
              ["Get your next steps.", "Safety first, then likely causes, actions, and who to contact."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-extrabold text-navy-foreground">{i + 1}</span>
                <div>
                  <h3 className="font-bold">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr] sm:items-center">
          <div>
            <p className="eyebrow text-accent">For our neighbors</p>
            <h2 className="mt-3 text-3xl font-extrabold">Built for Virginia Beach and Chesapeake</h2>
            <p className="mt-4 text-muted-foreground">
              Flooding information is spread across city websites and technical guides. FloodWise puts the basics in one place, in
              plain language — so you don't need to know which department handles what before getting started.
            </p>
            <Link to="/about" className="mt-4 inline-block font-bold text-primary underline underline-offset-4">About FloodWise</Link>
          </div>
          <div className="card-surface p-6 text-sm">
            <p className="font-bold">Before you start</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• If anyone is in danger, call <strong className="text-foreground">911</strong> now.</li>
              <li>• Never walk or drive through floodwater.</li>
              <li>• FloodWise is independent and not affiliated with either city.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
