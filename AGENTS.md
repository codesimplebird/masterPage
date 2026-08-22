# NavigationProfile Project Instructions

This file is the project contract for future AI agents. Follow these rules without asking for routine confirmation.

## Architecture

- `index.html` is the main entry and the GitHub Pages default page.
- `index.html` MUST keep its complete link `config` embedded in the HTML. Do not make it fetch `links.yaml`. Local `file://` usage must continue to work without a server.
- `index_v3.html` is the online data-loading entry. It loads `links.yaml` through `js-yaml.min.js` when served over HTTP/HTTPS.
- `index_v3.html` MUST keep an embedded `fallbackConfig` so it still renders when YAML cannot be fetched, including local `file://` usage and network failures.
- The only intended difference between `index.html` and `index_v3.html` is the link-data loading path. Keep their HTML structure, CSS, JavaScript behavior, features, accessibility, and responsive behavior synchronized.
- `index_v3.html` is the STRUCTURAL SOURCE OF TRUTH. Regenerate `index.html` from it (removing the YAML loading path) rather than hand-editing both, so the two files stay textually aligned. The only permitted differences are: `<title>` suffix, `js-yaml.min.js` script tag, `config` vs `fallbackConfig`, `isHttpUrl`/`normalizeConfig`/`loadConfig`, and the `loadConfig().then(...)` re-render in `init()`.
- `links.yaml`, the `config` in `index.html`, and `fallbackConfig` in `index_v3.html` MUST contain the same links in the same order with identical `name`, `url`, `cat`, and `icon` values.
- Keep shared localStorage keys using the `v14` namespace: `cyber-v14-theme`, `v14-link-order`, `cyber-v14-weather`, `v14-memos`, and `v14-search-history`.
- Version/name convention is `V14.3` (title `CYBER-DECK V14.3`, filename `index_v3.html` for the YAML entry). Do not introduce additional version numbers; keep only one authoritative version marker.
- Memo nomenclature: the sidebar memo panel uses `memo-in` / `memo-list` DOM ids, `.memo`, `setupMemo`, and the `v14-memos` key. Keep them consistent instead of mixing in `todo`.
- Element getter is named `byId` (never `$`); storage access goes through the `LS` wrapper, not raw `localStorage`.
- The drag-sort key is `分类 + 名称` only (no `URL`), so editing a link URL does not lose its saved position. Keep `normalizeOrderKey` to migrate the old three-part key.
- The search history dropdown uses a static header (with the clear button) plus a separate `role="listbox"` container whose options are `div[role=option]`; focus stays on the input via `aria-activedescendant`. Keep that structure.
- Only `#search-status` (sr-only, `role="status"`) is an `aria-live` region; `#render-area` must NOT be live, or every keystroke re-reads the whole board.
- Keep the existing v3 migration for legacy `v16` localStorage keys.
- Files under `archive/` are historical snapshots. Do not modify, delete, rename, or reformat them unless explicitly requested.
- Keep the project pure static HTML/CSS/JS. Do not introduce React, Vue, a build system, npm dependencies, or a backend unless explicitly requested.

## Automatic Synchronization

- When adding or changing a feature, style, interaction, accessibility behavior, or responsive rule, modify BOTH `index.html` and `index_v3.html` in the same change.
- Never ask whether the second HTML file should also be updated. Update it automatically.
- When changing link data, update all three data representations: `index.html` `config`, `index_v3.html` `fallbackConfig`, and `links.yaml`.
- Never solve a synchronization problem by removing the fallback, making index load YAML, or allowing the files to develop different features.
- Preserve the cyberpunk CRT-neon visual direction: near-black background, cyan primary accent, violet secondary accent, readable Chinese text, restrained glow, and purposeful motion.
- Treat desktop browsers as the primary acceptance environment. Prioritize stable mouse, keyboard, search, drag sorting, scrolling, and layout behavior on desktop; keep mobile responsive and usable, but do not introduce desktop regressions to optimize mobile details.

## Safe Editing Rules

- Read the current files and inspect `git status` before editing.
- Preserve user changes and never reset or revert unrelated work.
- Use `apply_patch` for manual edits.
- Do not modify `archive/` or `js-yaml.min.js` during normal feature work.
- Do not commit, push, or alter Git history unless the user explicitly requests it.
- Do not ask for confirmation for routine implementation, synchronization, validation, or README updates.
- Ask only when the request is destructive, conflicts with this contract, requires secrets, or has a genuinely unresolved product choice.

## Required Validation

After any change to either entry page:

1. Apply and inspect the equivalent change in both `index.html` and `index_v3.html`.
2. Extract and run `node --check` against every inline JavaScript block in both pages.
3. Compare `index.html` `config`, v3 `fallbackConfig`, and parsed `links.yaml` for exact data parity after data changes.
4. Verify both files have the same element IDs and that every `byId(...)` / `getElementById(...)` and `aria-controls` / `aria-describedby` / `for` reference resolves to a declared ID.
5. Run `git diff --check`.
6. Verify that index still works from `file://` and that v3 still loads YAML on GitHub Pages while falling back when loading fails.
7. Report changed files, validation results, and any remaining limitation concisely.

## Commit Message Encoding

The PowerShell console mangles inline Chinese when passing `-m` (GBK code-page corruption). Always write the message to a UTF-8 (no BOM) file and commit with `git commit -F <file>`. Older commits are valid UTF-8 but appeared mojibake only in the console — do not "fix" them based on console rendering.

## Optimization Priorities

Optimize in this order:

1. Desktop navigation correctness, keyboard/IME behavior, mouse interaction, drag sorting, and scrolling stability.
2. Data integrity and two-page parity.
3. Desktop accessibility and layout behavior.
4. Network failure and localStorage fallback behavior.
5. Rendering and loading performance on desktop.
6. Mobile responsive smoke testing and high-impact usability fixes.
7. Visual polish and restrained cyberpunk effects.

Respect `prefers-reduced-motion`. Prefer `transform` and `opacity` for animation. Limit animated multi-layer `text-shadow` or `box-shadow` effects to one or two elements; never apply expensive animated glow to every link card.
