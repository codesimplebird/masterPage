# NavigationProfile（个人浏览器导航页 / CYBER-DECK）

一个赛博朋克风格的个人浏览器起始页 / 导航页项目。所有文件均为**纯静态 HTML + CSS + JS**，无需构建、无需后端，可直接部署到 GitHub Pages。

## 功能特性

- **分类链接看板**：链接按媒体、AI、开发工具、社交、搜索 5 大类分列展示，采用精致 48px 图标比例与内嵌微光边缘，悬停微动外链指示 `↗`，卡片自动加载网站图标（多级容错兜底：原站图标 → DuckDuckGo Favicon 镜像 → 首字母色块）
- **实时搜索与快捷胶囊栏**：按 `/` 或 `Ctrl+K` 快速聚焦搜索框，内置胶囊化快捷键指示栏与内联一键清空按钮（`✕`）；支持拼音/缩写/别名检索（如 `bili`、`zh`、`gh`、`ds`、`notion`、`figma` 等）；命中关键词高亮并显示结果数量；历史下拉支持 `↑↓` 选择、`Enter` 搜索、`Esc` 关闭，兼容中文输入法
- **多引擎快捷指令分流**：支持 `g <query>` (Google)、`d <query>` (DeepSeek)、`gh <query>` (GitHub)、`bd <query>` (百度) 快捷分流，默认直接 Bing 搜索
- **拖拽排序**：按住卡片左侧手柄（⠿）可调整同类链接顺序，顺序保存在 localStorage，带 FLIP 让位动画与落下回弹
- **侧边栏系统面板**：
  - 实时时钟（时:分:秒 + 日期 + 状态心跳呼吸微光信标，Orbitron 数字字体）
  - 网页卡片与外框缩放调节（`CARD_SCALE` 赛博拖动条，支持 75% ~ 135% 实时平滑调节，首屏防闪烁即时渲染，双击快速重置回 100%）
  - 鼠标动效控制台（`MOUSE_FX` 赛博芯片面板，包含硬件级总开关 `ON`/`OFF` 与 4 组可独立开关的高性能动效：环境微光、战术准星、点击脉冲、粒子尾迹）
  - 机械分段式 LED 能量槽（周进度与电池电量采用纯 CSS 虚线遮罩分段光栅化）
  - 天气（通过 `wttr.in` 获取，支持点击面板手动即时刷新，1 小时缓存 TTL，后台标签页不请求）
  - 电池电量（Battery API，低电量 $\le 20\%$ 自动切换橙红荧光警示，充电时显示 ⚡ 赛博绿光）
  - 备忘录（本地持久化，Enter 添加、✕ 删除）
- **深色 / 浅色主题**切换，主题偏好持久化，并内置防闪屏脚本（FOUC）
- **视觉与鼠标动效系统**：
  - 全局环境微光暗流（Ambient Neon Spotlight，柔和照亮背景网格，带物理惯性阻尼与静止 0% 空闲停机机制）
  - 战术 HUD 准星（Tactical Crosshair，悬停链接/按钮自动锁定旋转 45° 并变紫扩散）
  - 电磁脉冲点击冲击波（Tactical EMP Click Wave，点击卡片自动提取并激荡专属霓虹品牌色，零 DOM 增删 GC 压力）
  - 激光光子粒子尾迹（Laser Spark Trail，移动时划过微型等离子光斑火花流光）
  - HUD 战术拐角标、背景网格与顶部光晕、GPU 合成层优化、SVG 噪点纹理、卡片错峰进场、卡片悬停光晕、自定义滚动条与文本选择配色
- **无障碍与细节**：ARIA 1.2 combobox 语义的搜索历史下拉、结果数专用播报区、键盘可见焦点环、`prefers-reduced-motion` 降级、图标 alt 文本、无 JS 时提示
- **移动端适配**：窄屏下侧栏变为抽屉式，汉堡按钮 + 遮罩打开/关闭

## 目录结构

```text
NavigationProfile/
├── index.html             # GitHub Pages 默认入口，链接数据内联
├── index_v3.html          # 同一版本的在线数据入口，链接数据从 links.yaml 加载
├── links.yaml             # v3 的链接数据源，与 index 配置保持同步
├── js-yaml.min.js         # v3 使用的 YAML 解析库
├── AGENTS.md              # 项目契约（双文件同步、验证流程、优化优先级）
├── TODO.md                # 待办与已知限制
├── .agents/skills/        # 项目专属自动化维护与校验技能工具链
├── archive/               # 历史版本，不再维护
│   ├── index-v2.html
│   ├── master0.html
│   ├── M-google.html
│   ├── M-googleV11.html
│   └── M_dp.html
└── README.md
```

两个入口的**唯一差异是链接数据的加载方式**：`index.html` 内联 `config`，`index_v3.html`
从 `links.yaml` 读取并保留内联 `fallbackConfig` 兜底。其余 HTML 结构、CSS、JS 行为、
无障碍与响应式行为均保持一致，修改时必须同步两边。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | **CYBER-DECK V3.0.6**，GitHub Pages 默认首页，链接数据内联，可直接 `file://` 打开 |
| `index_v3.html` | **CYBER-DECK V3.0.6 · YAML**，运行时加载 `links.yaml`，失败时回退内置 `fallbackConfig` |
| `links.yaml` | v3 的链接数据源，与 index 中的链接配置保持同步 |
| `js-yaml.min.js` | v3 使用的 js-yaml 4.1.0 解析库 |
| `archive/` | 历史版本归档，不参与当前部署入口 |

## 使用方式

1. GitHub Pages 默认打开 `index.html`
2. v3 地址为 `https://<用户名>.github.io/<仓库名>/index_v3.html`
3. 本地可以直接双击打开 `index.html`
4. v3 在 `file://` 环境下会因浏览器限制无法读取 YAML，此时会自动使用内置链接配置；要测试 YAML 加载，请通过 GitHub Pages 或本地 HTTP 服务打开

## 自定义链接

主页面的链接编辑 `index.html` 内 `<script>` 中的 `config` 对象：

```js
const config = {
  categories: [
    { id: 'media', name: 'Media Stations' },
    // ...
  ],
  links: [
    { name: "站点名", url: "https://example.com", cat: "media", icon: "https://example.com/favicon.ico" },
    // ...
  ]
};
```

- `cat` 需对应 `categories` 中的 `id`
- `icon` 可留空，加载失败会自动生成首字母色块
- 新增链接会自动排在分类末尾；已有链接顺序由本机 localStorage 记忆（键名 `v14-link-order`），清除浏览器数据可重置

v3 的链接编辑 `links.yaml`；修改数据时同时同步 `index.html` 中的 `config` 与 v3 的
`fallbackConfig`，保证三处一致：

```yaml
- name: 站点名
  url: https://example.com
  cat: dev
  icon: https://example.com/favicon.ico
```

YAML 中的 `cat` 必须对应 `categories` 的 `id`；分类的 `name` 以 YAML 为准，缺失时才回退
到内置标签。字段非法（如 `cat` 拼错、`url` 非 http/https）的条目会被忽略，并在控制台
输出告警列出被丢弃的名称。

## 技术要点

- **纯原生 JS**（无框架），DOM API 构建节点，避免 innerHTML 注入问题
- 主题、备忘录、排序、搜索历史均持久化到 `localStorage`，统一走 `LS` 薄封装（隐私模式/配额满时静默降级）
- 网络请求（天气、图标）带超时与失败降级；链接 hostname 解析失败时安全回退，单条坏链接不影响整页渲染
- 天气请求带 1 小时 TTL 与在途请求锁，切换标签页不会重复打接口
- 拖拽排序仅限同类分类内，顺序标识为 `分类 + 名称`（不含 URL，改 URL 不会丢失自定义位置，并兼容旧的三段式键）
- v3 启动时优先渲染内置配置，再异步加载 `links.yaml` 并刷新链接看板

## 本地校验

改动任一入口后建议执行：

1. 提取两文件的内联 `<script>` 块并逐块 `node --check`
2. 比对 `index.html` 的 `config`、v3 的 `fallbackConfig`、`links.yaml` 三处数据是否逐字段一致
3. `git diff --check`
4. 确认两文件差异仅剩：标题、js-yaml 标签、`config`/`fallbackConfig`、
   `isHttpUrl`/`normalizeConfig`/`loadConfig`、init 中的二次渲染

## 依赖

- 字体：JetBrains Mono / Noto Sans SC（geekzu 镜像，异步加载）
- 天气数据：`wttr.in`（公开接口，无需 Key）
- 图标：各网站自带 favicon
