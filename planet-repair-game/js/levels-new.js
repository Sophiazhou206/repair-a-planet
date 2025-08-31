/*
 * 关卡选择页面交互脚本 - 使用统一基础架构
 * 设计分辨率：750×1334
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
    console.log('🎮 初始化关卡选择页面');
    
    // 获取所有关卡卡片
    levelCards = document.querySelectorAll('.level-card');
    
    if (levelCards.length === 0) {
        console.error('关卡卡片未找到');
        return;
    }
    
    // 初始化关卡状态
    initLevelStates();
    
    // 绑定事件
    bindLevelEvents();
    
    // 默认选中关卡1
    selectLevel(1);
    
    console.log('✅ 关卡页面初始化完成');
}

// 初始化关卡状态
function initLevelStates() {
    levelCards.forEach((card, index) => {
        const levelNumber = index + 1;
        
        // 只有关卡1可用，其他锁定
        if (levelNumber !== 1) {
            card.classList.add('locked');
        }
        
        // 设置数据属性
        card.dataset.level = levelNumber;
    });
}

// 绑定关卡事件
function bindLevelEvents() {
    levelCards.forEach((card) => {
        const levelNumber = parseInt(card.dataset.level);
        
        card.addEventListener('click', function() {
            handleLevelClick(levelNumber);
        });
        
        // 触摸事件优化
        card.addEventListener('touchstart', function(e) {
            if (!this.classList.contains('locked')) {
                e.preventDefault();
                this.style.transform = 'scale(0.95)';
            }
        });
        
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = '';
        });
    });
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
                if (currentSelectedLevel === 1) {
                    handleLevelClick(1);
                }
                break;
            case 'Escape':
                // 返回主页面
                if (window.GameUtils) {
                    window.GameUtils.navigateTo('../index.html');
                } else {
                    window.location.href = '../index.html';
                }
                break;
        }
    });
}

// 处理关卡点击
function handleLevelClick(levelNumber) {
    console.log(`🎯 点击关卡 ${levelNumber}`);
    
    // 只允许点击关卡1
    if (levelNumber === 1) {
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
        // 锁定关卡的点击反馈
        showLockedFeedback(levelNumber);
    }
}

// 关卡选择逻辑 - 只允许选择关卡1
function selectLevel(levelNumber) {
    // 只允许选择关卡1
    if (levelNumber !== 1) {
        console.log(`关卡 ${levelNumber} 已锁定，无法选择`);
        return;
    }
    
    // 移除所有选中状态
    levelCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // 添加选中状态到关卡1
    const selectedCard = document.querySelector(`[data-level="${levelNumber}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        currentSelectedLevel = levelNumber;
        
        console.log(`关卡 ${levelNumber} 已选中`);
        
        // 添加选择动画效果
        selectedCard.style.transform = 'scale(1.1)';
        setTimeout(() => {
            selectedCard.style.transform = '';
        }, 200);
    }
}

// 显示锁定反馈
function showLockedFeedback(levelNumber) {
    console.log(`关卡 ${levelNumber} 已锁定，无法选择`);
    
    // 添加锁定反馈动画
    const lockedCard = document.querySelector(`[data-level="${levelNumber}"]`);
    if (lockedCard) {
        lockedCard.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            lockedCard.style.animation = '';
        }, 500);
    }
    
    // 可以添加提示文字或音效
    // showToast(`关卡 ${levelNumber} 尚未解锁`);
}
