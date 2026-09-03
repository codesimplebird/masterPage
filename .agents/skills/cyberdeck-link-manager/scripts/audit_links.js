#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '../../../../');
const linksYamlPath = path.join(rootDir, 'links.yaml');
const indexV3Path = path.join(rootDir, 'index_v3.html');
const jsYamlLibPath = path.join(rootDir, 'js-yaml.min.js');

const jsYamlSandbox = {};
vm.createContext(jsYamlSandbox);
vm.runInContext(fs.readFileSync(jsYamlLibPath, 'utf8'), jsYamlSandbox);
const yaml = jsYamlSandbox.jsyaml;

const parsed = yaml.load(fs.readFileSync(linksYamlPath, 'utf8'));
const links = parsed.links || [];
const categories = parsed.categories || [];
const validCatIds = new Set(categories.map(c => c.id));

const indexV3Html = fs.readFileSync(indexV3Path, 'utf8');

// Extract siteAliases from index_v3.html
const aliasMatch = indexV3Html.match(/const\s+siteAliases\s*=\s*(\{[\s\S]*?\n\s*\};)/);
let siteAliases = {};
if (aliasMatch) {
    const sb = {};
    vm.createContext(sb);
    vm.runInContext(`var res = ${aliasMatch[1]}`, sb);
    siteAliases = sb.res;
}

console.log('=== Cyberdeck Link Audit ===');
console.log(`Total Categories: ${categories.length}`);
console.log(`Total Links: ${links.length}\n`);

let issues = [];
let warnings = [];
let stats = {};

const seenUrls = new Set();
const seenNames = new Set();

links.forEach((link, idx) => {
    stats[link.cat] = (stats[link.cat] || 0) + 1;

    // 1. Check URL
    if (!link.url || typeof link.url !== 'string') {
        issues.push(`[#${idx + 1}] Link "${link.name}" has missing/invalid URL`);
    } else {
        try {
            const parsedUrl = new URL(link.url);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                issues.push(`[#${idx + 1}] Link "${link.name}" uses invalid protocol: ${parsedUrl.protocol}`);
            }
        } catch (e) {
            issues.push(`[#${idx + 1}] Link "${link.name}" has unparseable URL: "${link.url}"`);
        }
    }

    // 2. Duplicate check
    if (seenUrls.has(link.url)) {
        warnings.push(`Duplicate URL found: ${link.url} (${link.name})`);
    }
    seenUrls.add(link.url);

    if (seenNames.has(link.name)) {
        warnings.push(`Duplicate Name found: ${link.name}`);
    }
    seenNames.add(link.name);

    // 3. Category validation
    if (!validCatIds.has(link.cat)) {
        issues.push(`[#${idx + 1}] Link "${link.name}" has undeclared category: "${link.cat}"`);
    }

    // 4. Icon check
    if (link.icon) {
        try {
            const parsedIcon = new URL(link.icon);
            if (parsedIcon.protocol !== 'http:' && parsedIcon.protocol !== 'https:') {
                issues.push(`[#${idx + 1}] Link "${link.name}" has invalid icon protocol: ${parsedIcon.protocol}`);
            }
        } catch (e) {
            issues.push(`[#${idx + 1}] Link "${link.name}" has unparseable icon URL: "${link.icon}"`);
        }
    }

    // 5. Alias check
    const host = link.url ? link.url.toLowerCase() : '';
    const nameLower = link.name ? link.name.toLowerCase() : '';
    const hasAlias = Object.keys(siteAliases).some(k => host.includes(k) || nameLower.includes(k));
    if (!hasAlias && (nameLower.length > 6 || /[\u4e00-\u9fa5]/.test(nameLower))) {
        // Just informative
    }
});

console.log('Category Distribution:');
categories.forEach(c => {
    console.log(`  - ${c.name} (${c.id}): ${stats[c.id] || 0} links`);
});

console.log('\nAudit Results:');
if (issues.length === 0) {
    console.log('✓ Zero critical link issues found.');
} else {
    console.error(`✗ Found ${issues.length} critical issue(s):`);
    issues.forEach(i => console.error(`  - ${i}`));
}

if (warnings.length > 0) {
    console.warn(`⚠ Warnings (${warnings.length}):`);
    warnings.forEach(w => console.warn(`  - ${w}`));
}
