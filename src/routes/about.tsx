import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FloodWise Hampton Roads" },
      { name: "description", content: "Why FloodWise exists, who it serves, and how its free, rule-based guidance works." },
      { property: "og:title", content: "About FloodWise Hampton Roads" },
      { property: "og:description", content: "Plain-language flooding guidance for Virginia Beach and Chesapeake residents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const ITEMS = [
  ["The problem", "Residents can struggle to identify practical next steps when flooding or drainage issues arise."],
  ["Community served", "Homeowners and renters in Virginia Beach and Chesapeake, Virginia."],
  ["Our approach", "Free, plain-language guidance connecting common situations with safety information and official resources."],
  ["Why it helps", "You don't need to understand city departments or contractor categories before getting started."],
  ["Sustainability", "An open-source, low-cost static web app. Resource links and rules can be updated as community needs change."],
  ["How it decides", "Clear, fixed rules — not AI. The same answers always give the same, reviewable safety guidance, at no cost and with no data leaving your browser."],
];

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-accent">About</p>
      <h1 className="mt-2 text-4xl font-extrabold">About FloodWise</h1>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {ITEMS.map(([t, d]) => (
          <div key={t} className="card-surface p-5">
            <dt className="font-bold">{t}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{d}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-10 text-2xl font-extrabold">How we'd measure impact in a future pilot</h2>
      <p className="mt-2 text-sm text-muted-foreground">These are planned measures. No results have been collected yet.</p>
      <ul className="mt-4 list-disc space-y-1.5 pl-5">
        <li>Share of test users who complete an assessment.</li>
        <li>Share who correctly identify an appropriate next action afterward.</li>
        <li>Improvement in confidence about whom to contact.</li>
        <li>Time needed to get an action plan.</li>
        <li>Accessibility and mobile usability feedback.</li>
      </ul>
      <p className="mt-10 rounded-xl bg-secondary p-5 text-sm">
        FloodWise is independent. It is not a government service, emergency service, flood forecast, or contractor directory, and is not
        affiliated with or endorsed by either city.
      </p>
      <Link to="/assess" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-bold text-primary-foreground">
        Get My Action Plan
      </Link>
    </div>
  );
}
