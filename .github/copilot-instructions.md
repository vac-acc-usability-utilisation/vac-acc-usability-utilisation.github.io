Short summary

This repo is a mostly-static documentation/demo site with two archived versions under `archive/` (v1, v2) and the active source in `src/` and `pages/`.

Quick orientation (what to read first)
- `README.md` — contains a small refactor plan and recommended next tasks (useful context).
- `package.json` — dev scripts: `npm run lint`, `npm run lint:fix`. (Note: the `format` script appears malformed in the current file.)
- `index.html` (root) — entry for the static site.

Key code areas and responsibilities
- `src/js/` — application JavaScript. Important files:
  - `app.js` — top-level app orchestrator / entry behaviors.
  - `loadPage.js` — template/page fetching and injection; central to navigation.
  - `nav.js` — navigation UI and active-state handling.
  - `router.js` — hash/route parsing (look here for route format and expectations).
  - `search.js` — client-side search that uses `lunr/` indexes (see `lunr/en.json`).
  - `toolsPanel.js`, `select-searchable.js`, `language.js` — smaller feature scripts.

- `src/templates/` and `pages/` — page templates and per-page fragments loaded at runtime.
- `src/css/elements/` and `src/css/helpers/` — component and helper CSS. Namespaced by purpose.
- `locales/` — language assets (English/French). `lunr/` contains search indexes.

Data & integration points (what to watch for)
- Template/content flow: router -> `loadPage.js` fetches HTML fragments -> inject into page -> feature scripts run.
- Search: prebuilt Lunr index in `lunr/` (client-side search) — modifying search requires updating the JSON index.
- PWA: `v2/service-worker.js` and `v2/manifest.json` indicate a PWA-capable variant under `v2/`.

Developer workflows (discernible from repo)
- Linting: `npm run lint` and `npm run lint:fix` (files targeted: `src/**/*.js`).
- Formatting: `package.json` contains a `format` script but it appears to have a typo; prefer running Prettier directly, e.g. `npx prettier --write "src/**/*.{js,html,css,json,md}"`.
- Local dev: this is a static site — open `index.html` in a browser or serve the folder with a static server (e.g. `npx serve` or `python -m http.server`).

Repository conventions and patterns to follow
- Single-file concerns: most features live in their own `src/js/*.js` file (look for related DOM selectors in `index.html` and templates).
- Content is separated from templates: page fragments live in `src/templates/` or under `pages/` and are fetched at runtime.
- Language support is file-based under `locales/` and is toggled by the `language.js` module.

Where AI helpers should be careful
- Avoid changing the archive folders `archive/` unless explicitly updating historical snapshots.
- Search index updates require rebuilding `lunr/*.json` — do not edit the index JSON manually without a build step.

Useful quick examples to reference in-situ
- To find template loading behavior: search for `loadPage` or open `src/js/loadPage.js`.
- To find navigation rules: open `src/js/nav.js` and `src/js/router.js`.
- To inspect search wiring: open `src/js/search.js` and `lunr/en.json`.

If you modify project scripts
- Keep `package.json` dev scripts minimal and verify syntax. The `format` entry currently has an extra brace and will not run as intended.

If anything in this file is unclear or you'd like more depth on a specific area (routing, search, template flow, or localization), tell me which part and I'll expand the instructions or add targeted examples.
