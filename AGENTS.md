# NavigationProfile Project Instructions

This file is the project contract for future AI agents. Follow these rules without asking for routine confirmation.

## Architecture

- `index.html` is the main entry and the GitHub Pages default page.
- `index.html` MUST keep its complete link `config` embedded in the HTML. Do not make it fetch `links.yaml`. Local `file://` usage must continue to work without a server.
- `index_v3.html` is the online data-loading entry. It loads `links.yaml` through `js-yaml.min.js` when served over HTTP/HTTPS.
- `index_v3.html` MUST keep an embedded `fallbackConfig` so it still renders when YAML cannot be fetched, including local `file://` usage and network failures.
- The only intended difference between `index.html` and `index_v3.html` is the link-data loading path. Keep their HTML structure, CSS, JavaScript behavior, features, accessibility, and responsive behavior synchronized.
- `links.yaml`, the `config` in `index.html`, and `fallbackConfig` in `index_v3.html` MUST contain the same links in the same order with identical `name`, `url`, `cat`, and `icon` values.
- Keep shared localStorage keys using the `v14` namespace: `cyber-v14-theme`, `v14-link-order`, `cyber-v14-weather`, `v14-memos`, and `v14-search-history`.
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
4. Run `git diff --check`.
5. Verify that index still works from `file://` and that v3 still loads YAML on GitHub Pages while falling back when loading fails.
6. Report changed files, validation results, and any remaining limitation concisely.

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
