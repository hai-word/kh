# -*- coding: utf-8 -*-
"""本地静态服务器：修正 .svg 的 MIME 为 image/svg+xml（python http.server 默认给 image/svg 会挂掉夸克/小米/手机浏览器）"""
import http.server

handler = http.server.SimpleHTTPRequestHandler
# 覆盖 svg 的 MIME 类型，默认 http.server 给的是 image/svg（无效）
handler.extensions_map.update({
    '.svg': 'image/svg+xml',
})

print('Serving on 0.0.0.0:8000 with svg MIME fix (image/svg+xml)')
# ThreadingHTTPServer：多线程并发，手机上多个文件并行加载，不排队
http.server.ThreadingHTTPServer(('0.0.0.0', 8000), handler).serve_forever()
