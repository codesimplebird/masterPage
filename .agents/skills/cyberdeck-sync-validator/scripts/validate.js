#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '../../../../');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const indexV3Html = fs.readFileSync(path.join(rootDir, 'index_v3.html'), 'utf8');
const linksYaml = fs.readFileSync(path.join(rootDir, 'links.yaml'), 'utf8');
const readmeMd = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
const jsYamlLib = fs.readFileSync(path.join(rootDir, 'js-yaml.min.js'), 'utf8');

const jsYamlSandbox = {};
vm.createContext(jsYamlSandbox);
vm.runInContext(jsYamlLib, jsYamlSandbox);
const yamlParser = jsYamlSandbox.jsyaml;

let errors = [];
let warnings = [];

// 1. JS Syntax Check
function extractScripts(html, filename) {
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match, index = 0;
    while ((match = scriptRegex.exec(html)) !== null) {
        index++;
        const content = match[1].trim();
        if (!content) continue;
        try {
            new vm.Script(content, { filename: `${filename}-script-${index}.js` });
        } catch (e) {
            errors.push(`JS Syntax Error in ${filename} script #${index}: ${e.message}`);
        }
    }
}
extractScripts(indexHtml, 'index.html');
extractScripts(indexV3Html, 'index_v3.html');

// 2. Link Parity Check
function extractConfig(html, varName) {
    const match = html.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\{[\\s\\S]*?\\n\\s*\\};)`));
    if (!match) return null;
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`var result = ${match[1]}`, sandbox);
    return sandbox.result;
}

const indexConfig = extractConfig(indexHtml, 'config');
const v3Config = extractConfig(indexV3Html, 'fallbackConfig');
let parsedYaml = yamlParser.load(linksYaml);
const yamlLinks = parsedYaml ? (Array.isArray(parsedYaml) ? parsedYaml : parsedYaml.links) : [];

if (indexConfig && v3Config && parsedYaml) {
    if (indexConfig.links.length !== v3Config.links.length || indexConfig.links.length !== yamlLinks.length) {
        errors.push(`Link count mismatch: index=${indexConfig.links.length}, v3=${v3Config.links.length}, yaml=${yamlLinks.length}`);
    }
    const maxLen = Math.max(indexConfig.links.length, v3Config.links.length, yamlLinks.length);
    for (let i = 0; i < maxLen; i++) {
        const l1 = indexConfig.links[i] || {};
        const l2 = v3Config.links[i] || {};
        const ly = yamlLinks[i] || {};
        for (const k of ['name', 'url', 'cat', 'icon']) {
            const v1 = l1[k] === undefined ? '' : l1[k];
            const v2 = l2[k] === undefined ? '' : l2[k];
            const vy = ly[k] === undefined ? '' : ly[k];
            if (v1 !== v2 || v1 !== vy) {
                errors.push(`Link mismatch at index ${i} (${l1.name || l2.name || ly.name}): field '${k}' -> index: "${v1}", v3: "${v2}", yaml: "${vy}"`);
            }
        }
    }
} else {
    errors.push('Failed to parse config objects from HTML or YAML');
}

// 3. ID declarations and reference check
function extractDeclaredIds(html) {
    const idRegex = /\bid=["']([^"']+)["']/g;
    const ids = new Set();
    let match;
    while ((match = idRegex.exec(html)) !== null) ids.add(match[1]);
    return ids;
}

const indexIds = extractDeclaredIds(indexHtml);
const v3Ids = extractDeclaredIds(indexV3Html);

for (const id of indexIds) {
    if (!v3Ids.has(id)) errors.push(`ID '${id}' in index.html missing in index_v3.html`);
}
for (const id of v3Ids) {
    if (!indexIds.has(id)) errors.push(`ID '${id}' in index_v3.html missing in index.html`);
}

function checkReferences(html, filename, declaredIds) {
    const byIdRegex = /\b(?:byId|getElementById)\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    let match;
    while ((match = byIdRegex.exec(html)) !== null) {
        if (!declaredIds.has(match[1])) errors.push(`${filename}: byId('${match[1]}') references undeclared ID`);
    }
    const attrRegex = /\b(aria-controls|aria-describedby|for)=["']([^"']+)["']/g;
    while ((match = attrRegex.exec(html)) !== null) {
        const targets = match[2].split(/\s+/);
        for (const target of targets) {
            if (!declaredIds.has(target)) errors.push(`${filename}: ${match[1]}="${target}" references undeclared ID`);
        }
    }
}
checkReferences(indexHtml, 'index.html', indexIds);
checkReferences(indexV3Html, 'index_v3.html', v3Ids);

// 4. Version Check
const indexBadge = (indexHtml.match(/class=["']version-badge["'][^>]*>([^<]+)</i) || [])[1];
const v3Badge = (indexV3Html.match(/class=["']version-badge["'][^>]*>([^<]+)</i) || [])[1];
if (indexBadge !== v3Badge) errors.push(`Badge mismatch: index=${indexBadge}, v3=${v3Badge}`);
if (indexBadge && !readmeMd.includes(indexBadge)) warnings.push(`README.md does not mention version ${indexBadge}`);

// 5. CSS parity
const indexCss = (indexHtml.match(/<style>([\s\S]*?)<\/style>/) || [])[1];
const v3Css = (indexV3Html.match(/<style>([\s\S]*?)<\/style>/) || [])[1];
if (indexCss !== v3Css) errors.push('CSS styles mismatch between index.html and index_v3.html');

console.log('=== Cyberdeck Validation Summary ===');
if (errors.length === 0) {
    console.log(`✓ All checks passed! 0 errors. (Version: ${indexBadge}, Links: ${indexConfig ? indexConfig.links.length : 0})`);
    if (warnings.length > 0) warnings.forEach(w => console.warn(`⚠ ${w}`));
    process.exit(0);
} else {
    console.error(`✗ Found ${errors.length} error(s):`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
}
