# Cyberpunk Techniques Reference

Copy-ready CSS for the CYBER-DECK startpage. All snippets assume the CSS custom properties `--neon` and `--neon-alt` are defined. Wrap every animated effect in `@media (prefers-reduced-motion: no-preference)`.

## Neon Text Glow

Multi-layer `text-shadow` creates depth that a single shadow cannot. Three tight white/blur layers form the tube core, five wide layers form the colored halo.

```css
.neon-text {
    color: #fff;
    text-shadow:
        0 0 4px #fff,
        0 0 8px #fff,
        0 0 16px #fff,
        0 0 40px var(--neon),
        0 0 80px var(--neon),
        0 0 120px var(--neon),
        0 0 160px var(--neon);
}
```

Apply to 1-2 elements only (clock numerals, category headings). Do not apply to every link card.

## Pulsating Glow

```css
@keyframes neon-pulse {
    0% {
        text-shadow:
            0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff,
            0 0 10px var(--neon), 0 0 45px var(--neon),
            0 0 55px var(--neon), 0 0 70px var(--neon);
    }
    100% {
        text-shadow:
            0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff,
            0 0 40px var(--neon), 0 0 80px var(--neon),
            0 0 90px var(--neon), 0 0 100px var(--neon);
    }
}

@media (prefers-reduced-motion: no-preference) {
    .neon-text {
        animation: neon-pulse 2.5s ease-in-out infinite alternate;
    }
}
```

## Neon Border (sign frame)

```css
.neon-frame {
    border: 1px solid #fff;
    border-radius: 16px;
    box-shadow:
        0 0 0.2rem #fff,
        0 0 0.2rem #fff,
        0 0 2rem var(--neon-alt),
        inset 0 0 1.3rem color-mix(in srgb, var(--neon-alt) 30%, transparent);
}
```

## Custom Scrollbars

Use the standard properties first (Firefox), then WebKit pseudo-elements (Chrome/Safari/Edge).

```css
/* Standard: Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--neon) 60%, transparent) rgba(128, 128, 128, 0.08);
}

/* WebKit: Chrome/Safari/Edge */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-track {
    background: rgba(128, 128, 128, 0.08);
}
::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--neon) 55%, transparent);
    border-radius: 8px;
    border: 2px solid var(--bg);
}
::-webkit-scrollbar-thumb:hover {
    background: var(--neon);
}
```

The main content area scrolls horizontally; the memo list scrolls vertically — both should use these rules.

## Selection Color

```css
::selection {
    background: color-mix(in srgb, var(--neon) 35%, transparent);
    color: var(--text-main);
}
```

## SVG Noise / Grain Overlay

Zero-dependency atmosphere layer via an inline `feTurbulence` data-URI. Place after the grid layer, below interactive content.

```css
.noise-layer {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

For light theme, lower opacity or switch the color source — keep it subtle.

## CRT Scanlines

Optional retro layer. Use `repeating-linear-gradient` with tiny translucent stripes.

```css
.scanlines {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.05;
    background: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent 2px,
        rgba(255, 255, 255, 0.6) 3px
    );
}
```

Do not stack with `prefers-reduced-motion` issues — scanlines are static, safe to keep.

## Ambient Top Glow

Radial cyan glow anchored at the top to give the grid depth.

```css
body::before {
    content: '';
    position: fixed;
    inset: -20% -20% auto -20%;
    height: 50vh;
    z-index: -2;
    background: radial-gradient(ellipse at top, color-mix(in srgb, var(--neon) 12%, transparent), transparent 65%);
    pointer-events: none;
}
```

## Font Pairing

- **Display (clock / headings)**: Orbitron (geometric, techy, supports Latin). Pair with Noto Sans SC for Chinese glyph fallback.
- **Mono (labels, stats, urls)**: JetBrains Mono.
- **Body**: Noto Sans SC / system fallback.

Async load pattern (non-blocking, same as existing font link):

```html
<link rel="preconnect" href="https://fonts.geekzu.org" crossorigin>
<link rel="stylesheet"
      href="https://fonts.geekzu.org/css2?family=Orbitron:wght@500;700&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+SC:wght@300;400;700&display=swap"
      media="print" onload="this.media='all'">
```

Apply Orbitron only where a display font is wanted:

```css
.clock-time, .cat-header {
    font-family: 'Orbitron', 'Noto Sans SC', sans-serif;
}
```

## Performance Rules

- Never animate `box-shadow` or `text-shadow` on more than 2 elements.
- Prefer `transform` and `opacity` animations for cards/lists.
- All neon animations gated behind `@media (prefers-reduced-motion: no-preference)`.
- Noise/glow layers use `position: fixed` + `z-index` to avoid repaint of the whole scroll container.
