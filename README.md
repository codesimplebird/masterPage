# NavigationProfile（个人浏览器导航页 / CYBER-DECK）

一个赛博朋克风格的个人浏览器起始页 / 导航页项目。所有文件均为**纯静态 HTML + CSS + JS**，无需构建、无需后端，可直接部署到 GitHub Pages。

## 功能特性

- **分类链接看板**：链接按媒体、AI、开发工具、社交、搜索 5 大类分列展示，卡片自动加载网站图标（失败时回退为首字母色块）
- **实时搜索**：按 `/` 或 `Ctrl+K` 快速聚焦搜索框，支持模糊匹配（名称 / URL / 分类名），命中关键词高亮并显示结果数量；历史下拉支持 `↑↓` 选择、`Enter` 搜索、`Esc` 关闭，兼容中文输入法
- **Bing 搜索**：输入内容后按 `Enter` 或点击搜索按钮直接跳转 Bing，搜索记录保存在本地并可从历史下拉菜单查看
- **拖拽排序**：按住卡片左侧手柄（⠿）可调整同类链接顺序，顺序保存在 localStorage，带 FLIP 让位动画与落下回弹
- **侧边栏系统面板**：
  - 实时时钟（时:分:秒 + 日期 + 周进度条，Orbitron 数字字体）
  - 天气（通过 `wttr.in` 获取，带本地缓存与过期占位，后台标签页不请求）
  - 电池电量（Battery API，不支持时优雅降级显示 N/A，充电时显示 ⚡）
  - 备忘录（本地持久化，Enter 添加、✕ 删除）
- **深色 / 浅色主题**切换，主题偏好持久化，并内置防闪屏脚本（FOUC）
- **视觉特效**：霓虹光标（rAF 节流）、点击波纹、背景网格与顶部光晕、SVG 噪点纹理、卡片错峰进场、卡片悬停光晕、自定义滚动条与文本选择配色
- **无障碍与细节**：键盘可见焦点环、`prefers-reduced-motion` 降级、图标 alt 文本、无 JS 时提示
- **移动端适配**：窄屏下侧栏变为抽屉式，汉堡按钮 + 遮罩打开/关闭

## 目录结构

```text
NavigationProfile/
├── index.html             # GitHub Pages 默认入口，主版本 V14.3
├── index_v3.html          # V16，主数据从 links.yaml 加载
├── links.yaml             # v3 的链接数据源，与 index 配置保持同步
├── js-yaml.min.js         # v3 使用的 YAML 解析库
├── archive/               # 历史版本，不再维护
│   ├── index-v2.html
│   ├── master0.html
│   ├── M-google.html
│   ├── M-googleV11.html
│   └── M_dp.html
└── README.md
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主版本 **CYBER-DECK V14.3**，GitHub Pages 默认首页 |
| `index_v3.html` | **CYBER-DECK V16**，运行时加载 `links.yaml`，失败时使用内置配置 |
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

v3 的链接编辑 `links.yaml`；修改数据时同时同步 `index.html` 中的 `config`，保证两个入口显示一致：

```yaml
- name: 站点名
  url: https://example.com
  cat: dev
  icon: https://example.com/favicon.ico
```

YAML 中的 `cat` 必须对应 `categories` 的 `id`。v3 加载 YAML 后会保留现有的英文分类显示名称。

## 技术要点

- **纯原生 JS**（无框架），DOM API 构建节点，避免 innerHTML 注入问题
- 主题、备忘录、排序、搜索历史均持久化到 `localStorage`
- 网络请求（天气、图标）带超时与失败降级；链接 hostname 解析失败时安全回退，单条坏链接不影响整页渲染
- 拖拽排序仅限同类分类内，通过 data-key（分类+名称+URL）做稳定标识
- v3 启动时优先渲染内置配置，再异步加载 `links.yaml` 并刷新链接看板

## 依赖

- 字体：JetBrains Mono / Noto Sans SC（geekzu 镜像，异步加载）
- 天气数据：`wttr.in`（公开接口，无需 Key）
- 图标：各网站自带 favicon
