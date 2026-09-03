---
name: cyberdeck-sync-validator
description: >-
  Automated synchronization, structural diff verification, syntax checking, and parity validation
  between index.html, index_v3.html, and links.yaml for the CYBER-DECK project.
  Use this skill whenever modifying UI, styles, scripts, or link configurations to ensure zero drift
  and complete mechanical alignment between index.html and index_v3.html.
---

# Cyberdeck Sync & Validation Skill

This skill enforces the project contract defined in `AGENTS.md`. `index_v3.html` is the STRUCTURAL SOURCE OF TRUTH. `index.html` must be mechanically generated or synchronized with only 5 permitted exceptions.

## Workflow

1. **Make modifications in `index_v3.html` first**:
   All UI structure, CSS styles, JavaScript logic, accessibility attributes, and responsive rules must be edited in `index_v3.html`.

2. **Run the synchronization script**:
   ```bash
   node .agents/skills/cyberdeck-sync-validator/scripts/sync.js
   ```
   This automatically transforms `index_v3.html` into `index.html` by applying the 5 canonical structural rules:
   - Updates `<title>` to remove the ` · YAML` suffix.
   - Removes the `js-yaml.min.js` `<script>` tag.
   - Replaces `const fallbackConfig =` with `const config =` and strips v3 runtime config labels.
   - Strips `isHttpUrl`, `normalizeConfig`, and `loadConfig` loader functions.
   - Replaces `loadConfig().then(...)` in `init()` with synchronous `render()`.

3. **Run the full validation suite**:
   ```bash
   node .agents/skills/cyberdeck-sync-validator/scripts/validate.js
   ```
   Validates:
   - Inline JS syntax (`node --check` equivalent via `vm.Script`).
   - 3-way data parity (`index.html`, `index_v3.html`, and `links.yaml`).
   - DOM ID declarations vs. all `byId()`, `getElementById()`, and `aria-*` references.
   - Storage namespace consistency (`cyber-v14-*` / `v14-*`).
   - Version number synchronization (`<title>`, `.version-badge`, `README.md`).

4. **Verify 100% mechanical alignment**:
   ```bash
   node .agents/skills/cyberdeck-sync-validator/scripts/diff.js
   ```
   Confirms zero accidental structural drift between `index.html` and `index_v3.html`.
