import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & safety — FloodWise Hampton Roads" },
      { name: "description", content: "How FloodWise handles your answers and the safety principles behind its guidance." },
      { property: "og:title", content: "Privacy & safety — FloodWise" },
      { property: "og:description", content: "No accounts, no tracking, no answers sent anywhere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-accent">Privacy &amp; safety</p>
      <h1 className="mt-2 text-4xl font-extrabold">Your answers stay with you</h1>
      <div className="card-surface mt-8 space-y-3 p-6">
        <h2 className="text-xl font-extrabold">Privacy</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>No account, name, address, phone number, or email is asked for.</li>
          <li>Your answers are kept only in this browser tab while you use the assessment. They are not saved and are not sent to FloodWise servers.</li>
          <li>Closing the tab, refreshing, or choosing "Start over" clears them.</li>
          <li>No location access, file uploads, analytics, or AI services are used.</li>
          <li>Like any website, the hosting provider may keep standard technical logs (such as page requests). Links to city websites are governed by those sites' own policies.</li>
        </ul>
      </div>
      <div className="card-surface mt-6 space-y-3 p-6">
        <h2 className="text-xl font-extrabold">Safety</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>If anyone is trapped, injured, or in immediate danger, call 911.</li>
          <li>Never walk, wade, or drive through floodwater.</li>
          <li>Don't touch electrical equipment that is wet or in water.</li>
          <li>Never open, enter, or clear a storm drain during flooding.</li>
          <li>Stay out of water that may contain sewage.</li>
          <li>FloodWise offers general education, not a professional diagnosis. For serious or uncertain situations, contact the city or a qualified professional.</li>
        </ul>
      </div>
    </div>
  );
}
