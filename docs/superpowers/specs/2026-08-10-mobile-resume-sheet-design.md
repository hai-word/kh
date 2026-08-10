# 移动端"一键创建/导入简历"底弹层 — 设计

日期: 2026-08-10
状态: 已批准（修订: 引入 SweetAlert2 包实现）

## 目标

移动端首页（page-ai）白色盒子"一键创建/导入简历"目前无交互。点击后弹出底部操作层，提供"创建简历 / 导入简历"两个入口。项目为静态演示页，无后端，功能为 UI 反馈级别。

## 白盒视觉规格（Android 原版 spec 转 vw/vh）

`#mResumeFile` 所在的白盒 `.mobile-white-box`（点击入口）改成原版规格:
- 尺寸 345×70dp → `width:92vw; height:8.62vh`（现高 9.58vh 过大，改 8.62vh）
- 白底 `#ffffffff`
- 圆角 4dp → `border-radius:1.07vw`
- 阴影 `#14000000`（8% 黑）dx=0 dy=0 → `box-shadow: 0 0 0.8vw rgba(0,0,0,0.08)`
- 图标 `wb-icon` src 从 `./img/mobile/xinjian-fanbai.svg` **换成 `./img/mobile/file.svg`**（文件已存在）

## 依赖

引入 **SweetAlert2 v11**（CDN，单 JS + 单 CSS，零依赖，无需构建）:
- 底弹层: `Swal.fire({ position:'bottom' })` + customClass 定制成底部面板
- toast: `Swal.mixin({ toast:true })`，自带淡入淡出与自动关闭

项目已引外链资源（videos.js 走 CDN），CDN 方式一致。

## 交互流程

1. 点击 `.mobile-white-box` → SweetAlert2 底部弹层滑入
2. 弹层内容:
   - 标题"选择操作"，右上关闭叉
   - html 区两个按钮: 创建简历 / 导入简历
3. **创建简历** → 关闭弹层 → toast"功能开发中"
4. **导入简历** → 关闭弹层 → 触发隐藏文件框（accept `.pdf,.doc,.docx`）→ 选完 toast"已收到简历：<文件名>"
5. **取消(叉) / 点遮罩** → SweetAlert2 自带关闭

## 结构

### HTML（index.html）

- `<head>` 加 SweetAlert2 CDN:
  - `<link rel="stylesheet" href=".../sweetalert2/dist/sweetalert2.min.css">`
  - `<script src=".../sweetalert2@11/dist/sweetalert2.all.min.js">`（在 defer 脚本之前）
- `.mobile-only` 内末尾加隐藏文件框:
  - `#mResumeFile`: `<input type="file" accept=".pdf,.doc,.docx" hidden>`

### CSS（mobile.css）

仅 `customClass` 覆盖样式:
- `.m-sheet-pop`: 全宽（vw），圆角顶，底部滑入（Swal `showClass` 配 transform）
- `.m-sheet-item`: 48dp 高行高，文字居中，分隔线
- 全部 vw/vh 单位（375×812 基准: 1dp=0.2667vw=0.1232vh）

### JS（mobile.js）

- `initResumeSheet()`:
  - 点白盒 → `Swal.fire` 底部弹层，`didOpen` 绑定两按钮
  - 创建 → `Swal.close()` + toast"功能开发中"
  - 导入 → `Swal.close()` + `fileInput.click()`；`change` 后 toast"已收到简历："+文件名
- toast: `const toast = Swal.mixin({toast:true, position:'top', showConfirmButton:false, timer:1500})`
- 挂载方式与现有 `initBottomBar` 一致: `readyState==='loading'` 等 DOMContentLoaded

## 数据流

纯本地 DOM 交互，零网络请求，文件不解析仅提示文件名。

## 错误处理

- Swal 按钮重复点击 → 用 `didOpen` 绑定时做一次性绑定，避免重复弹层
- 文件框取消（无 change）→ 无操作
- DOM 缺失（白盒不在）→ `if (!box) return` 守卫

## 测试

1. 点白盒 → 底部弹层滑入
2. 点"创建简历" → 弹层关 + toast"功能开发中"
3. 点"导入简历" → 弹层关 + 文件框弹出；选文件 → toast 带文件名
4. 点叉 / 遮罩 → 弹层关
5. 重复操作 → 无重复弹层、toast 正常
