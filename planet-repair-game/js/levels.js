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
        return;
    }
    
    console.log(`✅ 找到 ${levelCards.length} 个关卡卡片`);
    
    // 加载游戏进度
    const gameProgress = loadGameProgress();
    console.log(`📊 加载的游戏进度:`, gameProgress);
    
    // 初始化关卡状态
    initLevelStates(gameProgress);
    
    // 绑定事件（使用统一坐标映射）
    bindLevelEvents();
    
    // 根据进度选中关卡
    const targetLevel = gameProgress.currentLevel || 1;
    console.log(`🎯 目标选中关卡: ${targetLevel}`);
    selectLevel(targetLevel);
    
    console.log(`✅ 关卡页面初始化完成`);
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
        
        console.log(`🎯 处理关卡 ${levelNumber}...`);
        
        // 清除所有状态类
        card.classList.remove('locked', 'completed', 'current-challenge', 'selected', 'unlocked');
        
        // 检查关卡完成状态
        const isCompleted = gameProgress[`level${levelNumber}Completed`] || false;
        const isUnlocked = gameProgress.unlockedLevels.includes(levelNumber);
        const isCurrentChallenge = (gameProgress.currentLevel === levelNumber) && isUnlocked && !isCompleted;
        
        console.log(`📊 关卡 ${levelNumber} 详细状态:`);
        console.log(`   - 解锁: ${isUnlocked}`);
        console.log(`   - 完成: ${isCompleted}`);
        console.log(`   - 当前关卡: ${gameProgress.currentLevel}`);
        console.log(`   - 是当前挑战: ${isCurrentChallenge}`);
        
        if (!isUnlocked) {
            // 未解锁关卡
            card.classList.add('locked');
            console.log(`✅ 关卡 ${levelNumber}: 🔒 锁定`);
        } else if (isCompleted) {
            // 已通关关卡
            card.classList.add('completed');
            console.log(`✅ 关卡 ${levelNumber}: ✅ 已通关`);
        } else if (isCurrentChallenge) {
            // 当前挑战关卡
            card.classList.add('current-challenge');
            console.log(`✅ 关卡 ${levelNumber}: 🌟 当前挑战`);
        } else {
            // 已解锁但未完成的关卡
            card.classList.add('unlocked');
            console.log(`✅ 关卡 ${levelNumber}: 🔓 已解锁`);
        }
        
        // 设置数据属性
        card.dataset.level = levelNumber;
        card.dataset.unlocked = isUnlocked.toString();
        card.dataset.completed = isCompleted.toString();
    });
}

// 绑定关卡事件 - 统一坐标映射
function bindLevelEvents() {
    console.log(`🔗 开始绑定关卡事件 - 共 ${levelCards.length} 个关卡`);
    
    levelCards.forEach((card, index) => {
        const levelNumber = parseInt(card.dataset.level) || (index + 1);
        
        console.log(`🎯 绑定关卡 ${levelNumber} 事件...`);
        
        // 清除可能的旧事件监听器
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        levelCards[index] = newCard;  // 更新引用
        
        // 重新设置数据属性
        newCard.dataset.level = levelNumber;
        
        console.log(`🔄 关卡 ${levelNumber} 事件监听器已重置`);
        
        // 点击事件 - 750×1334坐标系
        newCard.addEventListener('click', function(e) {
            console.log(`🖱️ 关卡 ${levelNumber} 点击事件触发`);
            e.preventDefault();
            e.stopPropagation();
            handleLevelClick(levelNumber, e);
        });
        
        // 触摸事件优化 - 750×1334坐标系
        newCard.addEventListener('touchstart', function(e) {
            console.log(`📱 关卡 ${levelNumber} 触摸开始`);
            e.preventDefault();
            e.stopPropagation();
            
            if (!this.classList.contains('locked')) {
                this.style.transform = 'scale(0.95)';
            }
        }, {passive: false});
        
        newCard.addEventListener('touchend', function(e) {
            console.log(`📱 关卡 ${levelNumber} 触摸结束`);
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = '';
            
            // 直接触发，不延迟（移动端优化）
            if (!this.classList.contains('locked')) {
                console.log(`📱 触摸触发关卡 ${levelNumber} 点击`);
                handleLevelClick(levelNumber, e);
            }
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
    console.log(`🎯 点击关卡 ${levelNumber} - 事件类型: ${event ? event.type : 'unknown'}`);
    
    // 检查关卡状态
    const gameProgress = loadGameProgress();
    console.log(`📊 当前游戏进度:`, gameProgress);
    
    const isUnlocked = gameProgress.unlockedLevels.includes(levelNumber);
    const isCompleted = gameProgress[`level${levelNumber}Completed`] || false;
    
    console.log(`🔍 关卡 ${levelNumber} 状态 - 解锁: ${isUnlocked}, 完成: ${isCompleted}`);
    
    if (isUnlocked) {
        console.log(`✅ 关卡 ${levelNumber} 已解锁，准备进入`);
        selectLevel(levelNumber);
        
        // 直接跳转，不延迟（避免移动端问题）
        console.log(`🎮 立即跳转到关卡 ${levelNumber}`);
        
        if (window.GameUtils) {
            window.GameUtils.navigateTo(`game.html?level=${levelNumber}`);
        } else {
            window.location.href = `game.html?level=${levelNumber}`;
        }
    } else {
        console.log(`🔒 关卡 ${levelNumber} 已锁定，显示反馈`);
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