(function () {
    // 防止幽灵图像拖拽：所有图片禁止拖动
    document.querySelectorAll('img').forEach(function (img) {
        img.setAttribute('draggable', 'false');
    });

    // 生成 n 个随机颜色
    function getRandomColors(n) {
        var arr = [];
        for (var i = 0; i < n; i++) {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            arr.push('rgb(' + r + ',' + g + ',' + b + ')');
        }
        return arr;
    }

    // 悬浮框：hover 换 -01 图标；点击 canvas 画随机形状 + 换底色 + 果冻
    document.querySelectorAll('.float-btn').forEach(function (btn) {
        var img = btn.querySelector('img');
        var canvas = btn.querySelector('.float-canvas');
        var ctx = canvas ? canvas.getContext('2d') : null;
        if (!img) return;
        var base = img.getAttribute('src').replace(/\.png$/i, '.png');
        var hoverSrc = base.replace(/\.png$/i, '-01.png');
        var resetTimer = null;

        function clearCanvas() {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        btn.addEventListener('mouseenter', function () {
            img.src = hoverSrc;
            if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
        });
        btn.addEventListener('mouseleave', function () {
            img.src = base;
            // 移开 1 秒后恢复未点击样式
            if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
            resetTimer = setTimeout(function () {
                btn.style.backgroundColor = '';
                clearCanvas();
                resetTimer = null;
            }, 1000);
        });
        btn.addEventListener('click', function () {
            if (!ctx) return;
            // 1. 随机颜色数组
            var colors = getRandomColors(8);
            // 2. 清空画布
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 3. 绘制 100 个随机形状
            for (var i = 0; i < 100; i++) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillStyle = color;
                ctx.globalAlpha = Math.random() * 0.8 + 0.2; // 随机透明度
                var shapeType = Math.floor(Math.random() * 4);
                var cw = canvas.width;
                var ch = canvas.height;
                if (shapeType === 0) {
                    // 圆形
                    var cx = Math.random() * cw;
                    var cy = Math.random() * ch;
                    var radius = Math.random() * 60 + 10;
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shapeType === 1) {
                    // 矩形
                    ctx.fillRect(Math.random() * cw, Math.random() * ch, Math.random() * 100 + 20, Math.random() * 100 + 20);
                } else if (shapeType === 2) {
                    // 三角形
                    ctx.beginPath();
                    ctx.moveTo(Math.random() * cw, Math.random() * ch);
                    ctx.lineTo(Math.random() * cw, Math.random() * ch);
                    ctx.lineTo(Math.random() * cw, Math.random() * ch);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // 多边形
                    var px = Math.random() * cw;
                    var py = Math.random() * ch;
                    var pr = Math.random() * 50 + 20;
                    var sides = Math.floor(Math.random() * 5) + 3;
                    ctx.beginPath();
                    for (var j = 0; j < sides; j++) {
                        var ang = (j / sides) * Math.PI * 2;
                        var sx = px + Math.cos(ang) * pr;
                        var sy = py + Math.sin(ang) * pr;
                        if (j === 0) { ctx.moveTo(sx, sy); } else { ctx.lineTo(sx, sy); }
                    }
                    ctx.closePath();
                    ctx.fill();
                }
            }
            // 4. 重置透明度
            ctx.globalAlpha = 1;
            // 5. 改变方块颜色
            var squareColor = getRandomColors(1);
            btn.style.backgroundColor = squareColor[0];
            // 图标果冻抖动
            img.classList.remove('jelly');
            void img.offsetWidth; // 重置动画
            img.classList.add('jelly');
        });
    });

    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');
    var carousel = document.querySelector('.carousel');
    var indicators = document.querySelectorAll('.indicator');

    // 视频窗口加载配置里的第一个视频地址
    var videoPlayer = document.querySelector('.video-player');
    if (videoPlayer && window.VIDEOS && window.VIDEOS.length && window.VIDEOS[0].src) {
        videoPlayer.src = window.VIDEOS[0].src;
    }

    // 徽标点击：互换选中态（选中=蓝图，未选中=白图）+ 切换面板内容区
    var badgeBoxes = document.querySelectorAll('.badge-box');
    badgeBoxes.forEach(function (box) {
        box.addEventListener('click', function () {
            badgeBoxes.forEach(function (b) { b.classList.remove('selected'); });
            box.classList.add('selected');
            badgeBoxes.forEach(function (b) {
                var img = b.querySelector('.badge');
                if (img) {
                    img.src = b.classList.contains('selected')
                        ? './img/backage-blue.svg'
                        : './img/backage-wrhite.svg';
                }
            });
            // 面板内容区随选中徽标切换
            var secName = box.getAttribute('data-section') || 'resume';
            document.querySelectorAll('.badge-panel .panel-section').forEach(function (s) {
                s.classList.toggle('hidden', !s.classList.contains('section-' + secName));
            });
        });
    });

    // 面板标题点击：互换激活态 + 切换对应视频 + bg-line 位置
    var panelTitles = document.querySelectorAll('.badge-panel .panel-title');
    var bgLine = document.querySelector('.section-resume .bg-line');
    function activatePanel(title) {
        panelTitles.forEach(function (t) {
            t.classList.toggle('active', t === title);
        });
        var idx = title.classList.contains('opt-title') ? 1 : 0;
        if (videoPlayer && window.VIDEOS && window.VIDEOS[idx] && window.VIDEOS[idx].src) {
            videoPlayer.src = window.VIDEOS[idx].src;
        }
        // bg-line 位置跟随选中 + 触发一次移动动画
        if (bgLine) {
            bgLine.classList.toggle('opt', idx === 1);
            bgLine.classList.remove('animate');
            void bgLine.offsetWidth; // 重置动画
            bgLine.classList.add('animate');
        }
    }
    panelTitles.forEach(function (t) {
        t.addEventListener('click', function () {
            activatePanel(t);
        });
    });

    // null 守卫，元素缺失直接退出
    if (!track || !prevBtn || !nextBtn || !track.children.length) return;

    // 克隆第一张到末尾，实现无缝循环：最后一张滑到克隆图，动画结束再隐形切回真实第一张
    track.appendChild(track.children[0].cloneNode(true));

    var total = track.children.length;   // 含克隆
    var realCount = total - 1;           // 真实轮播数
    var pos = 0;                         // 视觉位置 0..total-1
    var timer = null;
    var hovering = false;

    function setTransform() {
        track.style.transform = 'translateX(-' + (pos * 100) + '%)';
    }

    // 无过渡瞬间跳转（用于克隆↔真实第一张的隐形切换）
    function snapTo(p) {
        track.style.transition = 'none';
        void track.offsetWidth; // 强制 reflow
        pos = p;
        setTransform();
        void track.offsetWidth;
        track.style.transition = '';
        syncIndicators();
    }

    // 带动画移动到 p
    function animateTo(p) {
        pos = p;
        setTransform();
        syncIndicators();
    }

    // 滑到克隆图动画真实结束时，隐形切回真实第一张
    // transitionend 对齐过渡完成帧，比 setTimeout 精确，无跳变
    track.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'transform') return;
        if (pos === total - 1) snapTo(0);
    });

    function syncIndicators() {
        var logical = pos >= realCount ? 0 : pos;
        indicators.forEach(function (el) {
            el.classList.toggle('active', parseInt(el.dataset.index, 10) === logical);
        });
    }

    // 下一张：真实最后一张 → 克隆（滑过去）；克隆 → 真实第一张（隐形）
    function goNext() {
        if (pos === total - 1) snapTo(0);
        animateTo(Math.min(pos + 1, total - 1));
    }

    // 上一张：真实第一张 → 克隆（隐形）；然后滑回前一张
    function goPrev() {
        if (pos === 0) snapTo(total - 1);
        animateTo(Math.max(pos - 1, 0));
    }

    // 指示器跳转：克隆位置先隐形回真实第一张
    function goTo(i) {
        if (pos === total - 1) snapTo(0);
        animateTo(i);
    }

    // 自动播放：每 1 秒切下一张；悬停暂停
    function startAuto() {
        stopAuto();
        if (hovering) return;
        timer = setInterval(function () {
            goNext();
        }, 1000);
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    nextBtn.addEventListener('click', function () {
        goNext();
        startAuto();
    });

    prevBtn.addEventListener('click', function () {
        goPrev();
        startAuto();
    });

    indicators.forEach(function (el) {
        el.addEventListener('click', function () {
            goTo(parseInt(el.dataset.index, 10));
            startAuto();
        });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goTo(parseInt(el.dataset.index, 10));
                startAuto();
            }
        });
    });

    // 悬停暂停自动播放
    if (carousel) {
        carousel.addEventListener('mouseenter', function () {
            hovering = true;
            stopAuto();
        });
        carousel.addEventListener('mouseleave', function () {
            hovering = false;
            startAuto();
        });
    }

    // 首屏激活态（pos 初始为 0）
    syncIndicators();

    // 启动自动播放
    startAuto();
})();
