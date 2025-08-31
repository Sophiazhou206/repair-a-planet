/*
 * 游戏页面交互脚本 - 统一750×1334架构
 * 移除所有旧的响应式代码，使用base.js统一管理
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
    console.log('🎯 初始化关卡1游戏页面 - 750×1334架构');
    
    // 获取URL参数中的关卡信息
    const urlParams = new URLSearchParams(window.location.search);
    const levelNumber = urlParams.get('level') || '1';
    console.log(`当前关卡: ${levelNumber} - 750×1334坐标系`);
    
    // 初始化游戏逻辑
    initGameLogic();
    
    // 绑定事件（使用统一坐标映射）
    bindGameEvents();
    
    console.log('✅ 游戏页面初始化完成 - 750×1334架构');
}

// 初始化游戏逻辑 - 750×1334坐标系
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
        // 点击事件 - 750×1334坐标系
        backButton.addEventListener('click', function(e) {
            handleBackToLevels(e);
        });
        
        // 触摸事件优化 - 750×1334坐标系
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'translateX(-50%) scale(0.95)';
            
            // 坐标映射示例
            if (window.gameScaleManager && e.touches[0]) {
                const touch = e.touches[0];
                const designCoords = window.gameScaleManager.screenToDesign(touch.clientX, touch.clientY);
                console.log(`返回按钮触摸 - 屏幕: ${touch.clientX},${touch.clientY} → 设计: ${designCoords.x.toFixed(0)},${designCoords.y.toFixed(0)}`);
            }
        });
        
        backButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'translateX(-50%)';
            setTimeout(() => {
                handleBackToLevels(e);
            }, 50);
        });
    }
}

// 绑定游戏事件 - 750×1334坐标系
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
                console.log('🔄 重启关卡 - 750×1334架构');
                window.location.reload();
                break;
            case 'F12':
                // 切换调试信息
                toggleDebugInfo();
                break;
        }
    });
    
    // 游戏区域点击事件 - 750×1334坐标映射
    const gameContent = document.querySelector('.game-content');
    if (gameContent) {
        gameContent.addEventListener('click', function(e) {
            if (window.gameScaleManager) {
                const designCoords = window.gameScaleManager.screenToDesign(e.clientX, e.clientY);
                console.log(`游戏区域点击 - 屏幕: ${e.clientX},${e.clientY} → 设计: ${designCoords.x.toFixed(0)},${designCoords.y.toFixed(0)}`);
                
                // 这里可以添加游戏逻辑，使用designCoords作为750×1334坐标系中的位置
            }
        });
    }
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    });
}

// 返回关卡选择页面 - 750×1334架构
function handleBackToLevels(event = null) {
    console.log('🔙 返回关卡选择 - 750×1334架构');
    
    // 记录点击坐标（用于调试）
    if (event && window.gameScaleManager) {
        const clientX = event.clientX || 0;
        const clientY = event.clientY || 0;
        const designCoords = window.gameScaleManager.screenToDesign(clientX, clientY);
        console.log(`返回点击坐标 - 屏幕: ${clientX},${clientY} → 设计: ${designCoords.x.toFixed(0)},${designCoords.y.toFixed(0)}`);
    }
    
    if (window.GameUtils) {
        window.GameUtils.navigateTo('../html/levels.html');
    } else {
        setTimeout(() => {
            window.location.href = '../html/levels.html';
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

// 游戏逻辑框架 - 750×1334坐标系
window.GameLogic = {
    currentLevel: 1,
    isPlaying: false,
    isPaused: false,
    
    // 开始游戏 - 750×1334坐标系
    startGame: function() {
        this.isPlaying = true;
        this.isPaused = false;
        console.log('🎮 游戏开始 - 750×1334架构');
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
        console.log('🎉 关卡完成 - 750×1334架构');
    },
    
    // 坐标系转换工具
    getDesignCoordinates: function(screenX, screenY) {
        if (window.gameScaleManager) {
            return window.gameScaleManager.screenToDesign(screenX, screenY);
        }
        return { x: screenX, y: screenY };
    }
};