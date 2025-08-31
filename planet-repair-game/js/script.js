/*
 * 主页面交互脚本 - 统一750×1334架构
 * 移除所有旧的响应式代码，使用base.js统一管理
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 游戏主页面已加载');
    
    // 等待基础架构初始化完成
    window.addEventListener('gameScaleReady', function() {
        initMainPage();
    });
    
    // 如果基础架构已经准备好，直接初始化
    if (window.gameScaleManager && window.gameScaleManager.isInitialized) {
        initMainPage();
    }
});

// 主页面初始化
function initMainPage() {
    console.log('🎮 初始化游戏主页面 - 750×1334架构');
    
    // 获取开始按钮
    const startButton = document.querySelector('.start-game-btn');
    if (!startButton) {
        console.error('开始游戏按钮未找到');
        return;
    }
    
    // 按钮点击事件 - 使用统一坐标映射
    startButton.addEventListener('click', handleStartGame);
    
    // 触摸事件优化 - 750×1334坐标系
    startButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        
        // 使用统一的缩放感知
        this.style.transform = 'scale(0.95)';
        console.log('触摸开始 - 750×1334坐标系');
    });
    
    startButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = '';
        
        // 延迟触发点击，防止重复
        setTimeout(() => {
            handleStartGame();
        }, 50);
    });
    
    // 键盘事件
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleStartGame();
                break;
            case 'F12':
                // 切换调试信息
                toggleDebugInfo();
                break;
        }
    });
    
    console.log('✅ 主页面初始化完成 - 750×1334架构');
}

// 处理开始游戏 - 统一坐标系
function handleStartGame() {
    console.log('🎯 开始游戏 - 750×1334坐标系');
    
    // 添加视觉反馈
    const startButton = document.querySelector('.start-game-btn');
    if (startButton) {
        // 停止原有动画
        startButton.style.animation = 'none';
        startButton.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            startButton.style.transform = '';
        }, 150);
    }
    
    // 页面跳转（使用统一的跳转方法）
    if (window.GameUtils) {
        window.GameUtils.navigateTo('html/levels.html');
    } else {
        // 降级方案
        setTimeout(() => {
            window.location.href = 'html/levels.html';
        }, 300);
    }
}

// 切换调试信息
function toggleDebugInfo() {
    const debugInfo = document.querySelector('.debug-info');
    if (debugInfo) {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    }
}

// 页面特定初始化（在base.js架构基础上）
window.addEventListener('gameScaleReady', function() {
    console.log('🎯 750×1334架构就绪，主页面特定功能启动');
    
    // 这里可以添加主页面特定的750×1334坐标系功能
    // 例如：粒子效果、背景动画等
});