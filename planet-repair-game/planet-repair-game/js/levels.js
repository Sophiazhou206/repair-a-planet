/*
 * 关卡选择页面交互脚本 - 统一750×1334架构
 * 移除所有旧的响应式代码，使用base.js统一管理
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 关卡选择页面已加载');
    
    // 强制初始化，不依赖复杂的事件等待
    setTimeout(() => {
        console.log('🚀 强制初始化关卡页面');
        initLevelsPage();
    }, 100);
    
    // 等待基础架构初始化完成
    window.addEventListener('gameScaleReady', function() {
        console.log('📏 收到 gameScaleReady 事件');
        initLevelsPage();
    });
    
    // 如果基础架构已经准备好，直接初始化
    if (window.gameScaleManager && window.gameScaleManager.isInitialized) {
        console.log('📏 基础架构已准备好，直接初始化');
        initLevelsPage();
    }
});

// 全局变量
let levelCards = [];
let currentSelectedLevel = 1;

// 关卡页面初始化
function initLevelsPage() {
    console.log('🎮 初始化关卡选择页面 - 750×1334架构');
    
    // 获取所有关卡卡片
    levelCards = document.querySelectorAll('.level-card');
    
    if (levelCards.length === 0) {
        console.error('❌ 关卡卡片未找到！检查DOM结构...');
        console.log('🔍 尝试查找其他选择器...');
        const allDivs = document.querySelectorAll('div');
        console.log(`📊 页面共有 ${allDivs.length} 个div元素`);
        return;
    }
    
    console.log(`✅ 找到 ${levelCards.length} 个关卡卡片`);
    
    // 加载游戏进度
    const gameProgress = loadGameProgress();
    
    // 初始化关卡状态
    initLevelStates(gameProgress);
    
    // 绑定事件（使用统一坐标映射）
    bindLevelEvents();
    
    // 根据进度选中关卡
    const targetLevel = gameProgress.currentLevel || 1;
    selectLevel(targetLevel);
    
    console.log(`✅ 关卡页面初始化完成 - ${levelCards.length}个关卡，当前关卡: ${targetLevel}`);
}

// 加载游戏进度
function loadGameProgress() {
    try {
        const saved = localStorage.getItem('planetRepairGameProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            console.log('📖 读取游戏进度:', progress);
            return progress;
        }
    } catch (error) {
        console.error('读取游戏进度失败:', error);
    }
    
    // 默认进度
    return {
        level1Completed: false,
        currentLevel: 1,
        unlockedLevels: [1]
    };
}

// 初始化关卡状态 - 三种状态系统
function initLevelStates(gameProgress) {
    console.log('🔓 根据进度初始化关卡状态:', gameProgress);
    
    levelCards.forEach((card, index) => {
        const levelNumber = index + 1;
        
        // 清除所有状态类
        card.classList.remove('locked', 'completed', 'current-challenge', 'selected');
        
        // 检查关卡完成状态
        const isCompleted = gameProgress[`level${levelNumber}Completed`] || false;
        const isUnlocked = gameProgress.unlockedLevels.includes(levelNumber);
        const isCurrentChallenge = (gameProgress.currentLevel === levelNumber) && isUnlocked && !isCompleted;
        
        if (!isUnlocked) {
            // 未解锁关卡
            card.classList.add('locked');
            console.log(`关卡 ${levelNumber}: 🔒 锁定`);
        } else if (isCompleted) {
            // 已通关关卡
            card.classList.add('completed');
            console.log(`关卡 ${levelNumber}: ✅ 已通关`);
        } else if (isCurrentChallenge) {
            // 当前挑战关卡
            card.classList.add('current-challenge');
            console.log(`关卡 ${levelNumber}: 🌟 当前挑战`);
        } else {
            // 已解锁但未完成的关卡
            card.classList.add('unlocked');
            console.log(`关卡 ${levelNumber}: 🔓 已解锁`);
        }
        
        // 设置数据属性
        card.dataset.level = levelNumber;
    });
}

// 绑定关卡事件 - 统一坐标映射
function bindLevelEvents() {
    levelCards.forEach((card, index) => {
        const levelNumber = parseInt(card.dataset.level) || (index + 1);
        
        // 点击事件 - 750×1334坐标系
        card.addEventListener('click', function(e) {
            handleLevelClick(levelNumber, e);
        });
        
        // 触摸事件优化 - 750×1334坐标系
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            if (!this.classList.contains('locked')) {
                this.style.transform = 'scale(0.95)';
            }
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = '';
            
            // 延迟触发，防止与click重复
            setTimeout(() => {
                if (!this.classList.contains('locked')) {
                    handleLevelClick(levelNumber, e);
                }
            }, 50);
        });
    });
    
    // 键盘控制 - 750×1334架构
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
                if (currentSelectedLevel === 1) {
                    handleLevelClick(1);
                }
                break;
            case 'Escape':
                handleBackToMain();
                break;
            case 'F12':
                // 切换调试信息
                toggleDebugInfo();
                break;
        }
    });
}

// 处理关卡点击 - 统一坐标系
function handleLevelClick(levelNumber, event = null) {
    console.log(`点击关卡 ${levelNumber}`);
    
    // 记录点击坐标（用于调试）
    if (event && window.gameScaleManager) {
        const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
        const clientY = event.clientY || (event.touches && event.touches[0].clientY) || 0;
        const designCoords = window.gameScaleManager.screenToDesign(clientX, clientY);
        console.log(`点击坐标映射 - 屏幕: ${clientX},${clientY} → 设计: ${designCoords.x.toFixed(0)},${designCoords.y.toFixed(0)}`);
    }
    
    // 检查关卡状态
    const gameProgress = loadGameProgress();
    const isUnlocked = gameProgress.unlockedLevels.includes(levelNumber);
    const isCompleted = gameProgress[`level${levelNumber}Completed`] || false;
    
    if (isUnlocked) {
        selectLevel(levelNumber);
        
        // 延迟跳转到游戏页面
        setTimeout(() => {
            console.log(`🎮 准备进入关卡 ${levelNumber}`);
            
            if (window.GameUtils) {
                window.GameUtils.navigateTo(`game.html?level=${levelNumber}`);
            } else {
                window.location.href = `game.html?level=${levelNumber}`;
            }
        }, 500);
        

    } else {
        // 锁定关卡的反馈
        showLockedFeedback(levelNumber);
    }
}

// 关卡选择逻辑 - 750×1334坐标系
function selectLevel(levelNumber) {
    const gameProgress = loadGameProgress();
    const isUnlocked = gameProgress.unlockedLevels.includes(levelNumber);
    
    if (!isUnlocked) {
        console.log(`关卡 ${levelNumber} 已锁定，无法选择`);
        return;
    }
    
    // 移除所有选中状态
    levelCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // 添加选中状态到目标关卡
    const selectedCard = document.querySelector(`[data-level="${levelNumber}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        currentSelectedLevel = levelNumber;
        
        console.log(`关卡 ${levelNumber} 已选中 - 750×1334坐标系`);
        
        // 选择动画 - 统一缩放
        selectedCard.style.transform = 'scale(1.1)';
        setTimeout(() => {
            selectedCard.style.transform = '';
        }, 200);
    }
}

// 显示锁定反馈 - 750×1334坐标系
function showLockedFeedback(levelNumber) {
    console.log(`关卡 ${levelNumber} 已锁定，触发反馈动画`);
    
    const lockedCard = document.querySelector(`[data-level="${levelNumber}"]`);
    if (lockedCard) {
        // 摇摆动画 - 750×1334坐标系
        lockedCard.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            lockedCard.style.animation = '';
        }, 500);
    }
}

// 返回主页面
function handleBackToMain() {
    console.log('🔙 返回主页面 - 750×1334架构');
    
    if (window.GameUtils) {
        window.GameUtils.navigateTo('../index.html');
    } else {
        window.location.href = '../index.html';
    }
}

// 切换调试信息
function toggleDebugInfo() {
    const debugInfo = document.querySelector('.debug-info');
    if (debugInfo) {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    }
}