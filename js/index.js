(function () {
    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');
    var indicators = document.querySelectorAll('.indicator');

    // null 守卫，元素缺失直接退出
    if (!track || !prevBtn || !nextBtn || !track.children.length) return;

    var count = track.children.length;
    var index = 0;
    var carousel = document.querySelector('.carousel');
    var timer = null;
    var hovering = false;

    // 自动播放：每 1 秒切下一张；悬停暂停
    function startAuto() {
        stopAuto();
        if (hovering) return;
        timer = setInterval(function () {
            show(index + 1, true);
        }, 1000);
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function show(i, instant) {
        var next = ((i % count) + count) % count;
        // 首尾 wrap 时禁用 transition 瞬间跳转，避免整排反向扫过。
        // 仅箭头相邻切换跨边界用（instant=true）；指示器直接点击永远带动画
        var isWrap = (index === count - 1 && next === 0) || (index === 0 && next === count - 1);
        if (isWrap && instant) {
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
        show(index + 1, true);
        startAuto(); // 手动操作后重置自动播放节奏
    });

    prevBtn.addEventListener('click', function () {
        show(index - 1, true);
        startAuto();
    });

    indicators.forEach(function (el) {
        el.addEventListener('click', function () {
            show(parseInt(el.dataset.index, 10), false);
            startAuto();
        });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                show(parseInt(el.dataset.index, 10), false);
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

    // 首屏激活态同步（index 初始为 0，show(0) 仅同步 active 类）
    show(0, false);

    // 启动自动播放
    startAuto();
})();
