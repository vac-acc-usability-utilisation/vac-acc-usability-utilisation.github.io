# VAC/ACC Usability & Utilisation demo site

This is a mostly-static documentation/demo site. Active source lives under `src/` and `pages/`. Archived versions exist in `archive/`.

## Develop

- Open `index.html` in a browser, or serve the repo with a static server.
- Lint: `npm run lint`
- Fix lint: `npm run lint:fix`
- Headless tests: `npm run test` (uses Playwright to run the simple browser-based tests under `src/js/tests/`)

## Performance logging (dev-only)

Lightweight timing is available and opt-in:

- Enable via URL: add `?perf=1` before the hash, e.g., `index.html?perf=1#csa/design/home`
- Or in devtools console: `localStorage.setItem('perfLog','1')` and refresh
- Disable: remove the flag `localStorage.removeItem('perfLog')`
- Clear caches: add `?clearCache=1` to the URL

When enabled, timing for template loading and page initialization phases will be logged to the console with ⏱️ markers.

## Accessibility

After navigation, focus prefers the element with `role="main"` if present, then the first heading, then the container. Tools panels behave like dialogs, with Escape to close and focus restored to the trigger.

## Notes

- Client-side search uses a prebuilt Lunr index under `lunr/`. Updating search requires rebuilding that JSON; do not edit it manually.
- Avoid changing the `archive/` folders unless explicitly updating historical snapshots.