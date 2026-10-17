<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- FloodWise is fully client-side: no backend, accounts, analytics, or AI. Why: privacy-by-design is a core requirement.
- Assessment logic is a pure function in src/lib/floodwise/rules.ts, covered by rules.test.ts. Why: transparent, testable safety guidance.
- City contacts live only in src/lib/floodwise/resources.ts and must not include unverified numbers/URLs. Why: single source of verified data.
