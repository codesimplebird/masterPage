---
name: navigation-page-optimizer
description: Use when the user asks to optimize, restyle, or add features to this cyberpunk navigation page, mentions index.html / index_v3.html / links.yaml, asks for neon/CRT/cyberpunk effects, scrollbar or font styling, or needs both HTML files updated in sync. Encodes project structure, dual-file sync rules, and researched front-end techniques.
---

# Navigation Page Optimizer

Optimize the personal browser startpage (CYBER-DECK). The project is a pure static HTML/CSS/JS startpage deployed on GitHub Pages, with a cyberpunk neon aesthetic. All optimizations must preserve the existing two-entry structure and keep data logic intact.

## Project Structure

- `index.html` — GitHub Pages default entry, V14.3. Link data is hardcoded in `const config` (36 links, 5 categories).
- `index_v3.html` — V16. Loads `links.yaml` at runtime via `js-yaml.min.js`, with `fallbackConfig` for offline use. No other functional difference from index.
- `links.yaml` — Data source for v3; must stay in sync with index's `config`.
- `js-yaml.min.js` — YAML parser used by v3.
- `archive/` — Historical versions, do not touch.

## Golden Rules

1. **Dual-file sync**: Every feature/style change must be applied to BOTH `index.html` and `index_v3.html`. The only allowed difference is data loading (index inline config vs v3 YAML load). Keep DOM structure, CSS, and JS behavior identical.
2. **Data sync**: `index.html` `config`, v3 `fallbackConfig`, and `links.yaml` must list identical links (same name, url, cat, icon) in the same order. Verify with a config-parity check after any data change.
3. **Shared storage keys**: Both pages use `v14` prefixed keys (`cyber-v14-theme`, `v14-link-order`, `cyber-v14-weather`, `v14-memos`, `v14-search-history`). v3 keeps a one-time `migrateLegacyStorage()` for old `v16` keys — do not remove it.
4. **Performance**: Neon effects (multi-layer `text-shadow`, animated `box-shadow`) are GPU-intensive. Use them on 1-2 elements max (clock, headings). Never animate `box-shadow`/`text-shadow` on scrollable lists.
5. **Accessibility**: Respect `prefers-reduced-motion` for every animation. Keep `focus-visible` rings, `alt` text, and the noscript fallback.
6. **Desktop first**: Treat desktop mouse, keyboard, search, drag sorting, scrolling, and layout stability as the primary acceptance criteria. Keep mobile usable, but never trade desktop stability for low-priority mobile polish.

## Aesthetic Direction

Cyberpunk CRT-neon: near-black background, cyan `#00f2ff` primary, violet `#9d50ff` secondary. Distinctive display font for clock/headings, mono for code/labels, Noto Sans SC for Chinese. Add atmosphere with grid + noise + glow; never default to flat colors.

For the concrete techniques (neon text, scrollbars, noise, CRT scanlines, fonts, background glow), consult:

- **`references/cyberpunk-techniques.md`** — Copy-ready CSS for neon glow, flicker/pulsate keyframes, custom scrollbars, selection color, SVG noise overlay, CRT scanlines, and font pairing.

## Optimization Workflow

1. Read the current state of both HTML files and identify which feature is being added or changed.
2. Apply the change to `index.html` first, then replicate identically in `index_v3.html` (except data loading).
3. For link data changes: update `links.yaml` first, then sync the v3 `fallbackConfig`, then update index's `config`.
4. Verify:
   - Run `node --check` on extracted inline `<script>` blocks of both files.
   - Run a config-parity check: index `config` vs v3 `fallbackConfig` vs parsed `links.yaml` must be JSON-identical.
   - Confirm both pages still load `links.yaml` (v3) and fall back gracefully.
   - Check `git diff --check` for whitespace errors.
5. Test desktop behavior first, then perform a mobile responsive smoke test.
6. Report what changed in each file and confirm parity.

## Constraints

- Pure static HTML — no build step, no framework, no npm dependencies. Inline CSS and JS stay in each HTML file.
- Fonts load async from geekzu mirror; icons come from site favicons with first-letter fallback.
- Do not modify `archive/` or `js-yaml.min.js`.
