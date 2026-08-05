# 轮播图指示器（3 根透明线）设计文档

日期: 2026-08-05

## 目标

轮播图图片底部内部悬浮 3 根透明横线指示器，点击切换轮播，当前张高亮。与现有左右箭头共享切换状态。

## 需求

- 3 根横线，绝对定位在轮播图底部居中，悬浮在图上
- 半透明底，当前激活项实心高亮（品牌蓝 #0C5BF5）
- 点击指示器切换对应轮播（带过渡动画）
- 箭头、指示器共用同一 index 状态，互不冲突

## 结构

### HTML（index.html，.carousel 内，track 和箭头之后）

```html
        <div class="carousel-indicators">
            <span class="indicator" data-index="0"></span>
            <span class="indicator" data-index="1"></span>
            <span class="indicator" data-index="2"></span>
        </div>
```

### CSS（css/index.css）

- `.carousel-indicators`：绝对定位 bottom 居中，flex，gap
- `.indicator`：24×3px 圆角横线，半透明白底，cursor pointer
- `.indicator.active`：实心 #0C5BF5

### JS（js/index.js）

- 取 `.indicator` 集合，点击 → `show(parseInt(data-index))`
- `show()` 内更新 `.indicator.active`（清除旧的，标新）

## 改动文件

- `index.html`（加指示器结构）
- `css/index.css`（加指示器样式）
- `js/index.js`（指示器点击 + 激活态同步）

## 测试

- 底部居中显示 3 根透明线，第 1 根高亮
- 点第 2/3 根 → 切到对应张，高亮跟随
- 点箭头 → 高亮同步移动
- 指示器不挡箭头、不影响轮播
