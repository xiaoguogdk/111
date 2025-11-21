// 💖 情话库：已扩充至更多温暖、可爱的句子
const loveWords = [
    "遇见你真好", "想把星星摘给你", "你笑起来真好看", "今天的风很甜", 
    "想见你", "心动的感觉", "星河皆是你", "所有的温柔都给你", 
    "我在想你", "你是我的小确幸", "未来的路一起走", "想和你去看海",
    "喜欢你", "每天都想见到你", "你是我眼里的光", "超级超级喜欢你",
    "想和你虚度时光", "你最可爱啦", "所有的美好都与你有关", "想和你去吃好吃的",
    "For You", "Love You", "My Girl", "只有你", "心跳的声音",
    "你是我的人间理想", "想和你一起变老", "可爱的你", "温柔的你", "最好的你",
    "全世界最喜欢你", "想牵你的手", "不仅是喜欢", "还有深爱", "你是独一无二的",
    "想把最好的给你", "一见钟情", "再见倾心", "满眼都是你", "想做你的依靠",
    "Always", "Forever", "Sweet", "Honey", "Darling",
    "你是我的唯一", "想和你去旅行", "想给你做饭", "想听你的声音", "晚安，好梦",
    "和你在一起的时光", "都闪闪发亮", "月亮不会奔你而来", "但我会",
    "做你的猫", "想被你摸摸头", "像夏天的冰激凌", "像冬天的烤红薯",
    "你特别好", "我特别喜欢你", "不管多久", "我都等你",
    "想和你看日落", "收集世间温柔", "去见你的路上", "风都是甜的",
    "你不用改变", "我就喜欢这样的你", "你的名字", "是我最短的情诗"
];

// 🎨 糖果配色库：让爱心看起来更缤纷
const candyColors = [
    'rgba(236, 72, 153, 0.85)', // 经典粉
    'rgba(244, 114, 182, 0.85)', // 浅粉
    'rgba(167, 139, 250, 0.85)', // 香芋紫
    'rgba(251, 146, 60, 0.85)',  // 奶油橘
    'rgba(250, 204, 21, 0.85)',  // 柠檬黄
    'rgba(52, 211, 153, 0.85)',  // 薄荷绿
    'rgba(96, 165, 250, 0.85)'   // 天空蓝
];

// 获取 DOM 元素
const sceneIntro = document.getElementById('scene-intro');
const sceneMain = document.getElementById('scene-main');
const sceneModal = document.getElementById('scene-modal');
const envelopeTrigger = document.getElementById('envelope-trigger');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');
const heartSeal = document.getElementById('heart-seal');
const bgm = document.getElementById('bgm');
const heart3d = document.getElementById('heart-3d');
const btnConfess = document.getElementById('btn-confess');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const modalCard = document.getElementById('modal-card');

let isRotated = false; // 标记是否已经进入主场景

// ==========================================
// 1. 开场交互：拆信
// ==========================================
envelopeTrigger.addEventListener('click', () => {
    if (isRotated) return;
    isRotated = true;

    // 播放音乐 (浏览器的自动播放策略要求必须有用户交互)
    bgm.volume = 0.5;
    bgm.play().catch(() => console.log("User interaction needed for audio"));

    // 1. 盖子打开
    flap.style.transform = 'rotateX(180deg)';
    flap.style.zIndex = 0; // 翻开后层级变低

    // 2. 爱心封口消失
    heartSeal.style.opacity = 0;
    heartSeal.style.transform = 'scale(0)';

    // 3. 信纸抽出
    setTimeout(() => {
        letter.style.transform = 'translateY(-80px)';
        letter.style.zIndex = 25;
    }, 300);

    // 4. 场景切换
    setTimeout(() => {
        // 淡出开场页
        sceneIntro.style.opacity = 0;
        sceneIntro.style.pointerEvents = 'none';
        
        // 淡入主场景
        sceneMain.style.opacity = 1;
        sceneMain.style.pointerEvents = 'auto';
        
        // 开始生成并旋转 3D 爱心
        initHeart3D();
        animateHeart();
    }, 1500);
});

// ==========================================
// 2. 3D 爱心生成逻辑
// ==========================================
let tags = []; // 存储所有的文字标签元素
let mouseX = 0;
let mouseY = 0;
let isDragging = false;
let rotationX = 0;
let rotationY = 0;

function initHeart3D() {
    // 这种爱心形状的参数方程
    // r(u, v) where u in [0, 2PI], v in [0, PI]
    
    const totalTags = 80; // 总共生成的文字数量
    
    for (let i = 0; i < totalTags; i++) {
        const tag = document.createElement('div');
        tag.className = 'heart-tag';
        tag.textContent = loveWords[i % loveWords.length];
        
        // 随机计算位置：使用爱心方程
        // 这里我们用简单的分布算法：随机角度
        // 核心方程：
        // x = 16 * sin(t)^3
        // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
        // 为了做成 3D，我们给它一个厚度 z
        
        let t = Math.random() * Math.PI * 2;
        let z_layer = (Math.random() - 0.5) * 200; // 深度厚度
        
        // 原始二维爱心坐标
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); 
        
        // 缩放系数
        const scale = 12; 
        
        x *= scale;
        y *= scale;
        
        // 为了让它是个立体的“胖”爱心，我们不仅是在 Z 轴拉伸，
        // 还可以让 xy 平面根据 z 的距离稍微缩小一点，形成圆润感
        // 简单的球形分布太普通，我们保持爱心轮廓
        
        // 稍微随机打散一点点，不要太整齐
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;

        // 保存初始坐标
        tag.dataset.x = x;
        tag.dataset.y = y;
        tag.dataset.z = z_layer;

        // 设置随机颜色和大小
        const color = candyColors[Math.floor(Math.random() * candyColors.length)];
        tag.style.color = color;
        tag.style.fontSize = (14 + Math.random() * 14) + 'px'; // 稍微调大一点字体
        // 初始 z-index 确保层次感
        tag.style.zIndex = Math.floor(z_layer + 200);

        // 交互：点击文字放大
        tag.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发背景拖动
            // 先复原其他
            document.querySelectorAll('.heart-tag').forEach(t => {
                t.style.transform = t.style.transform.replace('scale(2)', 'scale(1)');
                t.style.textShadow = 'none';
                t.style.zIndex = Math.floor(parseFloat(t.dataset.z) + 200);
            });
            
            // 高亮当前
            const currentTransform = tag.style.transform;
            if (!currentTransform.includes('scale(2)')) {
                tag.style.transform = `${currentTransform} scale(2)`;
                tag.style.zIndex = 9999;
                tag.style.textShadow = `0 0 15px ${color}`;
            }
        });

        heart3d.appendChild(tag);
        tags.push(tag);
    }
}

// 动画循环：不断更新旋转
function animateHeart() {
    // 加上基础自动旋转
    if (!isDragging) {
        rotationY += 0.2;
    }

    heart3d.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    // 更新每个标签的朝向：始终面向屏幕 (Billboard effect)
    // 这一步是可选的，如果不加，文字会跟着翻转倒立。
    // 为了可读性，我们通常希望文字始终正对观众，或者至少不倒立。
    // 但在 CSS 3D 中，直接 rotate 每个元素抵消父容器旋转开销较大。
    // 既然是“氛围感”，文字倒立也没关系，反而更有真实 3D 感。
    
    requestAnimationFrame(animateHeart);
}

// 触摸/鼠标交互逻辑
const container = document.getElementById('heart-wrapper');
let lastX, lastY;

// 统一处理开始事件
function handleStart(x, y) {
    isDragging = true;
    lastX = x;
    lastY = y;
}

// 统一处理移动事件
function handleMove(x, y) {
    if (!isDragging) return;
    
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    
    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5; // 注意 Y 轴移动影响 X 轴旋转
    
    lastX = x;
    lastY = y;
}

// 统一处理结束事件
function handleEnd() {
    isDragging = false;
}

// 鼠标事件
container.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
window.addEventListener('mouseup', handleEnd);

// 触摸事件
container.addEventListener('touchstart', e => {
    // e.preventDefault(); // 防止滚动，但可能会影响点击，视情况而定
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchmove', e => {
    // e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchend', handleEnd);


// 更新所有标签位置 (初始化时执行一次即可，因为后续是旋转容器)
function updateTagsPosition() {
    tags.forEach(tag => {
        const x = parseFloat(tag.dataset.x);
        const y = parseFloat(tag.dataset.y);
        const z = parseFloat(tag.dataset.z);
        
        // 使用 translate3d 设置位置
        // 关键：我们要让文字在空间中分布
        tag.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    });
}
// 确保在生成后调用一次
const observer = new MutationObserver(() => {
    updateTagsPosition();
    observer.disconnect();
});
observer.observe(heart3d, { childList: true });


// ==========================================
// 3. 表白弹窗交互
// ==========================================
btnConfess.addEventListener('click', () => {
    sceneModal.style.opacity = 1;
    sceneModal.style.pointerEvents = 'auto';
    modalCard.style.transform = 'scale(1)';
});

const sceneFinale = document.getElementById('scene-finale');
const finaleTitle = document.getElementById('finale-title');
const finaleSubtitle = document.getElementById('finale-subtitle');
const drawingHeart = document.getElementById('drawing-heart');
const finaleDate = document.getElementById('finale-date');
const currentDateSpan = document.getElementById('current-date');

// “好呀” 按钮
btnYes.addEventListener('click', () => {
    // 1. 隐藏弹窗和主场景
    sceneModal.style.opacity = 0;
    sceneModal.style.pointerEvents = 'none';
    sceneMain.style.opacity = 0;
    
    // 2. 显示终章场景
    sceneFinale.style.opacity = 1;
    
    // 设置当前日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    currentDateSpan.textContent = `${year}.${month}.${day}`;

    setTimeout(() => {
        // 2.1 先画心
        drawingHeart.classList.remove('opacity-0');
        drawingHeart.querySelector('path').style.animationPlayState = 'running';
        
        // 2.2 文字浮现
        setTimeout(() => {
            finaleTitle.classList.remove('opacity-0', 'translate-y-10');
            finaleSubtitle.classList.remove('opacity-0', 'translate-y-10');
        }, 800);

        // 2.3 日期浮现
        finaleDate.classList.remove('opacity-0');
        
        // 触发樱花雨
        createSakura();
    }, 500);
});

// “不要” 按钮 - 调皮跑路逻辑
btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', moveButton); // 移动端触摸也跑

function moveButton(e) {
    const x = Math.random() * 200 - 100; // -100 到 100
    const y = Math.random() * 200 - 100;
    
    // 限制移动范围，别跑出屏幕太远
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
}

// ==========================================
// 4. 特效：漫天樱花
// ==========================================
function createSakura() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = 200; 
    
    const petals = [];
    // 樱花配色：从浅粉到深粉
    const colors = ['#ffd7e6', '#ffc0cb', '#ffb7c5', '#ff9eb5']; 
    
    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 15 + 8; // 花瓣大小
            this.speedY = Math.random() * 1.5 + 0.5; // 下落速度
            this.speedX = Math.random() * 2 - 1; // 初始横向漂移
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            // 摇摆参数
            this.oscillation = Math.random() * 2; 
            this.oscillationSpeed = Math.random() * 0.05;
        }
        
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.oscillation) + this.speedX * 0.5;
            this.oscillation += this.oscillationSpeed;
            this.rotation += this.rotationSpeed;
            
            // 循环飘落
            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.x < -20) this.x = canvas.width + 20;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8;
            
            // 绘制花瓣形状 (贝塞尔曲线)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
            ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            
            ctx.restore();
        }
    }

    // 初始化花瓣数量
    const petalCount = 60;
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布，不需要拖尾了
        
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 窗口大小改变时重置 canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
