/*
 * Flow Free 游戏逻辑 - 750×1334架构
 * 实现端点连接、路径绘制、游戏状态管理
 */

class FlowFreeGame {
    constructor() {
        this.grid = [];     // 网格数据
        this.endpoints = [];  // 端点数据
        this.paths = new Map();  // 路径数据 {colorId: path[]}
        this.currentPath = null;  // 当前绘制路径
        this.isDrawing = false;   // 是否正在绘制
        this.gameCompleted = false;
        
        // 倒计时系统（动态设置）
        this.timerInterval = null; // 计时器
        this.gameStarted = false;  // 游戏是否开始
        
        // 端点颜色配置 - 对应Frame图标（空格格式）
        this.endpointColors = [
            { id: 0, bg: '#DEEBEE', icon: 'Frame 100.png' },
            { id: 1, bg: '#FFE4E1', icon: 'Frame 99.png' },
            { id: 2, bg: '#E1F5E1', icon: 'Frame 98.png' },
            { id: 3, bg: '#FFF2E1', icon: 'Frame 57.png' },
            { id: 4, bg: '#E8E1FF', icon: 'Frame 56.png' },
            { id: 5, bg: '#FFE1F2', icon: 'Frame 55.png' },
            { id: 6, bg: '#E1FFE8', icon: 'Frame 54.png' },
            { id: 7, bg: '#F2E1FF', icon: 'Frame 53.png' },
            { id: 8, bg: '#E1F2FF', icon: 'Frame 52.png' },
            { id: 9, bg: '#FFE8E1', icon: 'Frame 51.png' },
            { id: 10, bg: '#F5FFE1', icon: 'Frame 50.png' },
            { id: 11, bg: '#E1E8FF', icon: 'Frame 49.png' },
            { id: 12, bg: '#FFE1E8', icon: 'Frame 46.png' }
        ];
        
        // 关卡数据配置
        this.levelConfigs = {
            1: {
                "id": "6*6-001",
                "size": 6,
                "pairs": [
                    { "color": 0, "a": { "r": 0, "c": 0 }, "b": { "r": 4, "c": 1 } },
                    { "color": 1, "a": { "r": 4, "c": 0 }, "b": { "r": 4, "c": 4 } },
                    { "color": 2, "a": { "r": 0, "c": 1 }, "b": { "r": 4, "c": 3 } },
                    { "color": 3, "a": { "r": 1, "c": 1 }, "b": { "r": 2, "c": 4 } },
                    { "color": 4, "a": { "r": 2, "c": 1 }, "b": { "r": 2, "c": 3 } }
                ],
                "constraints": { "timeSec": 60, "maxMoves": 180 }
            },
            2: {
                "id": "7*7-001", 
                "size": 7,
                "pairs": [
                    { "color": 0, "a": { "r": 1, "c": 0 }, "b": { "r": 1, "c": 6 } },
                    { "color": 1, "a": { "r": 2, "c": 0 }, "b": { "r": 6, "c": 1 } },
                    { "color": 2, "a": { "r": 6, "c": 2 }, "b": { "r": 1, "c": 5 } },
                    { "color": 3, "a": { "r": 2, "c": 3 }, "b": { "r": 6, "c": 5 } },
                    { "color": 4, "a": { "r": 3, "c": 3 }, "b": { "r": 3, "c": 5 } },
                    { "color": 5, "a": { "r": 2, "c": 4 }, "b": { "r": 4, "c": 4 } },
                    { "color": 6, "a": { "r": 5, "c": 4 }, "b": { "r": 6, "c": 6 } }
                ],
                "constraints": { "timeSec": 120, "maxMoves": 180 }
            },
            3: {
                "id": "8x8-001",
                "size": 8,
                "pairs": [
                    { "color": 0, "a": { "r": 3, "c": 2 }, "b": { "r": 7, "c": 6 } },
                    { "color": 1, "a": { "r": 3, "c": 1 }, "b": { "r": 1, "c": 6 } },
                    { "color": 2, "a": { "r": 2, "c": 2 }, "b": { "r": 7, "c": 2 } },
                    { "color": 3, "a": { "r": 7, "c": 1 }, "b": { "r": 5, "c": 5 } },
                    { "color": 4, "a": { "r": 6, "c": 1 }, "b": { "r": 4, "c": 4 } }
                ],
                "constraints": { "timeSec": 120, "maxMoves": 180 }
            },
            4: {
                "id": "9x9-001",
                "size": 9,
                "pairs": [
                    { "color": 0, "a": { "r": 7, "c": 2 }, "b": { "r": 3, "c": 7 } },
                    { "color": 1, "a": { "r": 1, "c": 1 }, "b": { "r": 2, "c": 7 } },
                    { "color": 2, "a": { "r": 7, "c": 1 }, "b": { "r": 7, "c": 4 } },
                    { "color": 3, "a": { "r": 3, "c": 2 }, "b": { "r": 5, "c": 8 } },
                    { "color": 4, "a": { "r": 2, "c": 5 }, "b": { "r": 7, "c": 5 } },
                    { "color": 5, "a": { "r": 3, "c": 5 }, "b": { "r": 2, "c": 6 } },
                    { "color": 6, "a": { "r": 4, "c": 6 }, "b": { "r": 6, "c": 6 } },
                    { "color": 7, "a": { "r": 7, "c": 6 }, "b": { "r": 4, "c": 8 } }
                ],
                "constraints": { "timeSec": 120, "maxMoves": 180 }
            },
            5: {
                "id": "9x9-002",
                "size": 9,
                "pairs": [
                    { "color": 0, "a": { "r": 4, "c": 4 }, "b": { "r": 7, "c": 6 } },
                    { "color": 1, "a": { "r": 1, "c": 6 }, "b": { "r": 7, "c": 5 } },
                    { "color": 2, "a": { "r": 1, "c": 7 }, "b": { "r": 6, "c": 6 } },
                    { "color": 3, "a": { "r": 7, "c": 7 }, "b": { "r": 8, "c": 5 } }
                ],
                "constraints": { "timeSec": 120, "maxMoves": 180 }
            },
            6: {
                "id": "9x9-003",
                "size": 9,
                "pairs": [
                    { "color": 0, "a": { "r": 0, "c": 0 }, "b": { "r": 3, "c": 3 } },
                    { "color": 1, "a": { "r": 2, "c": 1 }, "b": { "r": 2, "c": 7 } },
                    { "color": 2, "a": { "r": 6, "c": 2 }, "b": { "r": 2, "c": 8 } },
                    { "color": 3, "a": { "r": 0, "c": 4 }, "b": { "r": 1, "c": 8 } },
                    { "color": 4, "a": { "r": 5, "c": 4 }, "b": { "r": 0, "c": 8 } }
                ],
                "constraints": { "timeSec": 120, "maxMoves": 180 }
            }
        };
        
        // 当前关卡编号（从URL参数获取，默认为1）
        this.currentLevel = this.getCurrentLevelFromURL();
        this.levelData = this.levelConfigs[this.currentLevel];
        this.gridSize = this.levelData.size;
        this.totalTime = this.levelData.constraints.timeSec;
        
        // 初始化剩余时间
        this.remainingTime = this.totalTime;
        
        this.init();
    }
    
    // 从URL获取当前关卡编号
    getCurrentLevelFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const level = parseInt(urlParams.get('level')) || 1;
        console.log(`🎯 从URL获取关卡编号: ${level}`);
        return level;
    }
    
    init() {
        console.log(`初始化关卡${this.currentLevel}游戏 - ${this.gridSize}×${this.gridSize}网格，${this.totalTime}秒`);
        
        // 更新页面标题和关卡编号显示
        this.updateLevelDisplay();
        
        this.initGrid();
        this.placeEndpoints();
        this.updateDisplay();  // 先生成网格
        this.setupEventListeners();  // 然后绑定事件
        this.updateCountdownDisplay();  // 初始化倒计时显示
        this.startGameTimer();  // 页面加载时立即开始倒计时
        console.log(`关卡${this.currentLevel}游戏初始化完成`);
    }
    
    // 更新关卡显示信息
    updateLevelDisplay() {
        // 更新页面标题
        document.title = `修一个星球 - 关卡${this.currentLevel}`;
        
        // 更新关卡编号显示
        const levelNumber = document.querySelector('.level-number');
        if (levelNumber) {
            levelNumber.textContent = this.currentLevel;
        }
        
        console.log(`📝 更新关卡显示: 关卡${this.currentLevel}, ${this.gridSize}×${this.gridSize}, ${this.totalTime}秒`);
    }
    
    // 初始化网格
    initGrid() {
        this.grid = [];
        for (let r = 0; r < this.gridSize; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.gridSize; c++) {
                this.grid[r][c] = {
                    type: 'empty',  // 'empty', 'endpoint', 'path'
                    colorId: null,
                    element: null
                };
            }
        }
    }
    
    // 放置端点
    placeEndpoints() {
        this.endpoints = [];
        this.levelData.pairs.forEach(pair => {
            const colorConfig = this.endpointColors[pair.color];
            
            // 端点A
            this.grid[pair.a.r][pair.a.c] = {
                type: 'endpoint',
                colorId: pair.color,
                pairId: `${pair.color}-a`,
                element: null
            };
            
            // 端点B
            this.grid[pair.b.r][pair.b.c] = {
                type: 'endpoint',
                colorId: pair.color,
                pairId: `${pair.color}-b`,
                element: null
            };
            
            this.endpoints.push({
                colorId: pair.color,
                colorConfig: colorConfig,
                pointA: pair.a,
                pointB: pair.b,
                connected: false
            });
        });
    }
    
         // 更新显示
     updateDisplay() {
         const container = document.querySelector('.game-grid-container');
         if (!container) {
             console.error('游戏容器未找到！');
             return;
         }
         
         console.log(`更新游戏显示 - ${this.gridSize}×${this.gridSize}网格`);
         
         // 清空现有内容
         container.innerHTML = '';
         
         // 设置容器大小类
         container.className = `game-grid-container size-${this.gridSize}`;
         
         // 生成动态网格
         for (let r = 0; r < this.gridSize; r++) {
            const row = document.createElement('div');
            row.className = 'grid-row';
            
            for (let c = 0; c < this.gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                const cellData = this.grid[r][c];
                
                // 添加单元格数据属性，便于调试
                cell.title = `网格 (${r}, ${c}) - ${cellData.type}`;
                
                                 // 添加鼠标按下事件
                 cell.addEventListener('mousedown', (e) => {
                     console.log(`🎯 鼠标按下网格 (${r}, ${c}), 类型: ${cellData.type}`);
                     if (cellData.type === 'endpoint') {
                         this.startDrawingFromCell(r, c);
                     }
                     e.preventDefault();
                     e.stopPropagation();
                 });
                 
                 // 添加鼠标进入事件（用于拖拽绘制）
                 cell.addEventListener('mouseenter', (e) => {
                     if (this.isDrawing && e.buttons === 1) {  // 鼠标左键按下
                         console.log(`🖱️ 鼠标拖拽到网格 (${r}, ${c})`);
                         this.continueDrawingToCell(r, c);
                     }
                 });
                 
                 // 添加触摸事件
                 cell.addEventListener('touchstart', (e) => {
                     console.log(`👆 触摸网格 (${r}, ${c}), 类型: ${cellData.type}`);
                     if (cellData.type === 'endpoint') {
                         this.startDrawingFromCell(r, c);
                     }
                     e.preventDefault();
                     e.stopPropagation();
                 });
                 
                 // 保存网格位置信息到元素上，方便触摸移动事件使用
                 cell._gridPos = {row: r, col: c};
                
                // 如果是端点，添加端点图标
                if (cellData.type === 'endpoint') {
                    const endpoint = this.endpoints.find(ep => ep.colorId === cellData.colorId);
                    if (endpoint) {
                        cell.style.backgroundColor = endpoint.colorConfig.bg;
                        console.log(`放置端点 (${r}, ${c}), 颜色: ${cellData.colorId}, 背景: ${endpoint.colorConfig.bg}`);
                        
                        // 添加端点图标
                        const icon = document.createElement('img');
                        icon.src = `../images/${endpoint.colorConfig.icon}`;
                        icon.className = 'endpoint-icon';
                        icon.style.width = '60px';   /* 适中的图标尺寸 */
                        icon.style.height = '60px';  
                        icon.style.objectFit = 'cover';
                        icon.style.pointerEvents = 'none';  /* 确保不阻止点击 */
                        icon.style.borderRadius = '8px';
                        cell.appendChild(icon);
                    }
                } else if (cellData.type === 'path') {
                    // 路径网格显示对应颜色
                    const endpoint = this.endpoints.find(ep => ep.colorId === cellData.colorId);
                    if (endpoint) {
                        cell.style.backgroundColor = endpoint.colorConfig.bg;
                    }
                }
                
                // 保存元素引用
                this.grid[r][c].element = cell;
                row.appendChild(cell);
            }
            
            container.appendChild(row);
        }
        
        console.log(`网格生成完成，端点数量: ${this.endpoints.length}`);
        console.log('端点位置:', this.endpoints.map(ep => `颜色${ep.colorId}: (${ep.pointA.r},${ep.pointA.c}) <-> (${ep.pointB.r},${ep.pointB.c})`));
    }
    
    // 设置事件监听
    setupEventListeners() {
        const container = document.querySelector('.game-grid-container');
        if (!container) {
            console.error('游戏容器未找到！');
            return;
        }
        
        console.log('设置游戏事件监听器...');
        
        // 测试容器是否可以接收事件
        container.style.pointerEvents = 'auto';
        container.style.userSelect = 'none';
        
        // 鼠标事件
        container.addEventListener('mousedown', (event) => {
            console.log('🖱️ 鼠标按下事件触发！');
            this.handleMouseDown(event);
        });
        
        document.addEventListener('mousemove', (event) => {
            if (this.isDrawing) {
                console.log('🖱️ 鼠标移动中...');
                this.handleMouseMove(event);
            }
        });
        
                 document.addEventListener('mouseup', (event) => {
             if (this.isDrawing) {
                 console.log('🖱️ 鼠标抬起，结束绘制！');
                 this.endDrawing();
             }
         });
        
                 // 触摸移动事件（基于坐标的备用方案）
         document.addEventListener('touchmove', (event) => {
             if (this.isDrawing) {
                 console.log('👆 触摸移动中...');
                 this.handleTouchMove(event);
             }
         }, { passive: false });
         
         document.addEventListener('touchend', (event) => {
             if (this.isDrawing) {
                 console.log('👆 触摸结束，结束绘制！');
                 this.endDrawing();
             }
         }, { passive: false });
        
        // 防止默认的拖拽行为
        container.addEventListener('dragstart', (e) => e.preventDefault());
        container.addEventListener('selectstart', (e) => e.preventDefault());
        
        console.log('所有事件监听器绑定完成！');
    }
    
    // 获取网格位置
    getGridPosition(event) {
        const container = document.querySelector('.game-grid-container');
        if (!container) {
            console.error('容器未找到');
            return null;
        }
        
        const rect = container.getBoundingClientRect();
        
        // 安全获取坐标
        let clientX, clientY;
        
        if (event.type && event.type.startsWith('touch')) {
            // 触摸事件
            if (event.touches && event.touches[0]) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else {
                console.error('触摸事件但无touches数据');
                return null;
            }
        } else {
            // 鼠标事件
            if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
                clientX = event.clientX;
                clientY = event.clientY;
            } else {
                console.error('鼠标事件但无坐标数据', event);
                return null;
            }
        }
        
        console.log(`原始坐标: clientX=${clientX}, clientY=${clientY}`);
        console.log(`容器位置: rect.left=${rect.left}, rect.top=${rect.top}`);
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.error('坐标计算失败', { x, y, clientX, clientY, rect });
            return null;
        }
        
        // 简化坐标计算 - 直接使用CSS像素
        // 假设没有缩放，直接使用设计尺寸计算
        const cellSize = 88;  // CSS中定义的单元格大小
        const gap = 4;        // CSS中定义的间距
        const padding = 24;   // CSS中定义的内边距
        
        console.log(`计算详情: cellSize=${cellSize}, gap=${gap}, padding=${padding}`);
        
        const col = Math.floor((x - padding) / (cellSize + gap));
        const row = Math.floor((y - padding) / (cellSize + gap));
        
        console.log(`相对位置: (${x.toFixed(1)}, ${y.toFixed(1)}) -> 网格: (${row}, ${col})`);
        
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            return { row, col };
        } else {
            console.log(`网格位置超出范围: (${row}, ${col})`);
            return null;
        }
    }
    
    // 鼠标按下 - 使用网格坐标
    handleMouseDown(event) {
        console.log('🖱️ 鼠标按下事件触发');
        event.preventDefault();
        
        // 直接通过事件目标获取网格坐标
        const gridCell = event.target.closest('.grid-cell');
        if (gridCell && gridCell._gridPos) {
            const { row, col } = gridCell._gridPos;
            console.log(`🖱️ 鼠标按下网格: (${row}, ${col})`);
            this.startDrawingFromCell(row, col);
        }
    }
    
    // 鼠标移动 - 使用网格坐标
    handleMouseMove(event) {
        if (!this.isDrawing) return;
        
        console.log('🖱️ 鼠标移动中...');
        
        // 直接通过事件目标获取网格坐标
        const gridCell = event.target.closest('.grid-cell');
        if (gridCell && gridCell._gridPos) {
            const { row, col } = gridCell._gridPos;
            console.log(`🖱️ 鼠标移动到网格: (${row}, ${col})`);
            this.continueDrawingToCell(row, col);
        }
    }
    
    // 鼠标抬起
    handleMouseUp(event) {
        console.log('鼠标抬起事件触发');
        event.preventDefault();
        this.endDrawing();
    }
    
    // 触摸开始 - 使用网格坐标
    handleTouchStart(event) {
        event.preventDefault();
        
        // 获取触摸点下的网格单元格
        const touch = event.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementBelow && elementBelow.classList.contains('grid-cell') && elementBelow._gridPos) {
            const { row, col } = elementBelow._gridPos;
            console.log(`👆 触摸开始网格: (${row}, ${col})`);
            this.startDrawingFromCell(row, col);
        }
    }
    
             // 触摸移动 - 使用网格坐标
    handleTouchMove(event) {
        if (!this.isDrawing) return;
        
        event.preventDefault();
        
        // 获取触摸点下的网格单元格
        const touch = event.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementBelow && elementBelow.classList.contains('grid-cell') && elementBelow._gridPos) {
            const { row, col } = elementBelow._gridPos;
            console.log(`👆 触摸移动到网格: (${row}, ${col})`);
            this.continueDrawingToCell(row, col);
        }
    }
    
    // 触摸结束
    handleTouchEnd(event) {
        event.preventDefault();
        this.endDrawing();
    }
    
             // 调试网格状态
    debugGridState(row, col) {
        console.log('🔍 === 网格状态调试 ===');
        console.log(`📍 坐标: (${row}, ${col})`);
        
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
            console.log('❌ 坐标超出网格范围');
            return;
        }
        
        const cellData = this.grid[row][col];
        console.log(`🎯 格子类型: ${cellData.type}`);
        console.log(`🎨 格子颜色: ${cellData.colorId}`);
        console.log(`📱 DOM元素: ${cellData.element ? '存在' : '不存在'}`);
        
        if (this.currentPath) {
            console.log(`🚀 当前路径颜色: ${this.currentPath.colorId}`);
            console.log(`📏 当前路径长度: ${this.currentPath.path.length}`);
            console.log(`📍 路径包含此位置: ${this.currentPath.path.some(p => p.row === row && p.col === col)}`);
        } else {
            console.log('🚫 当前无活动路径');
        }
        
        console.log(`💾 已保存路径数量: ${this.paths.size}`);
        console.log('🔍 === 调试结束 ===');
    }

    // 从指定网格开始绘制
    startDrawingFromCell(row, col) {
         const cellData = this.grid[row][col];
         console.log(`🎨 从网格 (${row}, ${col}) 开始绘制，类型: ${cellData.type}, 颜色: ${cellData.colorId}`);
         
         if (cellData.type === 'endpoint') {
             this.isDrawing = true;
             this.currentPath = {
                 colorId: cellData.colorId,
                 path: [{row, col}],
                 startPoint: {row, col}
             };
             console.log('✅ 开始绘制路径，颜色ID:', cellData.colorId);
             
             // 清除该颜色的现有路径
             if (this.paths.has(cellData.colorId)) {
                 console.log('🧹 清除已存在的路径，重新开始绘制');
                 this.clearPath(cellData.colorId);
             }
             
             // 添加视觉反馈
             const cell = cellData.element;
             if (cell) {
                 cell.classList.add('drawing');
             }
         } else if (cellData.type === 'path') {
             console.log('🔄 从已有路径开始重新绘制');
             // 如果从路径中间开始，也允许重新绘制
             const existingPath = this.paths.get(cellData.colorId);
             if (existingPath) {
                 this.isDrawing = true;
                 this.currentPath = {
                     colorId: cellData.colorId,
                     path: [{row, col}],
                     startPoint: {row, col}
                 };
                 console.log('✅ 从路径重新开始绘制，颜色ID:', cellData.colorId);
                 this.clearPath(cellData.colorId);
             }
         } else {
             console.log('❌ 只能从端点或已有路径开始绘制');
         }
     }
     
     // 继续绘制到指定网格
     continueDrawingToCell(row, col) {
         if (!this.isDrawing || !this.currentPath) {
             console.log('🚫 无法继续绘制: isDrawing=' + this.isDrawing + ', currentPath=' + (this.currentPath ? '存在' : '不存在'));
             return;
         }
         
         const lastPos = this.currentPath.path[this.currentPath.path.length - 1];
         if (lastPos.row === row && lastPos.col === col) {
             console.log('🔄 目标位置与当前位置相同，忽略');
             return;
         }
         
         console.log(`🔗 尝试连接到网格 (${row}, ${col})`);
         this.debugGridState(row, col);
         
         // 检查移动是否有效（包括回退检测）
         const moveResult = this.isValidMove(lastPos, {row, col});
         
         if (moveResult === 'backtrack') {
             // 执行回退操作
             const backtrackIndex = this.currentPath.path.findIndex(p => p.row === row && p.col === col);
             console.log(`🔙 路径回退到位置 (${row}, ${col})，索引: ${backtrackIndex}`);
             this.backtrackToPosition(backtrackIndex);
             return;
         }
         
         if (!moveResult) {
             console.log('❌ 无效移动，忽略此次移动但继续绘制状态');
             return; // 忽略无效移动，但不中断绘制状态
         }
         
         const cellData = this.grid[row][col];
         
         // 只允许移动到空白格子或相同颜色的端点
         if (cellData.type === 'empty') {
             // 移动到空白格子
             this.currentPath.path.push({row, col});
             this.updatePathDisplay();
             console.log('✅ 成功绘制到空白格子');
         } else if (cellData.type === 'endpoint' && cellData.colorId === this.currentPath.colorId) {
             // 连接到相同颜色的端点
             this.currentPath.path.push({row, col});
             this.updatePathDisplay();
             console.log('✅ 成功连接到目标端点');
         } else {
             console.log('❌ 无效目标，忽略此次移动但继续绘制');
             // 不中断绘制，只是忽略这次移动，用户可以继续尝试其他方向
         }
     }
    
         // 继续绘制路径
     continueDrawing(event) {
         if (!this.isDrawing || !this.currentPath) return;
         
         const pos = this.getGridPosition(event);
         if (!pos) return;
         
         const lastPos = this.currentPath.path[this.currentPath.path.length - 1];
         if (lastPos.row === pos.row && lastPos.col === pos.col) return;
         
         console.log('尝试绘制到:', pos);
         
         // 严格的路径规则检查
         if (!this.isValidMove(lastPos, pos)) {
             console.log('❌ 无效移动，不符合规则');
             return;
         }
         
         const cellData = this.grid[pos.row][pos.col];
         console.log('目标格子类型:', cellData.type, '颜色ID:', cellData.colorId);
         
         // 只允许移动到空白格子或相同颜色的端点
         if (cellData.type === 'empty') {
             // 移动到空白格子
             this.currentPath.path.push(pos);
             this.updatePathDisplay();
             console.log('✅ 成功绘制到空白格子');
         } else if (cellData.type === 'endpoint' && cellData.colorId === this.currentPath.colorId) {
             // 连接到相同颜色的端点
             this.currentPath.path.push(pos);
             this.updatePathDisplay();
             console.log('✅ 成功连接到目标端点');
         } else {
             console.log('❌ 无法移动：目标不是空白格子或相同颜色端点');
         }
     }
     
     // 检查移动是否有效（优化版本）
     isValidMove(from, to) {
         console.log(`🔍 检查移动: (${from.row},${from.col}) -> (${to.row},${to.col})`);
         
         // 规则1: 必须相邻（不支持斜对角线，只能水平或垂直移动）
         if (!this.isAdjacent(from, to)) {
             console.log('❌ 不支持斜对角线或跳跃移动，只能移动到相邻格子');
             return false;
         }
         
         const targetCell = this.grid[to.row][to.col];
         console.log(`🎯 目标格子信息: type=${targetCell.type}, colorId=${targetCell.colorId}`);
         console.log(`🎨 当前路径颜色: ${this.currentPath.colorId}`);
         console.log(`📍 当前路径长度: ${this.currentPath.path.length}`);
         
         // 规则2: 检查是否已经在当前路径中（回退操作）
         const pathIndex = this.currentPath.path.findIndex(p => p.row === to.row && p.col === to.col);
         if (pathIndex !== -1) {
             console.log('🔙 检测到回退操作，路径索引:', pathIndex);
             return 'backtrack';
         }
         
         // 规则3: 不支持重叠其他颜色的路径
         if (targetCell.type === 'path' && targetCell.colorId !== this.currentPath.colorId) {
             console.log('❌ 不支持重叠其他颜色的路径');
             console.log(`   当前颜色: ${this.currentPath.colorId}, 目标颜色: ${targetCell.colorId}`);
             return false;
         }
         
         // 规则4: 允许移动到空白格子或相同颜色端点
         if (targetCell.type === 'empty') {
             console.log('✅ 移动到空白格子 - 有效');
             return true;
         } else if (targetCell.type === 'endpoint' && targetCell.colorId === this.currentPath.colorId) {
             console.log('✅ 连接到相同颜色端点 - 有效');
             return true;
         } else if (targetCell.type === 'path' && targetCell.colorId === this.currentPath.colorId) {
             console.log('🔄 移动到自己颜色的路径 - 可能是重新绘制');
             return true;
         } else {
             console.log('❌ 无效目标类型或颜色不匹配');
             console.log(`   期望: empty 或 endpoint/path(colorId=${this.currentPath.colorId})`);
             console.log(`   实际: ${targetCell.type}(colorId=${targetCell.colorId})`);
             return false;
         }
     }
    
    // 检查两个位置是否相邻（只允许水平或垂直相邻）
    isAdjacent(from, to) {
        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);
        
        // 只允许水平或垂直相邻，不允许斜对角
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    // 结束绘制
    endDrawing() {
        if (this.currentPath && this.currentPath.path.length > 1) {
            const lastPos = this.currentPath.path[this.currentPath.path.length - 1];
            const cellData = this.grid[lastPos.row][lastPos.col];
            
            // 检查是否连接到正确的端点
            if (cellData.type === 'endpoint' && cellData.colorId === this.currentPath.colorId) {
                // 成功连接，保存路径
                this.paths.set(this.currentPath.colorId, this.currentPath.path);
                this.updateGridFromPath(this.currentPath);
                this.checkGameCompletion();
            } else {
                // 连接失败，清除临时路径
                this.clearTemporaryPath();
            }
        }
        
        this.isDrawing = false;
        this.currentPath = null;
    }
    
    // 更新路径显示
    updatePathDisplay() {
        if (!this.currentPath) return;
        
        const colorConfig = this.endpointColors[this.currentPath.colorId];
        
        this.currentPath.path.forEach((pos, index) => {
            const cell = this.grid[pos.row][pos.col].element;
            if (cell && index > 0) {  // 跳过起始端点
                cell.style.backgroundColor = colorConfig.bg;
                cell.style.opacity = '0.8';  // 临时路径半透明
            }
        });
    }
    
    // 从路径更新网格
    updateGridFromPath(path) {
        const colorConfig = this.endpointColors[path.colorId];
        
        path.path.forEach((pos, index) => {
            if (index > 0 && index < path.path.length - 1) {  // 中间路径点
                this.grid[pos.row][pos.col] = {
                    type: 'path',
                    colorId: path.colorId,
                    element: this.grid[pos.row][pos.col].element
                };
                
                const cell = this.grid[pos.row][pos.col].element;
                if (cell) {
                    cell.style.backgroundColor = colorConfig.bg;
                    cell.style.opacity = '1';
                }
            }
        });
    }
    
    // 路径回退到指定位置
    backtrackToPosition(targetIndex) {
        if (!this.currentPath || targetIndex < 0 || targetIndex >= this.currentPath.path.length) return;
        
        // 清除回退位置之后的路径显示
        for (let i = targetIndex + 1; i < this.currentPath.path.length; i++) {
            const pos = this.currentPath.path[i];
            const cell = this.grid[pos.row][pos.col].element;
            if (cell && this.grid[pos.row][pos.col].type !== 'endpoint') {
                cell.style.backgroundColor = '#F4B58E33';  // 恢复默认背景
                cell.style.opacity = '1';
            }
        }
        
        // 截断路径到目标位置
        this.currentPath.path = this.currentPath.path.slice(0, targetIndex + 1);
        console.log(`🔙 路径已回退，当前长度: ${this.currentPath.path.length}`);
    }

    // 清除临时路径
    clearTemporaryPath() {
        if (!this.currentPath) return;
        
        this.currentPath.path.forEach((pos, index) => {
            if (index > 0) {  // 跳过起始端点
                const cell = this.grid[pos.row][pos.col].element;
                if (cell && this.grid[pos.row][pos.col].type !== 'endpoint') {
                    cell.style.backgroundColor = '#F4B58E33';  // 恢复默认背景
                    cell.style.opacity = '1';
                }
            }
        });
    }
    
    // 检查游戏完成
    checkGameCompletion() {
        // 检查所有端点是否连接
        let allConnected = true;
        let allGridsFilled = true;
        
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c].type === 'empty') {
                    allGridsFilled = false;
                    break;
                }
            }
            if (!allGridsFilled) break;
        }
        
        // 检查所有端点对是否连接
        this.endpoints.forEach(endpoint => {
            if (!this.paths.has(endpoint.colorId)) {
                allConnected = false;
            }
        });
        
        if (allConnected && allGridsFilled) {
            this.gameCompleted = true;
            this.handleGameComplete();
        }
    }
    
    // 清除指定颜色的路径
    clearPath(colorId) {
        const existingPath = this.paths.get(colorId);
        if (existingPath) {
            existingPath.forEach((pos, index) => {
                if (index > 0 && index < existingPath.length - 1) {  // 中间路径点
                    this.grid[pos.row][pos.col] = {
                        type: 'empty',
                        colorId: null,
                        element: this.grid[pos.row][pos.col].element
                    };
                    
                    const cell = this.grid[pos.row][pos.col].element;
                    if (cell) {
                        cell.style.backgroundColor = '#F4B58E33';  // 恢复默认背景
                    }
                }
            });
            this.paths.delete(colorId);
        }
    }
    
         // 游戏完成处理
     handleGameComplete() {
         console.log('🎉 恭喜完成关卡！');
         this.stopGameTimer();
         
         const container = document.querySelector('.game-grid-container');
         if (container) {
             container.classList.add('game-completed');
             container.style.pointerEvents = 'none';  // 禁用交互
         }
         
         // 显示成功遮罩
         this.showSuccessOverlay();
     }
     
     // 显示成功遮罩
     showSuccessOverlay() {
         const overlay = document.getElementById('game-result-overlay');
         const successResult = document.getElementById('success-result');
         const failureResult = document.getElementById('failure-result');
         
         if (overlay && successResult && failureResult) {
             // 隐藏失败结果，显示成功结果
             failureResult.style.display = 'none';
             successResult.style.display = 'flex';
             overlay.style.display = 'flex';
             
             console.log('✨ 显示通关成功遮罩');
             
             // 绑定下一关按钮
             const nextLevelBtn = document.getElementById('next-level-button');
             if (nextLevelBtn) {
                 nextLevelBtn.addEventListener('click', () => {
                     this.goToNextLevel();
                 });
                 console.log('🎯 下一关按钮绑定完成');
             }
         }
     }
     
     // 前往下一关
     goToNextLevel() {
         console.log('🚀 前往下一关');
         
         // 计算下一关编号
         const nextLevel = Math.min(this.currentLevel + 1, Object.keys(this.levelConfigs).length);  // 支持动态关卡数量
         
         // 保存通关状态到localStorage
         const gameProgress = {
             [`level${this.currentLevel}Completed`]: true,
             currentLevel: nextLevel,
             unlockedLevels: this.getUnlockedLevels(nextLevel)
         };
         
         localStorage.setItem('planetRepairGameProgress', JSON.stringify(gameProgress));
         console.log('💾 游戏进度已保存:', gameProgress);
         
         // 跳转到关卡选择页面
         window.location.href = 'levels.html';
     }
     
     // 获取解锁的关卡列表
     getUnlockedLevels(currentLevel) {
         const unlocked = [];
         for (let i = 1; i <= currentLevel; i++) {
             unlocked.push(i);
         }
         return unlocked;
     }
     
     // 显示失败遮罩
     showFailureOverlay() {
         const overlay = document.getElementById('game-result-overlay');
         const successResult = document.getElementById('success-result');
         const failureResult = document.getElementById('failure-result');
         
         if (overlay && successResult && failureResult) {
             // 隐藏成功结果，显示失败结果
             successResult.style.display = 'none';
             failureResult.style.display = 'flex';
             overlay.style.display = 'flex';
             
             console.log('💥 显示通关失败遮罩');
             
             // 绑定再来一局按钮
             const restartBtn = document.getElementById('restart-button');
             if (restartBtn) {
                 restartBtn.addEventListener('click', () => {
                     this.restartLevel();
                 });
             }
         }
     }
     
     // 隐藏结果遮罩
     hideResultOverlay() {
         const overlay = document.getElementById('game-result-overlay');
         if (overlay) {
             overlay.style.display = 'none';
         }
     }
     
     // 重新开始关卡（完全重置包括倒计时）
     restartLevel() {
         console.log('🔄 重新开始关卡');
         
         // 停止计时器
         this.stopGameTimer();
         
         // 重置所有游戏状态
         this.paths.clear();
         this.currentPath = null;
         this.isDrawing = false;
         this.gameCompleted = false;
         this.gameStarted = false;
         this.remainingTime = this.totalTime;  // 重置为60秒
         
         // 隐藏结果遮罩
         this.hideResultOverlay();
         
         // 重新初始化
         this.initGrid();
         this.placeEndpoints();
         this.updateDisplay();
         this.updateCountdownDisplay();
         
         // 恢复交互
         const container = document.querySelector('.game-grid-container');
         if (container) {
             container.style.pointerEvents = 'auto';
             container.style.opacity = '1';
             container.classList.remove('game-completed');
         }
         
         // 重新开始计时
         this.startGameTimer();
     }
    
         // 开始游戏计时
     startGameTimer() {
         console.log('⏰ 开始60秒倒计时！');
         this.gameStarted = true;
         
         this.timerInterval = setInterval(() => {
             this.remainingTime--;
             this.updateCountdownDisplay();
             
             if (this.remainingTime <= 0) {
                 this.handleTimeUp();
             } else if (this.remainingTime <= 10) {
                 // 最后10秒加速闪烁
                 this.flashCountdown();
             }
         }, 1000);
     }
     
     // 停止计时器
     stopGameTimer() {
         if (this.timerInterval) {
             clearInterval(this.timerInterval);
             this.timerInterval = null;
         }
     }
     
     // 更新倒计时显示
     updateCountdownDisplay() {
         const seconds = Math.max(0, this.remainingTime);
         const digits = seconds.toString().padStart(3, '0').split('');
         
         const digitElements = document.querySelectorAll('.digit-text');
         if (digitElements.length >= 3) {
             digitElements[0].textContent = digits[0];  // 百位
             digitElements[1].textContent = digits[1];  // 十位
             digitElements[2].textContent = digits[2];  // 个位
         }
         
         // 时间紧急时改变颜色
         const countdownContainer = document.querySelector('.countdown-container');
         if (countdownContainer) {
             if (seconds <= 10) {
                 countdownContainer.style.backgroundColor = '#FFB3B3';  // 红色警告
             } else if (seconds <= 30) {
                 countdownContainer.style.backgroundColor = '#FFE4B3';  // 黄色提醒
             } else {
                 countdownContainer.style.backgroundColor = '#FFDEBC';  // 默认色
             }
         }
     }
     
     // 倒计时闪烁效果
     flashCountdown() {
         const countdownContainer = document.querySelector('.countdown-container');
         if (countdownContainer) {
             countdownContainer.style.animation = 'countdownFlash 0.5s ease-in-out';
             setTimeout(() => {
                 countdownContainer.style.animation = '';
             }, 500);
         }
     }
     
     // 时间到处理
     handleTimeUp() {
         console.log('⏰ 时间到！游戏结束');
         this.stopGameTimer();
         this.gameCompleted = true;
         this.isDrawing = false;
         this.currentPath = null;
         
         // 禁用所有交互
         const container = document.querySelector('.game-grid-container');
         if (container) {
             container.style.pointerEvents = 'none';
             container.style.opacity = '0.7';
         }
         
         // 显示失败遮罩
         this.showFailureOverlay();
     }
     
     // 重置游戏
     resetGame() {
         console.log('🔄 重置游戏（倒计时继续）');
         
         // 重置游戏状态（但保留倒计时）
         this.paths.clear();
         this.currentPath = null;
         this.isDrawing = false;
         this.gameCompleted = false;
         
         // 重新初始化网格和端点
         this.initGrid();
         this.placeEndpoints();
         this.updateDisplay();
         
         // 恢复交互（如果时间没到）
         const container = document.querySelector('.game-grid-container');
         if (container && this.remainingTime > 0) {
             container.style.pointerEvents = 'auto';
             container.style.opacity = '1';
         }
     }
}

// 全局游戏实例
let flowFreeGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化游戏...');
    
    // 等待base.js加载完成
    if (typeof GameScaleManager !== 'undefined') {
        initGame();
    } else {
        let attempts = 0;
        const checkAndInit = () => {
            attempts++;
            if (typeof GameScaleManager !== 'undefined') {
                initGame();
            } else if (attempts < 50) {  // 最多等待5秒
                setTimeout(checkAndInit, 100);
            } else {
                console.error('GameScaleManager加载超时，使用默认配置');
                initGame();
            }
        };
        setTimeout(checkAndInit, 100);
    }
});

function initGame() {
    console.log('开始初始化游戏...');
    
    // 延迟初始化，确保DOM完全准备好
    setTimeout(() => {
        // 确保网格容器存在
        const container = document.querySelector('.game-grid-container');
        if (!container) {
            console.error('游戏网格容器未找到！');
            return;
        }
        
        console.log('找到游戏容器，创建游戏实例...');
        flowFreeGame = new FlowFreeGame();
        console.log('游戏实例创建完成');
        
        // 绑定重置按钮
        const resetButton = document.querySelector('.reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                console.log('重置游戏');
                flowFreeGame.resetGame();
            });
            console.log('重置按钮绑定完成');
        }
        
        // 绑定提示按钮
        const hintButton = document.querySelector('.hint-button');
        if (hintButton) {
            hintButton.addEventListener('click', () => {
                console.log('💡 提示功能待开发');
            });
            console.log('提示按钮绑定完成');
        }
        
        // 添加简单的容器点击测试
        container.addEventListener('click', (e) => {
            console.log('=== 容器点击测试 ===');
            console.log('事件目标:', e.target);
            console.log('事件当前目标:', e.currentTarget);
            
            if (flowFreeGame) {
                const pos = flowFreeGame.getGridPosition(e);
                console.log('计算的网格位置:', pos);
                
                if (pos) {
                    const cellData = flowFreeGame.grid[pos.row][pos.col];
                    console.log('网格数据:', cellData);
                }
            }
        });
        
        console.log('所有事件绑定完成！可以开始测试交互。');
    }, 500);  // 延迟500ms确保DOM稳定
}
