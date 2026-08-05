# 轮播图指示器 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 轮播图底部悬浮 3 根透明线指示器，点击切换，当前项高亮，与箭头共用状态。

**Architecture:** `.carousel` 内加 `.carousel-indicators`，绝对定位底部居中。JS 的 `show()` 函数统一负责切图 + 同步 `.indicator.active`。

**Tech Stack:** 原生 HTML/CSS/JS。

**测试方式:** 浏览器目视验证（无测试框架）。

---

### Task 1: HTML 指示器结构

**Files:**
- Modify: `index.html`（.carousel 内，track 之后）

- [ ] **Step 1: 加指示器**

当前 `.carousel` 内结构（index.html）：`.carousel-track`（3 img）+ 两个 `.carousel-arrow` 按钮，其后是 `</div>` 关掉 `.carousel`。

在 `</div>`（.carousel 闭合）前、箭头按钮之后加：

```html
        <div class="carousel-indicators">
            <span class="indicator" data-index="0"></span>
            <span class="indicator" data-index="1"></span>
            <span class="indicator" data-index="2"></span>
        </div>
```

保持缩进与周围一致。

---

### Task 2: CSS 指示器样式

**Files:**
- Modify: `css/index.css`（.carousel 相关样式附近追加）

- [ ] **Step 1: 追加样式**

```css
.carousel-indicators {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 1;
}

.indicator {
    width: 24px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.2s;
}

.indicator.active {
    background: #0C5BF5;
}
```

---

### Task 3: JS 指示器交互

**Files:**
- Modify: `js/index.js`

- [ ] **Step 1: 指示器点击 + 激活同步**

当前 `js/index.js`（节选）：
```js
    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');

    // null 守卫，元素缺失直接退出
    if (!track || !prevBtn || !nextBtn || !track.children.length) return;

    var count = track.children.length;
    var index = 0;

    function show(i) {
        var next = ((i % count) + count) % count;
        // 首尾 wrap 时禁用 transition 瞬间跳转，避免整排反向扫过
        var isWrap = (index === count - 1 && next === 0) || (index === 0 && next === count - 1);
        if (isWrap) {
            track.style.transition = 'none';
            void track.offsetWidth; // 强制 reflow
            track.style.transform = 'translateX(-' + (next * 100) + '%)';
            void track.offsetWidth;
            track.style.transition = '';
        } else {
            track.style.transform = 'translateX(-' + (next * 100) + '%)';
        }
        index = next;
    }

    nextBtn.addEventListener('click', function () {
        show(index + 1);
    });

    prevBtn.addEventListener('click', function () {
        show(index - 1);
    });
```

改成（新增指示器部分，其余保留）：

```js
    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');
    var indicators = document.querySelectorAll('.indicator');

    // null 守卫，元素缺失直接退出
    if (!track || !prevBtn || !nextBtn || !track.children.length) return;

    var count = track.children.length;
    var index = 0;

    function show(i) {
        var next = ((i % count) + count) % count;
        // 首尾 wrap 时禁用 transition 瞬间跳转，避免整排反向扫过
        var isWrap = (index === count - 1 && next === 0) || (index === 0 && next === count - 1);
        if (isWrap) {
            track.style.transition = 'none';
            void track.offsetWidth; // 强制 reflow
            track.style.transform = 'translateX(-' + (next * 100) + '%)';
            void track.offsetWidth;
            track.style.transition = '';
        } else {
            track.style.transform = 'translateX(-' + (next * 100) + '%)';
        }
        index = next;
        // 同步指示器激活态
        indicators.forEach(function (el) {
            el.classList.toggle('active', parseInt(el.dataset.index, 10) === index);
        });
    }

    nextBtn.addEventListener('click', function () {
        show(index + 1);
    });

    prevBtn.addEventListener('click', function () {
        show(index - 1);
    });

    indicators.forEach(function (el) {
        el.addEventListener('click', function () {
            show(parseInt(el.dataset.index, 10));
        });
    });
```

---

### Task 4: 验证 + 提交

- [ ] **Step 1: 浏览器验证**

打开 `index.html`：
- 图片底部居中 3 根透明线，第 1 根蓝色高亮
- 点第 2/3 根 → 切到对应张，高亮跟随
- 点箭头 → 高亮同步移动
- 指示器不挡箭头、hover 有响应

- [ ] **Step 2: 提交**

```bash
git add index.html css/index.css js/index.js
git commit -m "轮播图底部指示器"
```

**预期:** 3 个文件入库。
