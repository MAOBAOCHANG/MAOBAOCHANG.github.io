/* ============================================
   网站管理后台 - 核心逻辑
   功能：登录验证 · 数据编辑 · 作品管理 · 导出
   ============================================ */

// ============ 配置 ============
const ADMIN_PASSWORD = 'mao2026';   // ← 管理密码，可自行修改
const STORAGE_KEY = 'siteData_v1';

// ============ 默认数据 ============
const defaultData = {
    hero: {
        greeting: '你好，我是',
        name: '毛宝昌',
        typing: ['前端开发', 'UI 设计师', '创意技术人', '终身学习者'],
        desc: '热爱创造，专注于打造优雅的数字体验。在代码与设计之间寻找平衡，让每一个像素都有意义。'
    },
    about: {
        paragraphs: [
            '你好！我是<strong>毛宝昌</strong>，一个充满热情的技术创作者。',
            '我享受将想法变为现实的过程——无论是开发一个流畅的 Web 应用，还是设计一个赏心悦目的用户界面。我相信好的作品应该兼顾<em>形式与功能</em>，在细节中体现用心。',
            '在技术飞速迭代的时代，我保持好奇心，持续学习，致力于打造经得起时间考验的作品。'
        ],
        stats: [
            { num: 5, label: '完成项目' },
            { num: 3, label: '技术方向' },
            { num: 100, label: '% 热情' }
        ]
    },
    works: [
        {
            id: Date.now(),
            title: '个人品牌网站',
            category: 'web',
            tag: 'Web 开发',
            desc: '极简风格的个人主页，支持暗色模式与响应式布局，注重交互动效与用户体验。',
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            image: ''
        },
        {
            id: Date.now() + 1,
            title: '创意作品集',
            category: 'web',
            tag: 'Web 开发',
            desc: '交互式作品展示平台，使用流畅的过渡动画与网格布局，让作品呈现更具视觉冲击力。',
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            image: ''
        },
        {
            id: Date.now() + 2,
            title: 'UI 设计系统',
            category: 'design',
            tag: '设计',
            desc: '一套简洁统一的组件设计规范，包含配色方案、字体层级与间距系统，确保视觉一致性。',
            tech: ['Figma', 'Design System'],
            image: ''
        },
        {
            id: Date.now() + 3,
            title: '创意实验',
            category: 'other',
            tag: '其他',
            desc: '探索前沿技术的实验性项目，不断尝试新的交互方式与视觉表达，突破常规边界。',
            tech: ['实验', '创意'],
            image: ''
        }
    ],
    contact: {
        email: '3029449682@qq.com',
        wechat: '13321349516',
        github: 'maobaochang'
    },
    avatar: ''
};

// ============ 全局状态 ============
let siteData = loadData();
let editingWorkId = null;

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdmin();
    }
    initLogin();
    initSidebar();
    initAvatarPreview();
    // 退出登录按钮
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            location.reload();
        });
    }
});

// ============ 登录 ============
function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = document.getElementById('passwordInput').value;
        if (pw === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdmin();
        } else {
            const err = document.getElementById('loginError');
            err.classList.add('show');
            setTimeout(() => err.classList.remove('show'), 3000);
            document.getElementById('passwordInput').value = '';
        }
    });
}

function showAdmin() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminScreen').classList.remove('hidden');
    loadAllForms();
    renderWorksList();
}

// ============ 侧边栏切换 ============
function initSidebar() {
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            const tab = btn.getAttribute('data-tab');
            const tabEl = document.getElementById('tab-' + tab);
            if (tabEl) tabEl.classList.add('active');
            if (tab === 'export') generateExportCode();
        });
    });
}

// ============ 数据持久化 ============
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(defaultData));
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
}

// ============ 加载表单 ============
function loadAllForms() {
    // 首页
    setVal('edit-greeting', siteData.hero.greeting);
    setVal('edit-name', siteData.hero.name);
    setVal('edit-typing', siteData.hero.typing.join('\n'));
    setVal('edit-hero-desc', siteData.hero.desc);

    // 关于
    setVal('edit-about-text', siteData.about.paragraphs.join('\n\n'));
    setVal('edit-stat1-num', siteData.about.stats[0].num);
    setVal('edit-stat1-label', siteData.about.stats[0].label);
    setVal('edit-stat2-num', siteData.about.stats[1].num);
    setVal('edit-stat2-label', siteData.about.stats[1].label);
    setVal('edit-stat3-num', siteData.about.stats[2].num);
    setVal('edit-stat3-label', siteData.about.stats[2].label);

    // 联系
    setVal('edit-email', siteData.contact.email);
    setVal('edit-wechat', siteData.contact.wechat);
    setVal('edit-github', siteData.contact.github);

    // 头像
    if (siteData.avatar) {
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.innerHTML = '<img src="' + siteData.avatar + '" alt="头像" />';
    }
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

// ============ 保存：首页 ============
function saveHero() {
    siteData.hero.greeting = val('edit-greeting');
    siteData.hero.name = val('edit-name');
    siteData.hero.typing = val('edit-typing').split('\n').filter(s => s.trim());
    siteData.hero.desc = val('edit-hero-desc');
    saveData();
    showToast('首页信息已保存 ✨');
}

// ============ 保存：关于 ============
function saveAbout() {
    siteData.about.paragraphs = val('edit-about-text').split('\n\n').filter(s => s.trim());
    siteData.about.stats[0] = { num: parseInt(val('edit-stat1-num')) || 0, label: val('edit-stat1-label') };
    siteData.about.stats[1] = { num: parseInt(val('edit-stat2-num')) || 0, label: val('edit-stat2-label') };
    siteData.about.stats[2] = { num: parseInt(val('edit-stat3-num')) || 0, label: val('edit-stat3-label') };
    saveData();
    showToast('关于信息已保存 ✨');
}

// ============ 保存：联系 ============
function saveContact() {
    siteData.contact.email = val('edit-email');
    siteData.contact.wechat = val('edit-wechat');
    siteData.contact.github = val('edit-github');
    saveData();
    showToast('联系信息已保存 ✨');
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

// ============ 作品管理 ============
function showWorkForm(workId) {
    const form = document.getElementById('workForm');
    form.classList.remove('hidden');
    editingWorkId = workId || null;

    if (workId) {
        const work = siteData.works.find(w => w.id === workId);
        if (!work) return;
        document.getElementById('workFormTitle').textContent = '编辑作品';
        setVal('work-title-input', work.title);
        setVal('work-category-input', work.category);
        setVal('work-desc-input', work.desc);
        setVal('work-tech-input', work.tech.join(', '));
        const preview = document.getElementById('workImagePreview');
        if (work.image) {
            preview.innerHTML = '<img src="' + work.image + '" />';
            preview.classList.add('show');
        }
    } else {
        document.getElementById('workFormTitle').textContent = '添加作品';
        cancelWorkForm();
    }
}

function cancelWorkForm() {
    const form = document.getElementById('workForm');
    form.classList.add('hidden');
    setVal('work-title-input', '');
    setVal('work-category-input', 'web');
    setVal('work-desc-input', '');
    setVal('work-tech-input', '');
    document.getElementById('work-image-file').value = '';
    setVal('work-image-url', '');
    const preview = document.getElementById('workImagePreview');
    preview.innerHTML = '';
    preview.classList.remove('show');
    editingWorkId = null;
}

function saveWork() {
    const title = val('work-title-input').trim();
    if (!title) { alert('请输入作品标题'); return; }

    const category = val('work-category-input');
    const tagMap = { web: 'Web 开发', design: '设计', other: '其他' };
    const desc = val('work-desc-input').trim();
    const tech = val('work-tech-input').split(',').map(s => s.trim()).filter(s => s);
    const imageUrl = val('work-image-url').trim();

    let image = imageUrl;
    if (!image) {
        const preview = document.getElementById('workImagePreview');
        const img = preview.querySelector('img');
        if (img) image = img.src;
    }

    if (editingWorkId) {
        const idx = siteData.works.findIndex(w => w.id === editingWorkId);
        if (idx !== -1) {
            siteData.works[idx] = { ...siteData.works[idx], title, category, tag: tagMap[category], desc, tech, image };
        }
    } else {
        siteData.works.push({ id: Date.now(), title, category, tag: tagMap[category], desc, tech, image });
    }

    saveData();
    cancelWorkForm();
    renderWorksList();
    showToast(editingWorkId ? '作品已更新 ✨' : '作品已添加 ✨');
}

function deleteWork(id) {
    if (!confirm('确定删除该作品？')) return;
    siteData.works = siteData.works.filter(w => w.id !== id);
    saveData();
    renderWorksList();
    showToast('作品已删除');
}

function renderWorksList() {
    const container = document.getElementById('worksList');
    if (!container) return;
    container.innerHTML = siteData.works.map(w => {
        const thumb = w.image
            ? '<img src="' + w.image + '" />'
            : '<span style="font-size:1.5rem;">📄</span>';
        return '<div class="work-item">' +
            '<div class="work-item-thumb">' + thumb + '</div>' +
            '<div class="work-item-info"><h4>' + w.title + '</h4><span>' + w.tag + '</span></div>' +
            '<div class="work-item-actions">' +
                '<button class="btn-edit" onclick="showWorkForm(' + w.id + ')">编辑</button>' +
                '<button class="btn-delete" onclick="deleteWork(' + w.id + ')">删除</button>' +
            '</div></div>';
    }).join('');
}

// ============ 图片上传预览 ============
function previewWorkImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('workImagePreview');
        preview.innerHTML = '<img src="' + e.target.result + '" />';
        preview.classList.add('show');
        setVal('work-image-url', '');
    };
    reader.readAsDataURL(file);
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.innerHTML = '<img src="' + e.target.result + '" alt="头像" />';
    };
    reader.readAsDataURL(file);
}

function initAvatarPreview() {
    if (siteData.avatar) {
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.innerHTML = '<img src="' + siteData.avatar + '" alt="头像" />';
    }
}

function saveAvatar() {
    const preview = document.getElementById('avatarPreview');
    const img = preview ? preview.querySelector('img') : null;
    if (img) {
        const src = img.src;
        if (src.startsWith('data:') && src.length > 2 * 1024 * 1024) {
            alert('图片太大（超过 2MB），请压缩后再上传，或使用图片链接。');
            return;
        }
        siteData.avatar = src;
        saveData();
        showToast('头像已保存 ✨');
    } else {
        alert('请先选择一张照片');
    }
}

// ============ 导出 ============
function generateExportCode() {
    const textarea = document.getElementById('exportCode');
    if (!textarea) return;
    const code = '// 由管理后台自动生成 - ' + new Date().toLocaleString() + '\n' +
        'const SITE_DATA = ' + JSON.stringify(siteData, null, 4) + ';\n';
    textarea.value = code;
}

function exportJSON() {
    saveData();
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'site-data.json');
    showToast('site-data.json 已下载 📦');
}

function exportFullHTML() {
    saveData();
    const html = generateHTML(siteData);
    const blob = new Blob([html], { type: 'text/html' });
    downloadBlob(blob, 'index.html');
    showToast('index.html 已下载 📄 请替换原文件');
}

function copyExportCode() {
    generateExportCode();
    const textarea = document.getElementById('exportCode');
    textarea.select();
    document.execCommand('copy');
    showToast('配置代码已复制 📋');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============ HTML 生成器 ============
function generateHTML(data) {
    const typingArr = JSON.stringify(data.hero.typing);
    const worksHTML = data.works.map(w => {
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
    }).join('\n                ');

    const avatarHTML = data.avatar
        ? '<img src="' + data.avatar + '" alt="毛宝昌" />'
        : '<span>MBC</span>';

    return '<!DOCTYPE html>\n' +
        '<html lang="zh-CN">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '    <title>' + data.hero.name + ' · 个人主页</title>\n' +
        '    <link rel="stylesheet" href="styles.css">\n' +
        '    <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
        '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">\n' +
        '</head>\n' +
        '<body>\n' +
        '    <div class="cursor"></div>\n' +
        '    <div class="cursor-follower"></div>\n\n' +
        '    <nav class="navbar" id="navbar">\n' +
        '        <div class="nav-container">\n' +
        '            <a href="#hero" class="nav-logo">' + data.hero.name + '</a>\n' +
        '            <div class="nav-links">\n' +
        '                <a href="#about" class="nav-link">关于</a>\n' +
        '                <a href="#works" class="nav-link">作品</a>\n' +
        '                <a href="#contact" class="nav-link">联系</a>\n' +
        '            </div>\n' +
        '            <button class="theme-toggle" id="themeToggle" aria-label="切换主题">\n' +
        '                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>\n' +
        '                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </nav>\n\n' +
        '    <section class="hero" id="hero">\n' +
        '        <div class="hero-bg-glow"></div>\n' +
        '        <div class="hero-content">\n' +
        '            <p class="hero-greeting">' + data.hero.greeting + '</p>\n' +
        '            <h1 class="hero-title"><span class="hero-name">' + data.hero.name + '</span></h1>\n' +
        '            <p class="hero-subtitle"><span class="typing-text"></span><span class="typing-cursor">|</span></p>\n' +
        '            <p class="hero-desc">' + data.hero.desc + '</p>\n' +
        '            <div class="hero-actions">\n' +
        '                <a href="#works" class="btn btn-primary">查看作品</a>\n' +
        '                <a href="#contact" class="btn btn-outline">联系我</a>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="hero-visual">\n' +
        '            <div class="hero-avatar-container">\n' +
        '                <div class="hero-avatar-ring"></div>\n' +
        '                <div class="hero-avatar-placeholder">' + avatarHTML + '</div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="scroll-indicator"><span>向下滚动</span><div class="scroll-line"></div></div>\n' +
        '    </section>\n\n' +
        '    <section class="about section" id="about">\n' +
        '        <div class="section-container">\n' +
        '            <div class="section-label">01</div>\n' +
        '            <h2 class="section-title">关于我</h2>\n' +
        '            <div class="about-grid">\n' +
        '                <div class="about-text">\n' +
        data.about.paragraphs.map(p => '                    <p>' + p + '</p>').join('\n') + '\n' +
        '                </div>\n' +
        '                <div class="about-stats">\n' +
        data.about.stats.map(s =>
            '                    <div class="stat-card"><span class="stat-number" data-target="' + s.num + '">0</span><span class="stat-label">' + s.label + '</span></div>'
        ).join('\n') + '\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </section>\n\n' +
        '    <section class="works section" id="works">\n' +
        '        <div class="section-container">\n' +
        '            <div class="section-label">02</div>\n' +
        '            <h2 class="section-title">我的作品</h2>\n' +
        '            <p class="section-desc">每一个项目都是一次探索与成长的旅程</p>\n' +
        '            <div class="works-filter">\n' +
        '                <button class="filter-btn active" data-filter="all">全部</button>\n' +
        '                <button class="filter-btn" data-filter="web">Web 开发</button>\n' +
        '                <button class="filter-btn" data-filter="design">设计</button>\n' +
        '                <button class="filter-btn" data-filter="other">其他</button>\n' +
        '            </div>\n' +
        '            <div class="works-grid">\n' +
        worksHTML + '\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </section>\n\n' +
        '    <section class="contact section" id="contact">\n' +
        '        <div class="section-container">\n' +
        '            <div class="section-label">03</div>\n' +
        '            <h2 class="section-title">联系我</h2>\n' +
        '            <p class="section-desc">有项目合作的想法？欢迎随时联系</p>\n' +
        '            <div class="contact-grid">\n' +
        '                <div class="contact-card">\n' +
        '                    <div class="contact-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>\n' +
        '                    <h3>邮箱</h3>\n' +
        '                    <a href="mailto:' + data.contact.email + '">' + data.contact.email + '</a>\n' +
        '                </div>\n' +
        '                <div class="contact-card">\n' +
        '                    <div class="contact-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>\n' +
        '                    <h3>微信</h3>\n' +
        '                    <span>' + data.contact.wechat + '</span>\n' +
        '                </div>\n' +
        '                <div class="contact-card">\n' +
        '                    <div class="contact-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></div>\n' +
        '                    <h3>GitHub</h3>\n' +
        '                    <a href="https://github.com/' + data.contact.github + '" target="_blank" rel="noopener">@' + data.contact.github + '</a>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </section>\n\n' +
        '    <footer class="footer">\n' +
        '        <div class="footer-container">\n' +
        '            <div class="footer-top">\n' +
        '                <a href="#hero" class="footer-logo">' + data.hero.name + '</a>\n' +
        '                <div class="footer-links">\n' +
        '                    <a href="#about">关于</a>\n' +
        '                    <a href="#works">作品</a>\n' +
        '                    <a href="#contact">联系</a>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="footer-bottom"><p>&copy; 2026 ' + data.hero.name + '. All rights reserved.</p></div>\n' +
        '        </div>\n' +
        '    </footer>\n\n' +
        '    <script>\n' +
        '        const TYPING_TEXTS = ' + typingArr + ';\n' +
        '    </script>\n' +
        '    <script src="script.js"></script>\n' +
        '</body>\n' +
        '</html>';
}

// ============ Toast 提示 ============
function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
