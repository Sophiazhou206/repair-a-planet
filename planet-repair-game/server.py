#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的HTTP服务器，用于移动端测试
"""
import http.server
import socketserver
import socket
import webbrowser
import os
import sys

def get_local_ip():
    """获取本机IP地址"""
    try:
        # 创建一个socket连接来获取本机IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP处理器，添加正确的MIME类型"""
    
    def end_headers(self):
        # 添加CORS头部，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        super().end_headers()
    
    def guess_type(self, path):
        """确保正确的MIME类型"""
        mimetype = super().guess_type(path)
        # 确保HTML文件有正确的编码
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return mimetype

def start_server(port=8000):
    """启动HTTP服务器"""
    try:
        # 切换到游戏目录
        os.chdir(os.path.dirname(__file__))
        
        # 获取本机IP
        local_ip = get_local_ip()
        
        # 创建服务器
        handler = CustomHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), handler)
        
        print("=" * 50)
        print("🎮 修一个星球 - 游戏服务器启动")
        print("=" * 50)
        print(f"📱 移动端测试地址:")
        print(f"   本地访问: http://localhost:{port}")
        print(f"   网络访问: http://{local_ip}:{port}")
        print("=" * 50)
        print("📋 测试步骤:")
        print("1. 确保手机和电脑在同一WiFi网络")
        print("2. 在手机浏览器中输入网络访问地址")
        print("3. 或使用浏览器开发者工具模拟移动设备")
        print("=" * 50)
        print("💡 开发者工具快捷键:")
        print("   Chrome: F12 → Ctrl+Shift+M (切换设备模拟)")
        print("   Firefox: F12 → Ctrl+Shift+M")
        print("=" * 50)
        print("🔧 推荐测试设备:")
        print("   iPhone SE (375×667)")
        print("   iPhone 12 Pro (390×844)")
        print("   Samsung Galaxy S20 (360×800)")
        print("=" * 50)
        print(f"🌐 服务器运行在端口 {port}")
        print("按 Ctrl+C 停止服务器")
        print("=" * 50)
        
        # 自动打开浏览器
        try:
            webbrowser.open(f'http://localhost:{port}')
        except:
            pass
            
        # 启动服务器
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        httpd.shutdown()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ 端口 {port} 已被占用，请尝试其他端口")
            print(f"💡 运行命令: python server.py {port + 1}")
        else:
            print(f"❌ 启动服务器时出错: {e}")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except:
            print("❌ 无效的端口号，使用默认端口 8000")
    
    start_server(port)
