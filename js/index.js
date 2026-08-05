(function () {
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
})();
