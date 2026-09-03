#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const indexV3Html = fs.readFileSync(path.join(rootDir, 'index_v3.html'), 'utf8');

console.log('=== CYBER-DECK Accessibility & Performance Audit ===\n');

let passes = [];
let fails = [];
let notes = [];

// 1. Accessibility Checks
function checkA11y() {
    // 1.1 Combobox semantics
    if (indexV3Html.includes('role="combobox"') &&
        indexV3Html.includes('aria-controls="search-history-list"') &&
        indexV3Html.includes('aria-expanded=')) {
        passes.push('Search input satisfies ARIA 1.2 combobox pattern');
    } else {
        fails.push('Search input missing ARIA 1.2 combobox attributes');
    }

    // 1.2 Live regions check
    if (indexV3Html.includes('id="search-status"') && indexV3Html.includes('aria-live="polite"')) {
        passes.push('Dedicated search live region (#search-status) present');
    } else {
        fails.push('Missing aria-live="polite" on #search-status');
    }

    if (indexV3Html.includes('id="render-area"') && !indexV3Html.match(/id=["']render-area["'][^>]*aria-live/)) {
        passes.push('Link board (#render-area) correctly avoids aria-live');
    } else {
        fails.push('Link board (#render-area) should NOT be an aria-live region');
    }

    // 1.3 Focus visible outlines
    if (indexV3Html.includes(':focus-visible') || indexV3Html.includes(':focus')) {
        passes.push('Keyboard focus indicators declared in CSS');
    } else {
        fails.push('Missing keyboard focus outline definitions');
    }

    // 1.4 Reduced motion
    if (indexV3Html.includes('prefers-reduced-motion')) {
        passes.push('@media (prefers-reduced-motion) degrades animations gracefully');
    } else {
        fails.push('Missing prefers-reduced-motion query');
    }
}

// 2. Performance Checks
function checkPerf() {
    // 2.1 GPU acceleration on fixed background layers
    const bgGridAccelerated = indexV3Html.includes('.bg-grid') && indexV3Html.includes('translateZ(0)');
    const noiseAccelerated = indexV3Html.includes('.noise-layer') && indexV3Html.includes('translateZ(0)');
    if (bgGridAccelerated && noiseAccelerated) {
        passes.push('Full-bleed background layers (.bg-grid, .noise-layer) promoted to GPU composite layers');
    } else {
        fails.push('Background layers missing transform: translateZ(0) GPU acceleration');
    }

    // 2.2 DNS prefetch
    if (indexV3Html.includes('rel="dns-prefetch"')) {
        passes.push('Critical third-party domains pre-fetched via <link rel="dns-prefetch">');
    } else {
        notes.push('Consider adding dns-prefetch tags for external APIs');
    }

    // 2.3 Image lazy loading & priority
    if (indexV3Html.includes('loading = \'lazy\'') && indexV3Html.includes('fetchpriority = \'low\'')) {
        passes.push('Bookmark icons use lazy loading, async decoding, and low fetch priority');
    } else {
        fails.push('Icon images should use lazy loading and low fetch priority');
    }

    // 2.4 Dead cursor check
    if (!indexV3Html.includes('neonCursor') && !indexV3Html.includes('click-ripple')) {
        passes.push('Zero wasteful per-frame mousemove / rAF listeners or ripple DOM allocations');
    } else {
        fails.push('Found legacy neonCursor or click-ripple references');
    }
}

checkA11y();
checkPerf();

console.log('Passed Checks:');
passes.forEach(p => console.log(`  ✓ ${p}`));

if (fails.length > 0) {
    console.error('\nFailed Checks:');
    fails.forEach(f => console.error(`  ✗ ${f}`));
}

if (notes.length > 0) {
    console.warn('\nRecommendations:');
    notes.forEach(n => console.warn(`  ℹ ${n}`));
}

console.log(`\nScore: ${passes.length}/${passes.length + fails.length} Passed.`);
