# Small Refactor Plan

Goal: Improve readability, modularity and performance with low-risk incremental changes. Work is broken into small phases so each deliverable is testable and reversible.

## Phase 0 — Prep & safety (0.5–1 day)
- ~~Add CONTRIBUTING.md / PR checklist.~~
- ~~Add basic linting (ESLint) and formatting (Prettier) configuration.~~
- ~~Add a simple in-memory fetch cache util (utils/fetchWithCache.js).~~
- ~~Add a tiny utilities module for debounce and constants.~~
~~Acceptance: repo has lint/format configs, utilities file, and a short PR template.~~

## Phase 1 — Fetch & cache utilities (0.5–1 day)
- ~~Implement fetchWithCache(url) and debounce(fn, ms).~~
- ~~Replace direct fetches in app.js, loadPage.js, search.js, toolsPanel.js with fetchWithCache.~~
- ~~Add small error-handling wrapper for template loads.~~
~~Risk: low — changes are localized.~~
~~Acceptance: identical UX, fewer network requests in repeated navigation.~~

## Phase 2 — Router & routing surface (1 day)
- ~~Extract hash parsing into a single Router module that exports:~~
  - ~~getCurrentRoute(), onRouteChange(cb), navigateTo(segments).~~
- ~~Make handleRouting use the Router module.~~
- ~~Make loadNavigation/route consumers subscribe to route changes instead of reading window.hash directly.~~
~~Benefits: decouples hash parsing and page-loading.~~
~~Acceptance: URL changes still load correct page; unit tests for parser.~~

## Phase 3 — LoadPage: split responsibilities (1–1.5 days)
- ~~Refactor loadPage to:~~
  - ~~resolvePath(segments) — deterministic path resolution (unit tested).~~
  - ~~fetchAndRender(path, container) — uses fetchWithCache.~~
  - ~~postInit(segments) — runs UI initializers (selects panels, tabs).~~
- ~~Return Promise from loadPage for better sequencing.~~
~~Acceptance: easier to test path logic; no behavioral change.~~

## Phase 4 — Navigation module cleanup (1–2 days)
- ~~Convert nav.js into a small component with explicit lifecycle:~~
  - ~~initNavigation(root)~~
  - ~~destroyNavigation()~~
  - ~~updateActiveRailItem(area)~~
- ~~Replace imperative body-delegation with scoped delegation on nav root.~~
- ~~Improve guard clauses and reduce long monolithic functions into small helpers.~~
~~Acceptance: nav can be initialized/unmounted; behaviors unchanged.~~

## Phase 5 — Componentize small features (1.5–2 days)
- ~~Create small modules (each with init(root) and destroy()):~~
  - ~~toolsPanel.js (already modular — ensure lifecycle)~~
  - ~~selectSearchable.js (export init(root) — already present)~~
  - ~~search.js (init only when search page loaded, with debounce)~~
  - ~~language.js (export init and updateTranslations)~~
- ~~Ensure these modules are only initialized for the injected page area.~~
~~Acceptance: avoid duplicate event listeners leaking across navigation.~~

## Phase 6 — Tests and CI (1–2 days)
- ~~Add unit tests for:~~
  - ~~hash parsing and route object generation~~
  - ~~resolvePath logic in loadPage~~
  - ~~fetchWithCache behaviour (mocked fetch)~~
- ~~Add GitHub Actions to run lint and tests.~~
~~Acceptance: CI passes on PRs.~~

## Phase 7 — Performance & polish (optional, 1–2 days)
- Cache templates in sessionStorage where appropriate.
- Consider using a small router library or move to History API if needed.
- Add basic accessibility checks (aria-expanded consistency, focus management on navigation).
Acceptance: measurable navigation responsiveness and improved AX.

## PR & rollout strategy
- Make one-phase-per-PR, keep PRs small (< 200 LOC).
- Each PR includes: description, migration notes, tests for critical logic, and a smoke test checklist.
- Run manual smoke tests: initial load, navigation between 3 pages, open/close tools panel, search flow, language toggle.

## Risks & mitigations
- Risk: event listener duplication → mitigate by lifecycle destroy() and scoping.
- Risk: cache stale templates → implement cache invalidation (timestamp or dev mode bypass).
- Risk: regressions → small PRs + unit tests + manual smoke test.