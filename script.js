// Create a starry background using pure JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.querySelector('.stars');
    
    // Clear any existing content or styles
    starsContainer.style.backgroundImage = 'none';
    
    // Increase the number of stars since we're not using CSS background
    const starsCount = 200;
    
    // Create a more natural distribution of stars
    // Divide the screen into sectors for more even distribution
    const sectors = 20;
    const sectorsX = sectors;
    const sectorsY = sectors;
    
    // Track which sectors already have stars to avoid clustering
    const occupiedSectors = new Set();
    
    // Create stars with better distribution
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Find an unoccupied sector if possible
        let sectorX, sectorY, sectorKey;
        let attempts = 0;
        
        do {
            sectorX = Math.floor(Math.random() * sectorsX);
            sectorY = Math.floor(Math.random() * sectorsY);
            sectorKey = `${sectorX}-${sectorY}`;
            attempts++;
            
            // After several attempts, just place it randomly
            if (attempts > 10) break;
        } while (occupiedSectors.has(sectorKey) && occupiedSectors.size < sectorsX * sectorsY * 0.7);
        
        // Mark this sector as occupied
        occupiedSectors.add(sectorKey);
        
        // Position within the sector (with some randomness)
        const baseX = (sectorX / sectorsX) * 150 - 25;
        const baseY = (sectorY / sectorsY) * 150 - 25;
        const offsetX = (Math.random() * (100 / sectorsX)) * 0.8;
        const offsetY = (Math.random() * (100 / sectorsY)) * 0.8;
        
        star.style.left = `${baseX + offsetX}%`;
        star.style.top = `${baseY + offsetY}%`;
        
        // Vary star sizes more dramatically
        const sizeCategory = Math.random();
        let size;
        
        if (sizeCategory > 0.97) {
            // Very large stars (rare)
            size = Math.random() * 3 + 4;
            star.style.boxShadow = `0 0 ${size * 4}px rgba(255, 255, 255, 0.9)`;
        } else if (sizeCategory > 0.85) {
            // Medium-large stars
            size = Math.random() * 2 + 2.5;
            star.style.boxShadow = `0 0 ${size * 3}px rgba(255, 255, 255, 0.7)`;
        } else if (sizeCategory > 0.5) {
            // Medium stars
            size = Math.random() * 1.5 + 1.5;
            star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`;
        } else {
            // Small stars (common)
            size = Math.random() * 1 + 0.8;
            star.style.boxShadow = `0 0 ${size}px rgba(255, 255, 255, 0.4)`;
        }
        
        star.style.width = `${size}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = '#fff';
        star.style.borderRadius = '50%';
        star.style.position = 'absolute';
        
        // Create clusters of stars occasionally
        if (Math.random() > 0.85) {
            // Add 1-4 smaller stars nearby
            const clusterSize = Math.floor(Math.random() * 4) + 1;
            for (let j = 0; j < clusterSize; j++) {
                const smallStar = document.createElement('div');
                smallStar.classList.add('star');
                
                // Position close to the main star
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 3 + 1; // 1-4% distance
                const smallStarX = parseFloat(star.style.left) + Math.cos(angle) * distance;
                const smallStarY = parseFloat(star.style.top) + Math.sin(angle) * distance;
                
                smallStar.style.left = `${smallStarX}%`;
                smallStar.style.top = `${smallStarY}%`;
                
                // Smaller size
                const smallSize = Math.random() * 1 + 0.3;
                smallStar.style.width = `${smallSize}px`;
                smallStar.style.height = smallStar.style.width;
                smallStar.style.backgroundColor = '#fff';
                smallStar.style.borderRadius = '50%';
                smallStar.style.position = 'absolute';
                
                // Subtle glow
                smallStar.style.boxShadow = `0 0 ${smallSize}px rgba(255, 255, 255, 0.3)`;
                
                // Initial opacity
                smallStar.style.opacity = Math.random() * 0.4 + 0.2;
                
                // Add twinkling
                twinkleStar(smallStar);
                
                starsContainer.appendChild(smallStar);
            }
        }
        
        // Initial opacity
        star.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Add custom twinkling with JavaScript
        twinkleStar(star);
        
        starsContainer.appendChild(star);
    }
    
    // Parallax effect for stars when scrolling
    window.addEventListener('scroll', function() {
        // 移除或注释掉这行代码，使星星保持固定
        // const scrollPosition = window.scrollY;
        // starsContainer.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    });
    
    // Function to create a more natural twinkling effect
    function twinkleStar(star) {
        // Shorter duration for more noticeable effect (1.5-3.5 seconds)
        const duration = Math.random() * 2000 + 1500;
        // Higher contrast in opacity (0.1 to 1)
        const targetOpacity = Math.random() > 0.7 ? 
                              Math.random() * 0.9 + 0.1 : // Most stars normal brightness
                              Math.random() * 0.5 + 0.5;  // Some stars extra bright
        // Current opacity
        const currentOpacity = parseFloat(star.style.opacity);
        
        // Animate opacity
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Use more dramatic easing for more noticeable twinkle
                const easing = Math.sin(progress * Math.PI);
                const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * easing;
                star.style.opacity = newOpacity;
                
                // Occasionally add a color tint for extra effect
                if (Math.random() > 0.995) {
                    const hue = Math.floor(Math.random() * 60); // Slight blue/white variation
                    star.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
                } else {
                    star.style.backgroundColor = '#fff';
                }
                
                requestAnimationFrame(animate);
            } else {
                // Shorter delay between twinkles
                setTimeout(() => twinkleStar(star), Math.random() * 500);
            }
        }
        
        requestAnimationFrame(animate);
    }
});

// Text animation with GSAP and SplitType
window.addEventListener("DOMContentLoaded", (event) => {
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  
  // Get all elements with the scrub-each-word attribute
  document.querySelectorAll("[scrub-each-word]").forEach(function(element) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "top 30%",
        scrub: 0.6, // 添加平滑过渡
      }
    });
    
    // Find all word elements within the current element
    const words = element.querySelectorAll(".word");
    tl.from(words, { 
      opacity: 0.1,  // 提高初始透明度，使变化更柔和
      duration: 1.2, // 增加动画持续时间
      ease: "power2.out", // 使用更柔和的缓动函数
      stagger: { 
        each: 0.3,  // 减少单词之间的延迟
        ease: "sine.inOut" // 为交错添加缓动
      } 
    });
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
});

// 为 feature-box-img 添加滚动显示效果，调整显示和隐藏的时机
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有特性图片
    const featureImages = document.querySelectorAll('.feature-box-img');
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素进入视口时
            if (entry.isIntersecting) {
                // 添加 visible 类
                entry.target.classList.add('visible');
            } else {
                // 当元素离开视口时
                entry.target.classList.remove('visible');
            }
        });
    }, {
        // 提高阈值，使元素需要更多部分进入视口才触发
        threshold: 0.5,
        // 调整根边距，使元素更靠近视口中心时触发
        // 上下各减少 200px 的可见区域，使元素需要更靠近中央才显示
        rootMargin: '-200px 0px'
    });
    
    // 开始观察每个图片
    featureImages.forEach(image => {
        observer.observe(image);
    });
});

// 为 feature-box-img 添加反向视差效果
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有特性图片
    const featureImages = document.querySelectorAll('.feature-box-img');
    
    // 存储上一次滚动位置
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 存储每个图片的初始位置
    const imagePositions = {};
    featureImages.forEach((img, index) => {
        imagePositions[index] = 0;
    });
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 获取当前滚动位置
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 判断滚动方向
        const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        
        // 计算滚动距离
        const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
        
        // 视差系数 - 控制移动速度
        const parallaxFactor = 0.3;
        
        // 为每个图片应用视差效果
        featureImages.forEach((img, index) => {
            // 只对可见的图片应用效果
            if (img.classList.contains('visible')) {
                // 根据滚动方向更新位置
                if (scrollDirection === 'down') {
                    // 向下滚动时，图片向上移动
                    imagePositions[index] -= scrollDelta * parallaxFactor;
                } else {
                    // 向上滚动时，图片向下移动
                    imagePositions[index] += scrollDelta * parallaxFactor;
                }
                
                // 限制移动范围，防止图片移动过远
                const maxOffset = 100; // 最大偏移量（像素）
                imagePositions[index] = Math.max(Math.min(imagePositions[index], maxOffset), -maxOffset);
                
                // 应用变换
                img.style.transform = `translateY(${imagePositions[index]}px)`;
            }
        });
        
        // 更新上一次滚动位置
        lastScrollTop = currentScrollTop;
    }, { passive: true }); // 使用 passive 选项提高滚动性能
});

// 为 Use Cases 添加无限滚动 Marquee 效果
document.addEventListener('DOMContentLoaded', function() {
    const marqueeContent = document.querySelector('.marquee-content');
    
    if (marqueeContent) {
        // 移除鼠标悬停暂停动画的代码
        /*
        marqueeContent.addEventListener('mouseenter', () => {
            marqueeContent.style.animationPlayState = 'paused';
        });
        
        marqueeContent.addEventListener('mouseleave', () => {
            marqueeContent.style.animationPlayState = 'running';
        });
        */
        
        // 确保有足够的项目进行无缝滚动
        const items = marqueeContent.querySelectorAll('.marquee-item');
        const itemCount = items.length;
        const itemWidth = items[0].offsetWidth;
        const containerWidth = marqueeContent.offsetWidth;
        
        // 如果项目总宽度不足以填满两倍容器宽度，则复制更多项目
        if (itemCount * itemWidth < containerWidth * 2) {
            const cloneCount = Math.ceil((containerWidth * 2) / (itemCount * itemWidth)) - 1;
            
            for (let i = 0; i < cloneCount; i++) {
                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    marqueeContent.appendChild(clone);
                });
            }
        }
    }
});

// 汉堡菜单功能
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.close-button');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    
    // 汉堡菜单点击事件
    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // 关闭按钮点击事件
    closeButton.addEventListener('click', function() {
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
    
    // 点击导航链接后关闭菜单
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // 点击页面空白处关闭菜单
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileMenu.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}); 