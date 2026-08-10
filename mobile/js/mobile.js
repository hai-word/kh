(function () {
    // 设备识别（window.IS_MOBILE / IS_PC、body.is-mobile/.is-pc）已由 index.html 内联脚本统一设置

    // 底部导航栏：选中态切换（图标 + 文字变色）
    function initBottomBar() {
        var bar = document.querySelector('.mobile-bottom-bar');
        console.log('bar.querySelectorAll(\'span\')',bar.querySelectorAll('span'));
        
        if (!bar) return;
        var items = Array.prototype.slice.call(bar.querySelectorAll('span'));
        items.forEach(function (span) {
            span.addEventListener('click', function () {
                // 全部切回未选中
                items.forEach(function (s) {
                    s.classList.remove('active');
                    var img = s.querySelector('img');
                    if (s.dataset.nor && img) img.src = s.dataset.nor;
                });
                // 当前项切为选中
                span.classList.add('active');
                var img = span.querySelector('img');
                if (span.dataset.sel && img) img.src = span.dataset.sel;
                // 同页切换内容：显示对应面板，隐藏其他
                if (span.dataset.page) {
                    var pages = document.querySelectorAll('.mobile-page');
                    pages.forEach(function (p) {
                        p.classList.remove('active');
                    });
                    var target = document.querySelector('.' + span.dataset.page);
                    if (target) target.classList.add('active');
                }
            });
        });
    }
    // 页面加载后 DOM 就绪再绑定
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBottomBar);
    } else {
        initBottomBar();
    }

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

    // 一键创建/导入简历：SweetAlert2 底部弹层 + toast
    function initResumeSheet() {
        var box = document.querySelector('.mobile-white-box');
        var fileInput = document.getElementById('mResumeFile');
        if (!box || !fileInput || typeof Swal === 'undefined') return;

        var toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500
        });

        box.addEventListener('click', function () {
            Swal.fire({
                position: 'bottom',
                title: '选择操作',
                heightAuto: false, // 防 Swal 给 body 加 swal2-height-auto（height:auto!important）塌掉 100dvh 布局
                html: '<button type="button" class="m-sheet-item" id="mActCreate">创建简历</button>' +
                      '<button type="button" class="m-sheet-item" id="mActImport">导入简历</button>',
                showCloseButton: true,
                showConfirmButton: false,
                customClass: { popup: 'm-sheet-pop' },
                didOpen: function () {
                    var createBtn = document.getElementById('mActCreate');
                    var importBtn = document.getElementById('mActImport');
                    if (createBtn) {
                        createBtn.addEventListener('click', function () {
                            Swal.close();
                            toast.fire({ icon: 'info', title: '功能开发中' });
                        });
                    }
                    if (importBtn) {
                        importBtn.addEventListener('click', function () {
                            // 清空上次选择 + 关层；文件框用 setTimeout 延时触发，
                            // 用户手势（transient activation）保留，真机必弹文件选择器
                            fileInput.value = '';
                            Swal.close();
                            setTimeout(function () { fileInput.click(); }, 0);
                        });
                    }
                }
            });
        });

        fileInput.addEventListener('change', function () {
            var name = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '文件';
            var box = document.querySelector('.mobile-white-box');
            if (box) {
                box.classList.add('imported'); // 靠左布局：图标 24dp、文字 17dp
                var icon = box.querySelector('.wb-icon');
                if (icon) icon.src = './img/mobile/file.svg';
                // 白盒文字变文件名（TextView 54×14dp #333333 14sp）
                var textEl = box.querySelector('.wb-text');
                if (textEl) {
                    textEl.textContent = name;
                    textEl.classList.add('filename');
                }
            }
            toast.fire({ icon: 'success', title: '已收到简历：' + name });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResumeSheet);
    } else {
        initResumeSheet();
    }
})();
