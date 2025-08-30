/*
 * 关卡选择页面交互脚本 - 统一750×1334架构
 * 移除所有旧的响应式代码，使用base.js统一管理
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 关卡选择页面已加载');
    
    // 等待基础架构初始化完成
    window.addEventListener('gameScaleReady', function() {
        initLevelsPage();
    });
    
    // 如果基础架构已经准备好，直接初始化
    if (window.gameScaleManager && window.gameScaleManager.isInitialized) {
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
        console.error('关卡卡片未找到');
        return;
    }
    
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
    console.log(`🔗 绑定关卡事件 - 找到 ${levelCards.length} 个关卡卡片`);
    
    levelCards.forEach((card, index) => {
        const levelNumber = parseInt(card.dataset.level) || (index + 1);
        
        // 点击事件 - 750×1334坐标系
        card.addEventListener('click', function(e) {
            handleLevelClick(levelNumber, e);
        });
        
        // 触摸事件优化 - 750×1334坐标系
        let touchStarted = false;
        
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            touchStarted = true;
            
            console.log(`📱 触摸开始 - 关卡 ${levelNumber}`);
            
            if (!this.classList.contains('locked')) {
                this.style.transform = 'scale(0.95)';
                
                // 使用坐标映射（如果需要精确位置）
                if (window.gameScaleManager) {
                    const touch = e.touches[0];
                    const designCoords = window.gameScaleManager.screenToDesign(touch.clientX, touch.clientY);
                    console.log(`触摸坐标 - 屏幕: ${touch.clientX},${touch.clientY} → 设计: ${designCoords.x.toFixed(0)},${designCoords.y.toFixed(0)}`);
                }
            }
        }, {passive: false});
        
        card.addEventListener('touchmove', function(e) {
            // 如果触摸移动距离过大，取消点击
            if (touchStarted) {
                const touch = e.touches[0];
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(touch.clientX - centerX, 2) + Math.pow(touch.clientY - centerY, 2));
                
                if (distance > 50) { // 移动距离超过50px取消点击
                    touchStarted = false;
                    this.style.transform = '';
                    console.log(`📱 触摸移动距离过大，取消点击`);
                }
            }
        }, {passive: false});
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = '';
            
            console.log(`📱 触摸结束 - 关卡 ${levelNumber}, touchStarted: ${touchStarted}`);
            
            if (touchStarted && !this.classList.contains('locked')) {
                console.log(`📱 触发关卡点击 - ${levelNumber}`);
                handleLevelClick(levelNumber, e);
            }
            
            touchStarted = false;
        }, {passive: false});
        
        console.log(`✅ 关卡 ${levelNumber} 事件绑定完成`);
    });
    
    console.log(`🎯 所有关卡事件绑定完成！`);
    
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
    console.log(`🎯 点击关卡 ${levelNumber} - 750×1334坐标系 [事件类型: ${event ? event.type : 'unknown'}]`);
    
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
        
        if (isCompleted) {
            console.log(`✅ 重新挑战已通关的关卡 ${levelNumber}`);
        } else {
            console.log(`🌟 进入当前挑战关卡 ${levelNumber}`);
        }
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