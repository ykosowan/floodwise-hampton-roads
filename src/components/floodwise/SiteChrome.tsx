import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-navy" />
      <path d="M6 19c3 0 3-2 5-2s2 2 5 2 3-2 5-2 2 2 5 2" className="stroke-primary" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M6 24c3 0 3-2 5-2s2 2 5 2 3-2 5-2 2 2 5 2" className="stroke-accent" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M16 6c-2.5 3.2-3.8 5.3-3.8 7a3.8 3.8 0 0 0 7.6 0c0-1.7-1.3-3.8-3.8-7Z" className="fill-navy-foreground" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur print:hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-md focus:bg-card focus:p-2">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-md">
          <Logo />
          <span className="leading-tight">
            <span className="block font-extrabold">FloodWise</span>
            <span className="block text-xs text-muted-foreground">Hampton Roads</span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold">
          <Link to="/" className="rounded-md px-3 py-2 hover:bg-muted" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/about" className="rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/privacy" className="rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "text-primary" }}>Privacy</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground print:hidden">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-10 text-sm sm:px-6">
        <p className="font-bold">FloodWise Hampton Roads</p>
        <p className="max-w-2xl opacity-80">
          An independent educational resource. Not affiliated with or endorsed by the City of Virginia Beach or the City of Chesapeake.
          Not an emergency service. In an emergency, call 911.
        </p>
        <div className="flex gap-4 opacity-90">
          <Link to="/about" className="underline underline-offset-4">About</Link>
          <Link to="/privacy" className="underline underline-offset-4">Privacy &amp; safety</Link>
        </div>
      </div>
    </footer>
  );
}

export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" fill="none">
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M-20 ${80 + i * 36} C 150 ${40 + i * 36}, 260 ${150 + i * 32}, 420 ${100 + i * 34} S 680 ${40 + i * 38}, 840 ${110 + i * 30}`}
          className="stroke-primary"
          strokeOpacity={0.18 + (i % 3) * 0.06}
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}
