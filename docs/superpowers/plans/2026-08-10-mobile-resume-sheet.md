# 移动端创建/导入简历底弹层 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 点击移动端"一键创建/导入简历"白盒弹出 SweetAlert2 底部操作层（创建/导入二选一），创建出 toast，导入弹文件框，并把白盒视觉改成原版 345×70dp 规格、图标换成 file.svg。

**Architecture:** 纯前端静态页。index.html 引 SweetAlert2 v11 CDN + 隐藏文件输入；mobile.css 加白盒规格与弹层 customClass 样式；mobile.js 加 `initResumeSheet()` 模块（与现有 `initBottomBar` 同挂载模式）。项目无测试框架，验证用无头 Chrome 实测行为。

**Tech Stack:** 原生 HTML/CSS/JS，SweetAlert2 v11（CDN），无构建。

参考 spec: `docs/superpowers/specs/2026-08-10-mobile-resume-sheet-design.md`

---

## 文件结构

- Modify: `index.html` — head 加 SweetAlert2 CDN（CSS+JS），`wb-icon` src 换 file.svg，`.mobile-only` 内末尾加隐藏 `#mResumeFile`
- Modify: `mobile/css/mobile.css` — 白盒视觉规格（高 8.62vh、纯白、去背景图），弹层 `customClass` 样式（`.m-sheet-pop` / `.m-sheet-item`）
- Modify: `mobile/js/mobile.js` — 加 `initResumeSheet()` + `showToast()` 逻辑
- Verify: 临时无头 Chrome 测量脚本（用后删除）

---

### Task 1: index.html — SweetAlert2 CDN + 文件输入 + 换图标

**Files:**
- Modify: `index.html`

- [ ] **Step 1: head 加 SweetAlert2 CDN**

在 `index.html` 的 `<head>` 里，现有 `mobile.css` link 之后、defer 脚本之前插入:

```html
    <link rel="stylesheet" href="./mobile/css/mobile.css">
    <!-- SweetAlert2：移动端底弹层 + toast -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <script src="./js/videos.js" defer></script>
```

- [ ] **Step 2: wb-icon 图标换 file.svg**

`index.html` 白盒行（约 242 行）改 src:

```html
<img class="wb-icon" src="./img/mobile/file.svg" alt="">
```

- [ ] **Step 3: `.mobile-only` 末尾加隐藏文件输入**

`index.html` 里 `.mobile-only` 闭合 `</div>` 前（最后一个 `.mobile-page` 之后）加:

```html
        <!-- 导入简历：隐藏文件选择 -->
        <input type="file" id="mResumeFile" accept=".pdf,.doc,.docx" hidden>
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(mobile): 引入 SweetAlert2 + 换白盒图标 + 隐藏文件输入"
```

---

### Task 2: mobile.css — 白盒视觉规格 + 弹层样式

**Files:**
- Modify: `mobile/css/mobile.css`

- [ ] **Step 1: 白盒改 345×70dp 规格**

现有 `.mobile-white-box` 块（约 168-183 行）中:
- `height: 9.58vh` → `height: 8.62vh`（70dp）
- 删除 `background-image`、`background-repeat`、`background-position` 三行（XML spec 纯白底，无背景图）
- 其余保留（width 92vw=345dp、radius 1.07vw=4dp、box-shadow 0 0 0.8vw rgba(0,0,0,0.08) 已符合）

改后应为:

```css
.mobile-main .mobile-white-box {
  width: 92vw;
  height: 8.62vh; /* 70dp */
  background-color: #ffffffff;
  border-radius: 1.07vw; /* 4dp */
  /* 距离顶部9dp */
  margin-top: 2.4vw;
  box-shadow: 0 0 0.8vw rgba(0, 0, 0, 0.08);
  display: flex; /* 图标+文字水平居中 */
  align-items: center;
  justify-content: center;
  gap: 1.07vw; /* 4dp */
}
```

- [ ] **Step 2: 弹层 customClass 样式**

`mobile.css` 文件末尾追加（全 vw/vh，375×812 基准）:

```css
/* SweetAlert2 底弹层：底部面板 */
.m-sheet-pop {
  width: 100vw !important;
  margin: 0 !important;
  border-radius: 3.2vw 3.2vw 0 0 !important; /* 12dp 顶圆角 */
  padding: 2.67vw 0 3.2vw !important; /* 10dp 上，12dp 下 */
}
.m-sheet-pop .swal2-title {
  margin: 0 0 1.33vw; /* 下 5dp */
  font-size: 4.27vw; /* 16dp */
  color: #333333;
}
.m-sheet-pop .swal2-html-container {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.m-sheet-item {
  display: block;
  width: 92vw; /* 345dp */
  height: 5.91vh; /* 48dp */
  margin: 0 auto;
  border: 0;
  border-top: 0.13vw solid #eeeeee; /* 0.5dp 分隔线 */
  background: transparent;
  font-size: 4.27vw; /* 16dp */
  color: #1662f5;
  line-height: 5.91vh;
  text-align: center;
  cursor: pointer;
}
```

- [ ] **Step 3: Commit**

```bash
git add mobile/css/mobile.css
git commit -m "style(mobile): 白盒 345x70dp 规格 + 底弹层样式"
```

---

### Task 3: mobile.js — initResumeSheet 模块

**Files:**
- Modify: `mobile/js/mobile.js`

- [ ] **Step 1: 文件末尾（touchmove 兜底后）追加模块**

`mobile.js` 现有结尾 `})();` 之前追加:

```js
    // 一键创建/导入简历：SweetAlert2 底部弹层 + toast
    function initResumeSheet() {
        var box = document.querySelector('.mobile-white-box');
        var fileInput = document.getElementById('mResumeFile');
        if (!box || !fileInput) return;

        var toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500
        });

        box.addEventListener('click', function () {
            Swal.fire({
                position: 'bottom',
                title: '选择操作',
                html: '<button type="button" class="m-sheet-item" id="mActCreate">创建简历</button>' +
                      '<button type="button" class="m-sheet-item" id="mActImport">导入简历</button>',
                showCloseButton: true,
                showConfirmButton: false,
                customClass: { popup: 'm-sheet-pop', htmlContainer: 'm-sheet-html' },
                didOpen: function () {
                    var createBtn = document.getElementById('mActCreate');
                    var importBtn = document.getElementById('mActImport');
                    if (createBtn) {
                        createBtn.addEventListener('click', function () {
                            Swal.close();
                            toast.fire({ icon: 'info', title: '功能开发中' });
                        });
                    }
                    if (importBtn) {
                        importBtn.addEventListener('click', function () {
                            Swal.close();
                            fileInput.value = '';
                            fileInput.click();
                        });
                    }
                }
            });
        });

        fileInput.addEventListener('change', function () {
            var name = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '文件';
            toast.fire({ icon: 'success', title: '已收到简历：' + name });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResumeSheet);
    } else {
        initResumeSheet();
    }
```

- [ ] **Step 2: 语法检查**

Run: `node --check mobile/js/mobile.js`
Expected: 无输出，exit 0

- [ ] **Step 3: Commit**

```bash
git add mobile/js/mobile.js
git commit -m "feat(mobile): 白盒点击弹创建/导入底弹层 + toast"
```

---

### Task 4: 无头 Chrome 实测验证

**Files:**
- Create: `tmp_verify.html`（临时，验证后删除）

- [ ] **Step 1: 写验证脚本**

创建 `tmp_verify.html`:

```html
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body>
<iframe id="f" src="index.html" style="width:375px;height:812px;border:0"></iframe>
<script>
var f = document.getElementById('f');
function run(){
  try {
    var d = f.contentDocument, w = f.contentWindow;
    var out = [];
    var wait = ms => new Promise(r => setTimeout(r, ms));
    async function test(){
      var box = d.querySelector('.mobile-white-box');
      if (!box) { out.push('FAIL: no white-box'); return; }
      // 1. 白盒视觉规格
      var r = box.getBoundingClientRect();
      out.push('box h='+Math.round(r.height)+'px (期望70) w='+Math.round(r.width)+'px (期望345) radius='+getComputedStyle(box).borderRadius);
      // 2. 图标已换
      out.push('icon='+d.querySelector('.wb-icon').getAttribute('src'));
      // 3. 点击白盒 → 弹层
      box.click();
      await wait(400);
      var popup = d.querySelector('.swal2-popup');
      out.push('sheet open='+!!popup+' pos='+(popup?popup.className.includes('swal2-bottom'):'-'));
      // 4. 点"创建简历" → 弹层关 + toast
      var createBtn = d.getElementById('mActCreate');
      if (createBtn) { createBtn.click(); await wait(400); }
      out.push('create: sheetClosed='+!d.querySelector('.swal2-popup')+' toast='+!!d.querySelector('.swal2-toast')+' text='+(d.querySelector('.swal2-toast')?d.querySelector('.swal2-toast').textContent:'-'));
      await wait(1600);
      // 5. 再开弹层 → 点"导入简历" → 触发文件框
      box.click(); await wait(400);
      var importBtn = d.getElementById('mActImport');
      var fileInput = d.getElementById('mResumeFile');
      if (importBtn) importBtn.click();
      await wait(200);
      out.push('import: sheetClosed='+!d.querySelector('.swal2-popup'));
      // 6. 模拟选文件 → toast
      var dt = new w.DataTransfer();
      dt.items.add(new w.File(['x'], '简历.pdf', {type:'application/pdf'}));
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new w.Event('change'));
      await wait(400);
      out.push('import toast='+!!d.querySelector('.swal2-toast')+' text='+(d.querySelector('.swal2-toast')?d.querySelector('.swal2-toast').textContent:'-'));
      var pre = d.createElement('pre'); pre.textContent = out.join('\n');
      f.contentDocument.body.appendChild(pre);
      var copy = pre.cloneNode(true); document.body.appendChild(copy);
    }
    test();
  } catch(e){ document.body.textContent = 'ERR '+e.message; }
}
f.onload = function(){ setTimeout(run, 1500); };
</script>
</body></html>
```

- [ ] **Step 2: 跑验证**

Run（移动 UA）:
```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files \
  --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" \
  --window-size=375,812 --virtual-time-budget=12000 \
  --dump-dom "file:///D:/workProject/kh/tmp_verify.html" 2>/dev/null | sed -n '/<pre>/,/<\/pre>/p' | tail -20
```
Expected:
- `box h=70 w=345 radius=4px`
- `icon=./img/mobile/file.svg`
- `sheet open=true pos=bottom`
- `create: sheetClosed=true toast=true ...功能开发中`
- `import: sheetClosed=true`
- `import toast=true ...已收到简历：简历.pdf`

（若 `sheet open=true` 但 CDN 未加载，检查网络/改用本地缓存；`virtual-time-budget` 需足够 Swal 加载。）

- [ ] **Step 3: 删除临时文件**

```bash
rm -f tmp_verify.html
```

- [ ] **Step 4: Commit 收尾**

```bash
git add -A
git commit -m "test(mobile): 无头验证底弹层与白盒规格通过" || true
```

---

## 自检清单

- [ ] Spec 全覆盖: SweetAlert2 引入、底弹层创建/导入行为、toast、白盒 345×70dp、图标 file.svg
- [ ] 无占位符: 全部步骤含具体代码
- [ ] 命名一致: `initResumeSheet` / `toast` / `mResumeFile` / `m-sheet-pop` / `m-sheet-item` 全程统一
