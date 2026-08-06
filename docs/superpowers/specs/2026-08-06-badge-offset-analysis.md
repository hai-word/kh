# 徽标切换蓝色时内容向上偏移 5px — 根因分析

日期: 2026-08-06

## 现象

背景图区块的 3 个功能徽标（AI简历服务 / AI面试题预测 / AI职场伴侣）用蓝色表示选中。点击切换选中、背景图变蓝时，徽标内容会**向上偏移约 5px**，且各徽标参差不齐。

## 根因

**svg 背景图的原生尺寸与显示它的盒子高度不一致时，浏览器按 `preserveAspectRatio` 等比缩放并居中 → 顶部留白。**

两张背景图原生尺寸不同：

| 图 | 原生尺寸 |
|---|---|
| `backage-blue.svg` | 400 × **90** |
| `backage-wrhite.svg` | 400 × **80** |

当 80 高的白图放进 90 高的盒子：等比缩放后**居中** → 内容顶部留 5px、底部留 5px。
当 90 高的蓝图放进 90 高的盒子：原生填满、内容从顶部 y=0 开始。

切换选中换蓝图那一刻，内容从"居中偏下 5px"变"顶对齐 y=0" → 视觉上**整体上移 5px**。

## 两个版本同样踩坑

### 版本一：盒子不等高（蓝盒 90 / 白盒 80）

```css
.bg-badges { align-items: flex-start; }   /* 顶对齐 */

.blue-badge-box { height: 90px; }
.blue-badge-box .blue-badge { width: 100%; height: 100%; }

.white-badge-box { height: 80px; }
.white-badge-box.selected { height: 90px; }   /* 选中时盒子 80→90 */
.white-badge-box .white-badge { width: 100%; height: 100%; }
```

切换后各徽标内容顶位置被拉扯乱：

| 徽标 | 切换后盒子 | 切换后图片 | 结果 |
|---|---|---|---|
| 被点白徽标 | 80→90 | 蓝图（原生90） | 90盒90图，内容顶齐 y=0 |
| 原蓝徽标 | 90（不变） | 白图（原生80） | 90盒80图 → 居中 → **内容下移 5px** |
| 另一个白徽标 | 80（不变） | 白图（原生80） | 80盒80图，内容顶齐 |

`height:100%` 让图填盒子，但 svg 原生尺寸与盒子不一致 → 居中留白 → 被选徽标相对其他**上移 5px**。

### 版本二：盒子等高（统一 90）

```css
.badge-resume { height: 90px; }
.badge-resume .badge { height: 90px; }
.badge-interview, .badge-career { height: 90px; }
.badge-interview .badge, .badge-career .badge {
    height: 90px;
    /* object-fit 被注释掉时同样出问题 */
}
```

白图（80）在 90 盒子里：未处理时**居中留白顶部 5px** → 未选中时露上边；切换蓝图（90）填满 → 上移。

## 修复

不改图文件的情况下，让白图保持原大小、**顶部对齐**：

```css
.badge-interview .badge, .badge-career .badge {
    height: 90px;
    object-fit: none;      /* 白图保持原大小80，蓝图90原生刚好填满 */
    object-position: top;  /* 顶部对齐，不露上边 */
}
```

- 白图（80）：顶部对齐贴边框，底部 10px 留空（透明）
- 蓝图（90）：原生填满
- 切换时两者都顶对齐 → 不再偏移

## 原则

**svg 背景图的原生尺寸必须与盒子尺寸匹配（或显式 `object-fit: none + object-position: top`），否则切换换图时内容会上下跳。**

要彻底根治（无底部留空），需让白 svg 也变成 400×90（改图文件）。
