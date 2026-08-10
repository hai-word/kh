# 移动端"一键创建/导入简历"底弹层 — 设计

日期: 2026-08-10
状态: 已批准

## 目标

移动端首页（page-ai）白色盒子"一键创建/导入简历"目前无交互。点击后弹出底部操作层，提供"创建简历 / 导入简历"两个入口。项目为静态演示页，无后端，功能为 UI 反馈级别。

## 交互流程

1. 点击 `.mobile-white-box` → 显示底弹层（遮罩 + 滑入动画）
2. 弹层内容:
   - 标题"选择操作"
   - 按钮: 创建简历 / 导入简历 / 取消
3. **创建简历** → 关闭弹层 → toast"功能开发中"
4. **导入简历** → 关闭弹层 → 触发隐藏文件框（accept `.pdf,.doc,.docx`）→ 选完 toast"已收到简历：<文件名>"
5. **取消 / 点遮罩** → 关闭弹层

## 结构

### HTML（index.html，`.mobile-only` 内末尾，最后一个 `.mobile-page` 之后）

- `.m-sheet-mask#mSheetMask`: `position:fixed` 全屏半透明遮罩，含弹层内容（fixed 定位逃出 `.mobile-only` 滚动容器，铺满视口）
  - `.m-sheet`: 底部面板，标题 + 两个操作按钮 + 取消按钮
- `#mResumeFile`: 隐藏 `<input type="file" accept=".pdf,.doc,.docx" hidden>`，放 `.mobile-only` 内即可

### CSS（mobile.css）

- 遮罩 `position:fixed; inset:0; background:rgba(0,0,0,.45)`，默认 `opacity:0; visibility:hidden`，`.show` 时过渡显示
- 弹层底部对齐，`transform:translateY(100%)` → `.show` 时 `translateY(0)`，过渡滑入
- 全部 vw/vh 单位（375×812 基准: 1dp=0.2667vw=0.1232vh）
- 操作按钮: 高 11.99vh（48dp）行高，文字居中；取消按钮独立分隔
- toast `.m-toast`: 固定居中，黑色半透明圆角，1.5s 淡出

### JS（mobile.js）

- 模块化两个独立函数:
  - `initResumeSheet()`: 绑定白盒点击开层、遮罩/取消关层、两操作按钮动作、文件 change
  - `showToast(msg)`: 创建/复用 toast 元素，显示 1.5s 后淡出
- 挂载方式与现有 `initBottomBar` 一致: `readyState==='loading'` 时等 DOMContentLoaded，否则直接调用

## 数据流

纯本地 DOM 交互，零网络请求，文件不解析仅提示文件名。

## 错误处理

- 文件框取消选文件（无 change）→ 无操作
- toast 重复触发 → 清除旧定时器重建，防堆积
- DOM 缺失（白盒不在）→ `if (!box) return` 守卫

## 测试

1. 点白盒 → 弹层滑入
2. 点"创建简历" → 弹层关 + toast"功能开发中"
3. 点"导入简历" → 弹层关 + 文件框弹出；选文件 → toast 带文件名
4. 点遮罩 / 取消 → 弹层关
5. 重复操作 → toast 正常重置
