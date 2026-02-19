# IconMaker - Apple App Icon Generator

<div align="center">

![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Online-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Pure Frontend](https://img.shields.io/badge/Pure_Frontend-Yes-green)

**专业的 Apple 应用图标生成工具**

[在线使用](https://andy-zhangtao.github.io/iconmaker/) · [GitHub 仓库](https://github.com/andy-zhangtao/iconmaker)

</div>

---

## 📖 简介

IconMaker 是一个纯前端实现的 Apple App Icon 生成工具，可以帮助开发者快速生成符合 Apple 官方规范的各平台应用图标。

### ✨ 主要特性

- 🚀 **纯前端实现** - 所有图像处理都在浏览器本地完成，无需上传服务器
- 🔒 **安全隐私** - 您的图片永远不会离开您的设备
- ⚡ **快速高效** - 一键生成所有尺寸的图标
- 📦 **完整支持** - 生成符合 Xcode Asset Catalog 规范的文件结构
- 🎨 **精美 UI** - 现代渐变设计，毛玻璃效果，流畅动画

---

## 🎯 支持的平台和尺寸

### iOS
| 尺寸 | 用途 |
|------|------|
| 1024×1024 | App Store |
| 180×180 | iPhone @3x |
| 120×120 | iPhone @2x |

### iPad
| 尺寸 | 用途 |
|------|------|
| 167×167 | iPad Pro @2x |
| 152×152 | iPad @2x |
| 76×76 | iPad @1x |

### watchOS
| 尺寸 | 用途 |
|------|------|
| 1024×1024 | App Store |
| 556×556 | Watch 49mm @2x |
| 472×472 | Watch 45mm @2x |
| 428×428 | Watch 44mm @2x |
| 396×396 | Watch 41mm @2x |
| 352×352 | Watch 40mm @2x |
| 272×272 | Watch 38mm @2x |
| 234×234 | Watch 36mm @2x |
| 216×216 | Watch 34mm @2x |
| 196×196 | Watch 32mm @2x |
| 172×172 | Watch 30mm @2x |

### macOS
| 尺寸 | 用途 |
|------|------|
| 1024×1024 | App Store |
| 512×512 | macOS @2x |
| 256×256 | macOS @1x |
| 128×128 | macOS @2x |
| 64×64 | macOS @1x |
| 32×32 | macOS @1x |
| 16×16 | macOS @1x |

---

## 🚀 使用方法

### 在线使用

1. 访问 [https://andy-zhangtao.github.io/iconmaker/](https://andy-zhangtao.github.io/iconmaker/)
2. 拖拽或点击上传 PNG 格式的图片（建议 1024×1024 或更大）
3. 选择需要生成的目标平台
4. 点击「生成图标包」按钮
5. 等待生成完成后下载 ZIP 文件

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/andy-zhangtao/iconmaker.git
cd iconmaker

# 使用 Python 启动本地服务器
python3 -m http.server 8080

# 或使用 Node.js
npx serve .

# 或使用任意静态文件服务器
```

然后在浏览器中访问 `http://localhost:8080`

---

## 📦 输出文件结构

生成的 ZIP 文件包含以下结构：

```
app-icons.zip
├── README.txt                 # 使用说明
├── ios/
│   └── Assets.xcassets/
│       └── AppIcon.appiconset/
│           ├── icon-1024x1024.png
│           ├── icon-180x180.png
│           ├── icon-120x120.png
│           └── Contents.json
├── ipad/
│   └── Assets.xcassets/
│       └── AppIcon.appiconset/
│           ├── icon-167x167.png
│           ├── icon-152x152.png
│           ├── icon-76x76.png
│           └── Contents.json
├── watch/
│   └── Assets.xcassets/
│       └── AppIcon.appiconset/
│           ├── icon-1024x1024.png
│           ├── icon-556x556.png
│           ├── icon-472x472.png
│           ├── ... (更多尺寸)
│           └── Contents.json
└── macos/
    └── Assets.xcassets/
        └── AppIcon.appiconset/
            ├── icon-1024x1024.png
            ├── icon-512x512.png
            ├── icon-256x256.png
            ├── ... (更多尺寸)
            └── Contents.json
```

---

## 💻 在 Xcode 中使用

### 方法一：直接拖入

1. 解压下载的 ZIP 文件
2. 打开 Xcode 项目
3. 在 Project Navigator 中找到 `Assets.xcassets`
4. 将对应平台的 `AppIcon.appiconset` 文件夹中的所有内容拖入 Xcode

### 方法二：替换现有图标

1. 在 Xcode 中打开 `Assets.xcassets`
2. 找到 `AppIcon` 
3. 选择对应平台
4. 删除现有图标
5. 将生成的图标文件拖入对应位置

---

## 🛠 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 渐变、动画、毛玻璃效果
- **JavaScript (ES6+)** - 原生实现，无需框架
- **Canvas API** - 图像处理和缩放
- **JSZip** - ZIP 文件生成

---

## 🔧 开发

### 项目结构

```
iconmaker/
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件
├── js/
│   ├── app.js              # 主应用逻辑
│   ├── icon-generator.js   # 图标生成器
│   └── zip-handler.js      # ZIP 打包处理
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages 部署工作流
└── README.md               # 项目说明
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/andy-zhangtao/iconmaker.git
cd iconmaker

# 启动开发服务器
python3 -m http.server 8080

# 或使用 live-server
npx live-server
```

---

## 📝 注意事项

1. **图片格式**：仅支持 PNG 格式，建议使用透明背景
2. **图片尺寸**：建议上传 1024×1024 或更大的图片，以保证缩放质量
3. **图片内容**：确保图片内容居中，四周留有一定边距（Apple 建议约 10%）
4. **圆角处理**：系统会自动添加圆角，无需预先处理

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📮 联系方式

- GitHub: [@andy-zhangtao](https://github.com/andy-zhangtao)
- 项目地址：[https://github.com/andy-zhangtao/iconmaker](https://github.com/andy-zhangtao/iconmaker)

---

<div align="center">

**Made with ❤️ by IconMaker Team**

[⬆ 返回顶部](#iconmaker---apple-app-icon-generator)

</div>