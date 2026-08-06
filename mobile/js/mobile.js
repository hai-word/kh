(function () {
    // 识别移动/PC：宽度 ≤768 视为移动端，body 加类
    function detectDevice() {
        var isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-pc', !isMobile);
    }
    detectDevice();
    window.addEventListener('resize', detectDevice);
})();
