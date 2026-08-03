# NavigationProfile（个人浏览器导航页 / CYBER-DECK）

一个赛博朋克风格的个人浏览器起始页 / 导航页项目。所有文件均为**纯静态 HTML + CSS + JS**，无需构建、无需后端，双击即可在浏览器中打开使用。

## 功能特性

- **分类链接看板**：链接按媒体、AI、开发工具、社交、搜索 5 大类分列展示，卡片自动加载网站图标（失败时回退为首字母色块）
- **实时搜索**：按 `/` 快速聚焦搜索框，支持模糊匹配（名称 / URL / 分类名），命中关键词高亮，`↑↓` 键盘导航、`Enter` 打开、`Esc` 清空
- **拖拽排序**：按住卡片左侧手柄（⠿）可调整同类链接顺序，顺序保存在 localStorage，带 FLIP 让位动画与落下回弹
- **侧边栏系统面板**：
  - 实时时钟（时:分:秒 + 日期 + 周进度条）
  - 天气（通过 `wttr.in` 获取，带 1 小时本地缓存，后台标签页不请求）
  - 电池电量（Battery API，不支持时优雅降级显示 N/A）
  - 备忘录（本地持久化，Enter 添加、✕ 删除）
- **深色 / 浅色主题**切换，主题偏好持久化，并内置防闪屏脚本（FOUC）
- **视觉特效**：霓虹光标（rAF 节流）、点击波纹、背景网格、卡片悬停光晕、分类图标浮动动画
- **无障碍与细节**：键盘可见焦点环、`prefers-reduced-motion` 降级、图标 alt 文本、无 JS 时提示
- **移动端适配**：窄屏下侧栏变为抽屉式，汉堡按钮 + 遮罩打开/关闭

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主版本 **CYBER-DECK V14.3**（功能最完整，推荐使用） |
| `index-v2.html` | **CYBER-DECK V15**（早期版本，引用 js-yaml） |
| `index-v3.html` | **CYBER-DECK V16**（早期版本） |
| `master0.html` | CYBER-DECK V14（更早期版本） |
| `M-google.html` | 「我的桌面指挥官 V3」旧版（Google 风格） |
| `M-googleV11.html` | CYBER-DECK 战术指挥站 V14 旧版 |
| `M_dp.html` | 「我的桌面指挥官 V4」（修复版） |
| `links.yaml` | 链接数据（与 `index.html` 中内置的 `config` 内容对应） |
| `js-yaml.min.js` | js-yaml 解析库（YAML 解析用，当前主版本未依赖） |

## 使用方式

1. 直接用浏览器打开 `index.html`
2. 在浏览器设置中将此页面设为启动页 / 新标签页

## 自定义链接

编辑 `index.html` 内 `<script>` 中的 `config` 对象：

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

## 技术要点

- **纯原生 JS**（无框架），DOM API 构建节点，避免 innerHTML 注入问题
- 主题、备忘录、排序均持久化到 `localStorage`
- 网络请求（天气、图标）带超时与失败降级；链接 hostname 解析失败时安全回退，单条坏链接不影响整页渲染
- 拖拽排序仅限同类分类内，通过 data-key（分类+名称+URL）做稳定标识

## 依赖

- 字体：JetBrains Mono / Noto Sans SC（geekzu 镜像，异步加载）
- 天气数据：`wttr.in`（公开接口，无需 Key）
- 图标：各网站自带 favicon
