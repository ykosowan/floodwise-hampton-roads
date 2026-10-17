export function EmergencyAlert() {
  return (
    <div role="alert" className="rounded-2xl border-2 border-destructive bg-danger-soft p-5 sm:p-6">
      <p className="eyebrow text-destructive">⚠ Emergency</p>
      <h2 className="mt-1 text-2xl font-extrabold">Call 911 now</h2>
      <p className="mt-2">
        If anyone is trapped, injured, or in immediate danger, call 911 before doing anything else. Don't go into floodwater to
        reach someone — tell responders where they are.
      </p>
      <a
        href="tel:911"
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-destructive px-6 font-bold text-destructive-foreground"
      >
        Call 911
      </a>
    </div>
  );
}

export function PrecautionList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border-2 border-warning bg-warning-soft p-5 text-warning-foreground" role="status">
      <p className="font-extrabold">⚠ Stay safe</p>
      <ul className="mt-2 space-y-2 text-sm">
        {items.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
