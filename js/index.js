(function () {
    var track = document.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');

    var count = track.children.length;
    var index = 0;

    function show(i) {
        // 循环：负数取模结果仍为负，手动转正
        index = ((i % count) + count) % count;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }

    nextBtn.addEventListener('click', function () {
        show(index + 1);
    });

    prevBtn.addEventListener('click', function () {
        show(index - 1);
    });
})();
