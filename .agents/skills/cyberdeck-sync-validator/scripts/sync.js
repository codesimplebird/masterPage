#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const indexV3Path = path.join(rootDir, 'index_v3.html');
const indexPath = path.join(rootDir, 'index.html');

if (!fs.existsSync(indexV3Path)) {
    console.error(`Error: ${indexV3Path} not found!`);
    process.exit(1);
}

const indexV3Html = fs.readFileSync(indexV3Path, 'utf8');

// 1. Extract version from index_v3.html title
const titleMatch = indexV3Html.match(/<title>(CYBER-DECK\s+V[0-9.]+)\s+·\s+YAML<\/title>/i);
if (!titleMatch) {
    console.error('Error: Could not extract versioned title from index_v3.html');
    process.exit(1);
}
const baseTitle = titleMatch[1];

let transformed = indexV3Html;

// 1. Title suffix replacement: "CYBER-DECK V... · YAML" -> "CYBER-DECK V..."
transformed = transformed.replace(
    new RegExp(`<title>${baseTitle}\\s+·\\s+YAML<\\/title>`, 'i'),
    `<title>${baseTitle}</title>`
);

// 2. js-yaml script tag and comment
transformed = transformed.replace(
    /\s*<!-- v3 专有：YAML 解析库。必须同步加载，body 末尾的内联脚本要在 loadConfig 前拿到 jsyaml -->\s*<script src="js-yaml\.min\.js"><\/script>\n\n/,
    '\n\n'
);

// 3. fallbackConfig -> config and strip v3 config extra
transformed = transformed.replace('const fallbackConfig = {', 'const config = {');
transformed = transformed.replace(
    /\s*\/\/\s*YAML 是线上主数据源；内置配置用于 file:\/\/ 或网络失败时的离线兜底\s*let config = fallbackConfig;\s*const CATEGORY_LABELS = \{[\s\S]*?\};\n\n/,
    '\n'
);

// 4. isHttpUrl / normalizeConfig / loadConfig functions
transformed = transformed.replace(
    /\s*\/\/\s*只放行 http\/https：拦掉 javascript: 之类的协议\s*function isHttpUrl[\s\S]*?async function loadConfig\(\) \{[\s\S]*?\}\n\n/,
    '\n'
);

// 5. loadConfig in init()
transformed = transformed.replace(
    /\s*render\(\);\s*loadConfig\(\)\.then\(loaded => \{\s*if \(loaded\) render\(els\.searchIn\.value\);\s*\}\);/,
    '\n                render();'
);

fs.writeFileSync(indexPath, transformed, 'utf8');
console.log(`✓ Successfully regenerated index.html from index_v3.html (${baseTitle})!`);
