(function () {
    // 识别移动/PC：多信号冗余判断
    function isMobileSignal() {
        // 1. 视口宽度窄
        if (window.innerWidth <= 768) return true;
        // 2. UA 含移动端标识
        var ua = navigator.userAgent || '';
        var uaMobile = /Android|iPhone|iPod|iPad|Windows Phone|webOS|BlackBerry|Mobile|HarmonyOS/i.test(ua);
        // 3. 触摸能力
        var touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // 4. 粗粒度指针（触屏）
        var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        // 移动 UA + 触摸，或 触摸 + 粗指针 → 移动端
        if (uaMobile && touch) return true;
        if (touch && coarse) return true;
        return false;
    }

    function detectDevice() {
        var isMobile = isMobileSignal();
        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-pc', !isMobile);
    }
    detectDevice();
    window.addEventListener('resize', detectDevice);

    // 兜底：禁止水平滑动（纵向滑动保留）
    var startX = null;
    var startY = null;
    document.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
        if (startX === null) return;
        var dx = e.touches[0].clientX - startX;
        var dy = e.touches[0].clientY - startY;
        // 水平位移大于垂直且超过阈值 → 阻止
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            e.preventDefault();
        }
    }, { passive: false });
})();
