/*
 * 移动端H5游戏统一基础架构
 * 设计分辨率：750×1334
 * 缩放策略：contain
 */

// 设计分辨率常量
const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 1334;

// 全局缩放管理器
class GameScaleManager {
    constructor() {
        this.container = null;
        this.currentScale = 1;
        this.isInitialized = false;
        
        // 绑定事件
        this.bindEvents();
    }
    
    // 初始化容器
    init(container) {
        if (!container) {
            container = document.querySelector('.game-container');
        }
        
        if (!container) {
            console.error('游戏容器未找到');
            return false;
        }
        
        this.container = container;
        this.isInitialized = true;
        
        // 设置固定设计尺寸
        this.container.style.width = DESIGN_WIDTH + 'px';
        this.container.style.height = DESIGN_HEIGHT + 'px';
        
        // 立即执行一次缩放
        this.updateScale();
        
        console.log(`游戏容器初始化完成 - 设计分辨率: ${DESIGN_WIDTH}×${DESIGN_HEIGHT}`);
        return true;
    }
    
    // 更新缩放
    updateScale() {
        if (!this.isInitialized || !this.container) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 计算contain缩放比例
        const scaleX = viewportWidth / DESIGN_WIDTH;
        const scaleY = viewportHeight / DESIGN_HEIGHT;
        const scale = Math.min(scaleX, scaleY);
        
        // 限制缩放范围
        this.currentScale = Math.max(0.3, Math.min(scale, 2.0));
        
        // 应用缩放
        this.container.style.transform = `scale(${this.currentScale})`;
        this.container.style.transformOrigin = 'center center';
        
        // 计算居中位置
        const scaledWidth = DESIGN_WIDTH * this.currentScale;
        const scaledHeight = DESIGN_HEIGHT * this.currentScale;
        const offsetX = (viewportWidth - scaledWidth) / 2;
        const offsetY = (viewportHeight - scaledHeight) / 2;
        
        // 应用居中
        this.container.style.position = 'absolute';
        this.container.style.left = '50%';
        this.container.style.top = '50%';
        this.container.style.marginLeft = `-${DESIGN_WIDTH / 2}px`;
        this.container.style.marginTop = `-${DESIGN_HEIGHT / 2}px`;
        
        // 更新调试信息
        this.updateDebugInfo(viewportWidth, viewportHeight, scale);
        
        console.log(`缩放更新 - 屏幕: ${viewportWidth}×${viewportHeight}, 缩放: ${this.currentScale.toFixed(3)}`);
    }
    
    // 绑定事件监听
    bindEvents() {
        // 窗口大小变化
        window.addEventListener('resize', () => this.debounce(() => this.updateScale(), 100));
        
        // 设备方向变化
        window.addEventListener('orientationchange', () => {
            // 延迟处理，等待方向变化完成
            setTimeout(() => this.updateScale(), 200);
        });
        
        // 视觉视口变化（键盘弹出等）
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => this.updateScale());
        }
        
        // 页面显示/隐藏
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => this.updateScale(), 100);
            }
        });
    }
    
    // 防抖函数
    debounce(func, delay) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, delay);
    }
    
    // 更新调试信息
    updateDebugInfo(vw, vh, rawScale) {
        let debugElement = document.querySelector('.debug-info');
        if (!debugElement) {
            debugElement = document.createElement('div');
            debugElement.className = 'debug-info';
            document.body.appendChild(debugElement);
        }
        
        const dpr = window.devicePixelRatio || 1;
        debugElement.innerHTML = `
            屏幕: ${vw}×${vh}<br/>
            设计: ${DESIGN_WIDTH}×${DESIGN_HEIGHT}<br/>
            缩放: ${this.currentScale.toFixed(3)}<br/>
            DPR: ${dpr}<br/>
            UA: ${this.getMobileInfo()}
        `;
    }
    
    // 获取设备信息
    getMobileInfo() {
        const ua = navigator.userAgent;
        if (/iPhone|iPad/.test(ua)) return 'iOS';
        if (/Android/.test(ua)) return 'Android';
        if (/Windows Phone/.test(ua)) return 'WP';
        return 'Desktop';
    }
    
    // 获取当前缩放比例
    getScale() {
        return this.currentScale;
    }
    
    // 坐标转换：屏幕坐标到设计坐标
    screenToDesign(screenX, screenY) {
        const rect = this.container.getBoundingClientRect();
        const designX = (screenX - rect.left) / this.currentScale;
        const designY = (screenY - rect.top) / this.currentScale;
        return { x: designX, y: designY };
    }
}

// 全局缩放管理器实例
window.gameScaleManager = new GameScaleManager();

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保DOM完全就绪
    setTimeout(() => {
        const success = window.gameScaleManager.init();
        if (success) {
            console.log('✅ 游戏基础架构初始化完成');
            
            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('gameScaleReady'));
        }
    }, 50);
});

// 全局工具函数
window.GameUtils = {
    // 设备检测
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    
    // DPI检测
    getDevicePixelRatio: () => window.devicePixelRatio || 1,
    
    // 安全区域检测
    getSafeAreaInsets: () => ({
        top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)')) || 0
    }),
    
    // 防抖函数
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },
    
    // 页面跳转（带加载动画）
    navigateTo: (url, delay = 300) => {
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
};
