(function () {
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

    // 首屏激活态同步（index 初始为 0，show(0) 仅同步 active 类）
    show(0);
})();
