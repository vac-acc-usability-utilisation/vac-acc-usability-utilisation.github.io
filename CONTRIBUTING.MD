# Contributing

Thanks for helping improve this project. This file covers the basic workflow, code style, and a PR checklist to keep contributions small and safe.

## Getting started (local)
- Clone the repo and open in VS Code.
- Install deps (if repo uses npm):
  - Windows (PowerShell / CMD):
    - npm install
    - npm run dev        # start local dev server (if configured)
    - npm run build      # build for production
- Lint & format:
  - npm run lint
  - npm run format

The project has no build tools, open `index.html` in a simple server:
- npx http-server -c-1 .

## Branches & commits
- Create feature branches from `main`:
  - feature/<short-description>
  - fix/<short-description>
- Keep commits focused and atomic.
- Commit message style:
  - Short summary (50 chars max)
  - Blank line
  - Optional longer description

Example:
```
feat: add fetchWithCache util

Adds an in-memory fetch cache and replaces raw fetch calls in loadPage.js.
```

## Code style
- Follow existing JS style (ES6 modules).
- Prefer small, testable functions.
- Add JSDoc or inline comments for non-obvious logic.
- Run lint/formatter before opening a PR.

## Tests
- Add unit tests for core logic (router parsing, path resolution, fetch cache).
- Run tests locally:
  - npm test

## Accessibility & UX
- Ensure keyboard focus and aria attributes are correct for interactive components.
- Preserve existing behavior for small changes; document intentional UX updates.

---

## PR checklist (use before requesting review)

- [ ] PR targets `main` (or the agreed branch)
- [ ] Title: concise summary (e.g., `fix: loadPage cache bug`)
- [ ] Description: what changed and why, with links to relevant issue(s)
- [ ] Small, focused change (try to keep PRs < 200 LOC)
- [ ] All new logic is covered by unit tests (where applicable)
- [ ] All tests pass locally (run `npm test`)
- [ ] Lint and format run without errors (`npm run lint`, `npm run format`)
- [ ] Manual smoke tests completed:
  - [ ] App boots
  - [ ] Navigation loads expected pages
  - [ ] Tools panel opens (if touched)
  - [ ] Search behaves (if touched)
  - [ ] Language toggle works (if touched)
- [ ] No console errors in the browser during smoke tests
- [ ] Screenshots added for visual/UI changes (if applicable)
- [ ] CI passing on GitHub Actions
- [ ] Request at least one reviewer and add PR labels

---

## PR size & rollout strategy
- Prefer incremental PRs that implement one phase/goal.
- If risky, open a draft PR early to gather feedback.