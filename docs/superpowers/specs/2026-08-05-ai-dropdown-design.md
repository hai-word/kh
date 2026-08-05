# AI智能 hover 下拉菜单 设计文档

日期: 2026-08-05

## 目标

导航栏 "AI智能" 链接鼠标悬停时展开下拉菜单，移开收回。纯 CSS hover 实现，无 JS。

## 需求

- 悬停 "AI智能" 展开下拉，移出收回
- 菜单项 5 个：示例1、示例2、示例3、示例4、示例5
- 不影响现有 `.nav-links` grid 布局

## 结构

### HTML（index.html，nav-links 内）

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

### CSS（css/index.css）

- `.dropdown`：`position: relative`
- `.dropdown-menu`：`position: absolute`，顶部对齐链接下方，默认隐藏，`.dropdown:hover .dropdown-menu` 显示，带 transition
- 菜单项白底、阴影，hover 变色

## 改动文件

- `index.html`（AI智能 包 dropdown + 菜单结构）
- `css/index.css`（下拉样式）

## 测试

- 鼠标悬停 AI智能，菜单展开，5 项可见
- 移开鼠标，菜单收回
- 导航布局不变
