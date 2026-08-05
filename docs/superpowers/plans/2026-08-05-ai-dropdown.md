# AI智能 hover 下拉菜单 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 导航栏 "AI智能" 悬停展开下拉菜单（示例1~5），移开收回，纯 CSS。

**Architecture:** AI智能 链接包一层 `.dropdown`，内部加隐藏的 `.dropdown-menu`，CSS `:hover` 控制显隐。无 JS。

**Tech Stack:** 原生 HTML/CSS。

**测试方式:** 浏览器目视验证（无测试框架）。

---

### Task 1: HTML 下拉结构

**Files:**
- Modify: `index.html`（nav-links 内 AI智能 处）

- [ ] **Step 1: AI智能 包 dropdown + 菜单**

当前（`index.html`）：
```html
            <a href="javascript:;" class="nav-ai-intelligence"><img src="./img/top_ai.svg" alt="">AI智能</a>
```

改成：
```html
            <div class="dropdown">
                <a href="javascript:;" class="nav-ai-intelligence"><img src="./img/top_ai.svg" alt="">AI智能</a>
                <ul class="dropdown-menu">
                    <li><a href="javascript:;">示例1</a></li>
                    <li><a href="javascript:;">示例2</a></li>
                    <li><a href="javascript:;">示例3</a></li>
                    <li><a href="javascript:;">示例4</a></li>
                    <li><a href="javascript:;">示例5</a></li>
                </ul>
            </div>
```

---

### Task 2: CSS 下拉样式

**Files:**
- Modify: `css/index.css`（`.nav-links` 之后追加）

- [ ] **Step 1: 追加样式**

```css
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 120px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    padding: 4px 0;
    list-style: none;
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
}

.dropdown-menu li a {
    display: block;
    padding: 8px 16px;
    color: #333;
    white-space: nowrap;
}

.dropdown-menu li a:hover {
    background: #f5f5f5;
    color: #0C5BF5;
}

.dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
```

---

### Task 3: 验证 + 提交

- [ ] **Step 1: 浏览器验证**

打开 `index.html`：
- 悬停 AI智能，菜单向下展开，5 项可见
- 鼠标移到菜单项，项 hover 变蓝
- 移开鼠标（链接或菜单），菜单收回
- 导航布局不变

- [ ] **Step 2: 提交**

```bash
git add index.html css/index.css
git commit -m "AI智能hover下拉菜单"
```

**预期:** 2 个文件入库。
