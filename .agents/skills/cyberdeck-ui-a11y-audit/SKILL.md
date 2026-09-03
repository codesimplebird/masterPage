---
name: cyberdeck-ui-a11y-audit
description: >-
  Visual aesthetics, cyberpunk CRT neon theme contrast, WCAG AA accessibility,
  keyboard navigation, and GPU rendering performance evaluation for the CYBER-DECK project.
  Use this skill whenever evaluating UI changes, theme styling, animations, ARIA semantics,
  or layout performance.
---

# Cyberdeck UI, Accessibility & Performance Audit Skill

This skill provides quality assurance guidelines and automated audits for the cyberpunk UI, accessibility semantics, and rendering performance of CYBER-DECK.

## Core Evaluation Dimensions

1. **Cyberpunk Visual Restraint**:
   - Dark mode: Near-black background (`#050508`), Cyan primary accent (`#00f2ff`), Violet secondary accent (`#9d50ff`).
   - Light mode: Clean high-contrast palette (`#eef1f6` / `#0055ff` / `#14161f`) meeting WCAG 2.1 AA (≥ 4.5:1).
   - Glow effects: Restrained drop-shadows on headers and interactive focus rings; never multi-layered expensive shadow animations on all 30+ link cards simultaneously.

2. **Accessibility & Screen Reader Semantics (ARIA 1.2)**:
   - Search input behaves as an ARIA 1.2 `combobox` with `aria-controls="search-history-list"`, `aria-haspopup="listbox"`, and `aria-activedescendant`.
   - Live regions: Only `#search-status` is `aria-live="polite"`. The main link board (`#render-area`) must NEVER be an `aria-live` region.
   - Decorative icons and emoji must declare `aria-hidden="true"`.
   - Links must provide meaningful labels or fallback text.

3. **Keyboard & IME Usability**:
   - `/` or `Ctrl+K` globally focuses the search bar.
   - `↑` / `↓` navigates search history dropdown or visible link cards.
   - `Enter` submits multi-engine search or activates focused card; IME composition (keyCode 229 / `isComposing`) is respected.
   - `Esc` closes history or clears search filter.

4. **Rendering & Compositing Performance**:
   - Background layers (`.bg-grid`, `.noise-layer`) must use `transform: translateZ(0)` for GPU hardware compositing.
   - Images must use `loading="lazy"`, `decoding="async"`, and `fetchpriority="low"`.
   - Heavy animations must respect `@media (prefers-reduced-motion: reduce)`.

## Running the Automated Audit

```bash
node .agents/skills/cyberdeck-ui-a11y-audit/scripts/audit_a11y_perf.js
```
