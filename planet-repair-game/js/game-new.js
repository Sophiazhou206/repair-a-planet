/*
 * 游戏页面交互脚本 - 使用统一基础架构
 * 设计分辨率：750×1334
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 关卡1游戏页面已加载');
    
    // 等待基础架构初始化完成
    window.addEventListener('gameScaleReady', function() {
        initGamePage();
    });
    
    // 如果基础架构已经准备好，直接初始化
    if (window.gameScaleManager && window.gameScaleManager.isInitialized) {
        initGamePage();
    }
});

// 游戏页面初始化
function initGamePage() {
    console.log('🎯 初始化关卡1游戏页面');
    
    // 获取URL参数中的关卡信息
    const urlParams = new URLSearchParams(window.location.search);
    const levelNumber = urlParams.get('level') || '1';
    console.log(`当前关卡: ${levelNumber}`);
    
    // 初始化游戏逻辑
    initGameLogic();
    
    // 绑定事件
    bindGameEvents();
    
    console.log('✅ 游戏页面初始化完成');
}

// 初始化游戏逻辑
function initGameLogic() {
    // 防止图片拖拽
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    });
    
    // 获取返回按钮
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', handleBackToLevels);
        
        // 触摸事件优化
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'translateX(-50%) scale(0.95)';
        });
        
        backButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'translateX(-50%)';
            handleBackToLevels();
        });
    }
}

// 绑定游戏事件
function bindGameEvents() {
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Escape':
                handleBackToLevels();
                break;
            case 'r':
            case 'R':
                // 重启当前关卡
                console.log('🔄 重启关卡');
                window.location.reload();
                break;
        }
    });
    
    // 防止双击缩放
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    });
}

// 返回关卡选择页面
function handleBackToLevels() {
    console.log('🔙 返回关卡选择');
    
    if (window.GameUtils) {
        window.GameUtils.navigateTo('../html/levels.html');
    } else {
        // 降级方案
        setTimeout(() => {
            window.location.href = '../html/levels.html';
        }, 300);
    }
}

// 游戏相关功能（待扩展）
window.GameLogic = {
    // 当前关卡信息
    currentLevel: 1,
    
    // 游戏状态
    isPlaying: false,
    isPaused: false,
    
    // 开始游戏
    startGame: function() {
        this.isPlaying = true;
        this.isPaused = false;
        console.log('🎮 游戏开始');
    },
    
    // 暂停游戏
    pauseGame: function() {
        this.isPaused = true;
        console.log('⏸️ 游戏暂停');
    },
    
    // 恢复游戏
    resumeGame: function() {
        this.isPaused = false;
        console.log('▶️ 游戏恢复');
    },
    
    // 完成关卡
    completeLevel: function() {
        this.isPlaying = false;
        console.log('🎉 关卡完成');
        // 这里可以添加通关逻辑
    }
};
