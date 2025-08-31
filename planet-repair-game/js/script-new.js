/*
 * 主页面交互脚本 - 使用统一基础架构
 * 设计分辨率：750×1334
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
    console.log('🎮 初始化游戏主页面');
    
    // 获取开始按钮
    const startButton = document.querySelector('.start-game-btn');
    if (!startButton) {
        console.error('开始游戏按钮未找到');
        return;
    }
    
    // 按钮点击事件
    startButton.addEventListener('click', handleStartGame);
    
    // 触摸事件优化
    startButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
    });
    
    startButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.transform = '';
        handleStartGame();
    });
    
    // 键盘事件
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleStartGame();
                break;
        }
    });
    
    console.log('✅ 主页面初始化完成');
}

// 处理开始游戏
function handleStartGame() {
    console.log('🎯 开始游戏！');
    
    // 添加视觉反馈
    const startButton = document.querySelector('.start-game-btn');
    if (startButton) {
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

// 调试模式切换（开发时使用）
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        // 切换调试信息显示
        const debugInfo = document.querySelector('.debug-info');
        if (debugInfo) {
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        }
    }
});
