(function () {
    // 防止幽灵图像拖拽：所有图片禁止拖动
    document.querySelectorAll('img').forEach(function (img) {
        img.setAttribute('draggable', 'false');
    });

    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');
    var carousel = document.querySelector('.carousel');
    var indicators = document.querySelectorAll('.indicator');

    // 背景区块内容按设计稿 1920px 基准等比缩放，跟随区块宽度
    var bgSection = document.querySelector('.background-section');
    var bgContent = document.querySelector('.bg-content');
    function scaleBg() {
        if (!bgSection || !bgContent) return;
        var s = bgSection.clientWidth / 1920;
        bgContent.style.transform = 'scale(' + s + ')';
    }
    scaleBg();
    window.addEventListener('resize', scaleBg);

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
