# 毛宝昌 · 个人主页

一个高级、有质感的个人品牌网站，包含作品展示功能。

## 设计特点

- 🎨 **极简高级设计** — 干净的排版、克制的配色、精致的细节
- 🌓 **暗色/亮色模式** — 一键切换，自动保存偏好
- ✨ **自定义光标** — 流畅的跟随动画
- ⌨️ **打字机效果** — 动态展示身份标签
- 🔢 **数字滚动动画** — 数据可视化展示
- 🎯 **作品筛选系统** — 按类别过滤作品
- 📱 **完全响应式** — 适配桌面/平板/手机
- ⚡ **流畅动效** — 滚动显示动画、卡片悬浮效果

## 如何使用

### 本地预览
直接用浏览器打开 `index.html` 即可预览。

### 部署到 GitHub Pages

1. 将 `personal-website` 文件夹中的所有文件复制到你的 `maobaochang.github.io` 仓库
2. 提交并推送：
```bash
git add .
git commit -m "全新设计：高级质感个人主页"
git push origin main
```
3. 等待几分钟，访问 `https://maobaochang.github.io` 即可看到新网站

## 自定义你的作品

在 `index.html` 中找到 `<!-- 作品 1 -->` 等注释区域，修改：
- **标题**：`<h3 class="work-title">` 标签内容
- **描述**：`<p class="work-desc">` 标签内容
- **标签**：`<span class="work-tag">` 和 `work-tech` 中的标签
- **图片**：将 `<div class="work-placeholder">...</div>` 替换为 `<img src="你的图片路径" alt="作品截图">`

## 文件结构

```
├── index.html    # 主页面
├── styles.css    # 样式表
├── script.js     # 交互脚本
└── README.md     # 说明文档
```
