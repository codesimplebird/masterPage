#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const indexV3Html = fs.readFileSync(path.join(rootDir, 'index_v3.html'), 'utf8');

const titleMatch = indexV3Html.match(/<title>(CYBER-DECK\s+V[0-9.]+)\s+·\s+YAML<\/title>/i);
if (!titleMatch) {
    console.error('Error: Could not extract versioned title from index_v3.html');
    process.exit(1);
}
const baseTitle = titleMatch[1];

let transformedV3 = indexV3Html;

transformedV3 = transformedV3.replace(
    new RegExp(`<title>${baseTitle}\\s+·\\s+YAML<\\/title>`, 'i'),
    `<title>${baseTitle}</title>`
);

transformedV3 = transformedV3.replace(
    /\s*<!-- v3 专有：YAML 解析库。必须同步加载，body 末尾的内联脚本要在 loadConfig 前拿到 jsyaml -->\s*<script src="js-yaml\.min\.js"><\/script>\n\n/,
    '\n\n'
);

transformedV3 = transformedV3.replace('const fallbackConfig = {', 'const config = {');
transformedV3 = transformedV3.replace(
    /\s*\/\/\s*YAML 是线上主数据源；内置配置用于 file:\/\/ 或网络失败时的离线兜底\s*let config = fallbackConfig;\s*const CATEGORY_LABELS = \{[\s\S]*?\};\n\n/,
    '\n'
);

transformedV3 = transformedV3.replace(
    /\s*\/\/\s*只放行 http\/https：拦掉 javascript: 之类的协议\s*function isHttpUrl[\s\S]*?async function loadConfig\(\) \{[\s\S]*?\}\n\n/,
    '\n'
);

transformedV3 = transformedV3.replace(
    /\s*render\(\);\s*loadConfig\(\)\.then\(loaded => \{\s*if \(loaded\) render\(els\.searchIn\.value\);\s*\}\);/,
    '\n                render();'
);

if (transformedV3 === indexHtml) {
    console.log('✓ Perfect 100% mechanical alignment! index.html matches transformed index_v3.html byte-for-byte.');
    process.exit(0);
} else {
    console.error('✗ Drift detected between index.html and index_v3.html!');
    process.exit(1);
}
