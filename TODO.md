# 待办与已知限制

记录尚未完成或需要人工验证的事项，供后续迭代参考。

## 需要人工验证（当前环境无法启动真实浏览器）

- [ ] GitHub Pages 上线后冒烟：`https://codesimplebird.github.io/masterPage/`
- [ ] 中文输入法（IME）实际输入时按 Enter 选词，确认不会误触 Bing 搜索
- [ ] 搜索历史键盘操作：`↑↓` 选择、`Enter` 搜索、`Esc` 关闭、`Tab` 移入历史下拉（现已改为 `focusout` 监听，需实测 Tab 移出时的关闭时机）
- [ ] 拖拽排序手感：手柄拖拽、FLIP 让位动画、落下回弹、松手后顺序持久化
- [ ] 浅色主题下检查滚动条、::selection、光晕层对比度
- [ ] 断网 / `file://` 打开时：index 内联数据可用，v3 回退到 fallbackConfig
- [ ] 移动端冒烟：抽屉菜单、焦点管理、触屏滚动（低优先级）
- [ ] 屏幕阅读器实测：搜索框 combobox 语义、结果数播报（`#search-status`）、历史 option 焦点管理

## 可选项（默认关闭，已注释在代码中）

- CRT 扫描线效果：`.scanlines` 样式已写入 CSS（注释状态），启用时取消注释并保持低透明度
- 结果计数在搜索框上方的提示行显示，若觉干扰可回退为仅高亮

## 后续可考虑（未开始）

- 移动端拖拽排序替代方案（编辑模式 / 上移下移按钮）
- 分类数据更多可视化（分类图标 hover 动效微调）
- 链接数量更多时考虑分页或折叠分类

## 最新一次重构要点（Stage A–E）

- P0 修复：搜索历史改 `focusout`、天气 TTL + 在途请求锁、拖拽顺序键去 URL 段
- 无障碍：收窄 live 区域、补 combobox 语义、option 改用 `div[role=option]`
- 双入口以 index_v3.html 为基准机械生成 index.html，差异收敛到数据加载路径
- 命名：版本统一为 V14.3、memo 面板 DOM id 改为 `memo-in`/`memo-list`、`$` 改名 `byId`
- 仓库卫生：新增 `.gitignore` / `.gitattributes`（统一 LF），`.idea/` 移出版本控制

## 维护规则提醒

- 双文件同步：`index.html` 与 `index_v3.html` 的功能/样式/交互必须一致，仅数据加载不同
- 数据同步：`index.html` `config`、v3 `fallbackConfig`、`links.yaml` 三处保持一致
- 提交信息用 `git commit -F <utf8 文件>`：控制台直接传中文会触发 GBK 代码页损坏
- 提交但不推送，推送由用户明确确认
