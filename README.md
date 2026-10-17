# FloodWise Hampton Roads

> When water shows up where it shouldn't, know what to do next.

A free, mobile-first, privacy-conscious web app that helps residents of **Virginia Beach** and **Chesapeake, Virginia** understand common residential flooding and drainage problems and find safe, practical next steps.

FloodWise is an independent educational resource — not a government service, emergency service, flood forecast, or contractor directory.

## Audience
Homeowners and renters with limited flooding experience, including older adults and newcomers unfamiliar with which city department handles what.

## Features
- Homepage with four scenario shortcuts (each pre-selects the issue in the assessment).
- Five-step guided assessment with progress, Back/Continue, validation, accessible radios/checkboxes.
- Immediate safety overrides: selecting "People trapped, injured, or in immediate danger" shows 911 guidance instantly; electrical, rising-water, and sewage selections show precautions instantly.
- Personalized results: situation summary, attention level, likely contributors, 3–5 prioritized actions, city-specific contacts, what to document, and your answers.
- Print / Save as PDF via a print stylesheet.
- About and Privacy & Safety pages.

## Local development
```bash
bun install
bun run dev        # http://localhost:8080
bunx vitest run    # rule tests
```

## Architecture
```
src/lib/floodwise/
  types.ts        shared types
  questions.ts    assessment options + "None of these" exclusivity
  resources.ts    official city resource configuration (single source of truth)
  rules.ts        pure function assess(answers) -> structured result
  rules.test.ts   tests, including every answer combination
src/components/floodwise/   Results, safety alerts, header/footer
src/routes/                 /, /assess, /about, /privacy
```
All logic runs client-side. Answers live only in React component state.

### Why deterministic rules instead of AI
Transparency (rules are readable and reviewable), reliability (same input, same output), cost (no API fees), privacy (no data leaves the browser), and consistent safety guidance (no risk of a model suggesting unsafe actions). This project does not use AI.

## Privacy and safety design
- No accounts, personal details, uploads, geolocation, analytics, or external API calls.
- Answers are never stored or submitted; refresh or "Start over" clears them.
- Never recommends entering floodwater, driving flooded roads, touching submerged electrical equipment, opening or clearing drains during flooding, hazardous repairs, or entering sewage-contaminated water.
- Distinguishes life-threatening emergencies (911) from urgent-but-not-emergency hazards.

## Official resource references
**Virginia Beach**
- Service requests / flooded roadway reporting: https://pw.virginiabeach.gov/roads/service-requests
- VB311: 757-385-3111
- Public Works Stormwater Maintenance (street flooding): 757-385-1470
- Stormwater and flood protection: https://pw.virginiabeach.gov/stormwater

**Chesapeake**
- Stormwater Management Division: https://www.cityofchesapeake.net/1029/Stormwater-Management-Division
- Customer Contact Center (stormwater drainage concerns): 757-382-2489
- City reporting resources: https://www.cityofchesapeake.net/146/Report
- Water and sewer emergency information: https://www.cityofchesapeake.net/956/Report-a-Problem

These should be re-verified periodically. No response times are implied.

## Demo walkthrough (60–90 s)
1. Home → tap **Water in my yard**.
2. Choose **Chesapeake** → issue is pre-selected → **Only during or shortly after heavy rain** → **Minor pooling** → **None of these**.
3. Review the plan; tap **Print / Save as PDF**; tap **Start over**.
4. Second demo: on step 5 select **People trapped, injured, or in immediate danger** — the 911 alert appears immediately.

## Known limitations
- Covers only two cities and four common scenarios.
- General guidance only; not a diagnosis or a determination of responsibility.
- Resource links are static and need periodic review.
- No Virginia Beach-specific sewer link was provided, so VB sewage cases point to VB311.
- Web font loads from Google Fonts; the app falls back to system fonts offline.

## Measuring community impact (future pilot)
Assessment completion rate; share of users who identify an appropriate next action; change in confidence about whom to contact; time to action plan; accessibility and mobile feedback. No results have been collected yet.

## Future improvements
Spanish and other languages, more Hampton Roads cities, reviewed content with city staff, offline support, and plain-language reading-level review.
