/* ============================================
   毛宝昌 · 个人主页 交互脚本
   功能：光标跟随 · 主题切换 · 打字效果 · 
         数字滚动 · 筛选过滤 · 滚动动画
   ============================================ */

/* --- 读取管理后台数据 --- */
const STORAGE_KEY = 'siteData_v1';
let siteData = null;

function loadSiteData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            siteData = JSON.parse(raw);
            return true;
        }
    } catch (e) {}
    return false;
}

function applySiteData() {
    if (!siteData) return;

    // 首页信息
    if (siteData.hero) {
        const greeting = document.querySelector('.hero-greeting');
        if (greeting) greeting.textContent = siteData.hero.greeting || '你好，我是';

        const name = document.querySelector('.hero-name');
        if (name) name.textContent = siteData.hero.name || '毛宝昌';

        const desc = document.querySelector('.hero-desc');
        if (desc) desc.textContent = siteData.hero.desc || '';

        // 更新打字机效果
        if (siteData.hero.typing && siteData.hero.typing.length > 0) {
            window.TYPING_TEXTS = siteData.hero.typing;
        }

        // 更新导航栏 logo（固定为英文大写）
        const navLogo = document.querySelector('.nav-logo');
        if (navLogo) {
            navLogo.textContent = 'MAO BAO CHANG';
        }

        // 更新 footer logo（固定为英文大写）
        const footerLogo = document.querySelector('.footer-logo');
        if (footerLogo) {
            footerLogo.textContent = 'MAO BAO CHANG';
        }

        // 更新 footer 年份
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom && siteData.hero.name) {
            footerBottom.innerHTML = '&copy; 2026 ' + siteData.hero.name + '. All rights reserved.';
        }
    }

    // 关于我
    if (siteData.about) {
        const aboutText = document.querySelector('.about-text');
        if (aboutText && siteData.about.paragraphs) {
            aboutText.innerHTML = siteData.about.paragraphs.map(p => '<p>' + p + '</p>').join('\n');
        }

        // 统计卡片
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length > 0 && siteData.about.stats) {
            siteData.about.stats.forEach((s, i) => {
                if (statCards[i]) {
                    const numEl = statCards[i].querySelector('.stat-number');
                    const labelEl = statCards[i].querySelector('.stat-label');
                    if (numEl) {
                        numEl.setAttribute('data-target', s.num);
                        numEl.textContent = '0';
                    }
                    if (labelEl) labelEl.textContent = s.label;
                }
            });
        }
    }

    // 作品列表
    if (siteData.works && siteData.works.length > 0) {
        const worksGrid = document.querySelector('.works-grid');
        if (worksGrid) {
            const worksHTML = siteData.works.map(w => {
                const imgHTML = w.image
                    ? '<img src="' + w.image + '" alt="' + w.title + '" />'
                    : '<div class="work-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>';
                const techHTML = w.tech.map(t => '<span>' + t + '</span>').join('');
                return '<article class="work-card" data-category="' + w.category + '">' +
                    '<div class="work-card-image">' + imgHTML +
                        '<div class="work-overlay"><span class="work-view">查看详情</span></div></div>' +
                    '<div class="work-card-info">' +
                        '<span class="work-tag">' + w.tag + '</span>' +
                        '<h3 class="work-title">' + w.title + '</h3>' +
                        '<p class="work-desc">' + w.desc + '</p>' +
                        '<div class="work-tech">' + techHTML + '</div></div></article>';
            }).join('\n');
            worksGrid.innerHTML = worksHTML;
        }
    }

    // 联系信息
    if (siteData.contact) {
        const emailLink = document.querySelector('.contact-card a[href^="mailto"]');
        if (emailLink) {
            emailLink.href = 'mailto:' + siteData.contact.email;
            emailLink.textContent = siteData.contact.email;
        }

        const wechatSpan = document.querySelectorAll('.contact-card span')[1];
        if (wechatSpan) wechatSpan.textContent = siteData.contact.wechat;

        const githubLink = document.querySelector('.contact-card a[href^="https://github"]');
        if (githubLink) {
            githubLink.href = 'https://github.com/' + siteData.contact.github;
            githubLink.textContent = '@' + siteData.contact.github;
        }
    }

    // 头像
    if (siteData.avatar) {
        const avatarPlaceholder = document.querySelector('.hero-avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.innerHTML = '<img src="' + siteData.avatar + '" alt="毛宝昌" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 先加载管理后台数据
    const hasData = loadSiteData();
    if (hasData) {
        applySiteData();
    }

    initCursor();
    initTheme();
    initNavbar();
    initTyping();
    initScrollReveal();
    initCountUp();
    initFilter();
    initSmoothScroll();
});

/* --- 自定义光标 --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 可交互元素
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .filter-btn, .work-card, .contact-card, .stat-card'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    function animate() {
        // 光标小球：快速跟随
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX - 4 + 'px';
        cursor.style.top = cursorY - 4 + 'px';

        // 光标跟随圈：缓慢跟随
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX - 16 + 'px';
        follower.style.top = followerY - 16 + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 主题切换 --- */
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // 检查本地存储
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

/* --- 导航栏滚动效果 --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* --- 打字效果 --- */
function initTyping() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    const texts = window.TYPING_TEXTS || [
        '前端开发',
        'UI 设计师',
        '创意技术人',
        '终身学习者'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const current = texts[textIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            // 打完一个词，等待
            isWaiting = true;
            speed = 2000;
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                type();
            }, speed);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 300;
        }

        if (!isWaiting) {
            setTimeout(type, speed);
        }
    }

    setTimeout(type, 800);
}

/* --- 滚动显示动画 --- */
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    // 为作品卡片也添加动画
    const cards = document.querySelectorAll('.work-card');
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 数字滚动动画 --- */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 1500;
                const start = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.round(eased * target);
                    el.textContent = target === 100 ? current + '%' : current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

/* --- 作品筛选 --- */
function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            workCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* --- 平滑滚动（考虑导航栏高度） --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
