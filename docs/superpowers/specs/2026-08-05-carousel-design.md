# 导航栏下方轮播图 设计文档

日期: 2026-08-05

## 目标

在导航栏（`.site-nav`）下方实现全宽轮播图，展示 `img/banners/` 下的 3 张图片。

## 需求

- 交互：左右箭头手动切换
- 切换：循环播放（最后一张点右键回到第一张）
- 无自动播放、无圆点指示器（用户已确认不要）

## 结构

### HTML（index.html，nav 之后）

```
<div class="carousel">
    <div class="carousel-track">
        <img src="./img/banners/banner_1.png">
        <img src="./img/banners/banner_2.png">
        <img src="./img/banners/banner_3.png">
    </div>
    <button class="carousel-arrow prev">‹</button>
    <button class="carousel-arrow next">›</button>
</div>
```

### CSS（css/index.css）

- `.carousel`：全宽、固定高 400px、`overflow: hidden`、`position: relative`
- `.carousel-track`：`display: flex`、`transition: transform 0.4s`
- `.carousel img`：`width: 100%`、`height: 400px`、`flex-shrink: 0`、`object-fit: cover`（防变形）
- `.carousel-arrow`：绝对定位左右两侧、垂直居中

### JS（js/index.js，新建）

- 点击 `.next`：index + 1 取模循环
- 点击 `.prev`：index - 1 取模循环
- 更新 track 的 `transform: translateX(-index * 100%)`

### 引用

- HTML `<head>` 引入 `js/index.js`

## 改动文件

- `index.html`（加轮播结构 + 引 JS）
- `css/index.css`（加轮播样式）
- `js/index.js`（新建，切换逻辑）

## 测试

- 浏览器打开，箭头可切换
- 最后一张点右键回第一张，第一张点左键回最后一张
- 图片不变形、无横向滚动条
