---
name: cyberdeck-link-manager
description: >-
  Manage, add, remove, format, and audit bookmark links and aliases across links.yaml,
  index_v3.html, and index.html in the CYBER-DECK project.
  Use this skill whenever the user wants to add new websites, update URLs or icons,
  reorder categories, curate search aliases/pinyin mappings, or audit link health.
---

# Cyberdeck Link Manager Skill

This skill provides operational workflows and automated tools for managing bookmark data across `links.yaml`, `index_v3.html`, and `index.html`.

## Canonical 3-Way Data Rule

Whenever adding, editing, or removing a link:
1. `links.yaml` is the primary human-editable data source.
2. `fallbackConfig` in `index_v3.html` must contain identical items in the exact same order.
3. `config` in `index.html` must contain identical items in the exact same order.

## Procedures

### 1. Auditing Current Links & Aliases
Run the link audit tool:
```bash
node .agents/skills/cyberdeck-link-manager/scripts/audit_links.js
```
This inspects:
- URL protocol validity (only `http:`/`https:` allowed).
- Category assignment correctness (`media`, `ai`, `dev`, `social`, `search`).
- Domain favicon resolution and DuckDuckGo fallback readiness.
- Missing aliases in `siteAliases` for Chinese / English shorthand matching.
- Duplicate URL or name detection.

### 2. Adding / Updating Links
1. Update `links.yaml` or edit `index_v3.html`'s `fallbackConfig`.
2. Ensure new links have appropriate `siteAliases` entries if they are popular Chinese or developer platforms.
3. Run the sync and format tool:
```bash
node .agents/skills/cyberdeck-sync-validator/scripts/sync.js
node .agents/skills/cyberdeck-sync-validator/scripts/validate.js
```
