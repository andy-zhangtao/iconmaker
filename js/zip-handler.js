/**
 * IconMaker - ZIP Handler Module
 * 负责 ZIP 打包和 Contents.json 生成
 */

class ZipHandler {
    constructor() {
        this.jszip = null;
    }

    /**
     * 初始化 JSZip
     */
    init() {
        if (typeof JSZip !== 'undefined') {
            this.jszip = new JSZip();
        } else {
            throw new Error('JSZip 未加载');
        }
    }

    /**
     * 生成 Contents.json 文件内容
     * @param {string} platform - 平台名称
     * @returns {Object} Contents.json 对象
     */
    generateContentsJson(platform) {
        const sizes = iconGenerator.getPlatformSizes(platform);
        const icons = [];
        const scaleMap = {
            ios: { 1024: '1x', 180: '3x', 120: '2x' },
            ipad: { 167: '2x', 152: '2x', 76: '1x' },
            watch: {
                1024: '1x', 556: '2x', 472: '2x', 428: '2x', 396: '2x',
                352: '2x', 272: '2x', 234: '2x', 216: '2x', 196: '2x', 172: '2x'
            },
            macos: { 1024: '1x', 512: '2x', 256: '1x', 128: '2x', 64: '1x', 32: '1x', 16: '1x' }
        };

        const platformScales = scaleMap[platform] || {};

        for (const { size, purpose } of sizes) {
            const scale = platformScales[size] || '1x';
            const iconInfo = {
                size: `${size}x${size}`,
                scale: scale,
                filename: `icon-${size}x${size}.png`
            };

            // 添加平台特定的属性
            if (platform === 'ios') {
                iconInfo.idiom = 'iphone';
                if (size === 1024) {
                    iconInfo.idiom = 'ios-marketing';
                    delete iconInfo.scale;
                }
            } else if (platform === 'ipad') {
                iconInfo.idiom = 'ipad';
            } else if (platform === 'watch') {
                iconInfo.idiom = 'watch';
                if (size === 1024) {
                    iconInfo.idiom = 'watch-marketing';
                    delete iconInfo.scale;
                } else {
                    // watchOS 需要额外的 scale 信息
                    iconInfo.scale = `${scale}x`;
                }
            } else if (platform === 'macos') {
                iconInfo.idiom = 'mac';
                if (size === 1024) {
                    iconInfo.idiom = 'ios-marketing';
                    delete iconInfo.scale;
                }
            }

            icons.push(iconInfo);
        }

        return {
            images: icons,
            info: {
                author: 'IconMaker',
                version: 1
            }
        };
    }

    /**
     * 创建平台文件夹结构
     * @param {Object} icons - 图标数据对象
     * @returns {Promise<JSZip>} JSZip 实例
     */
    async createZipStructure(icons) {
        this.init();
        const zip = this.jszip;

        let fileCount = 0;

        // 为每个平台创建文件夹和文件
        for (const [platform, platformIcons] of Object.entries(icons)) {
            const platformFolder = zip.folder(platform);
            
            // 创建 Assets.xcassets 文件夹结构
            const assetsFolder = platformFolder.folder('Assets.xcassets');
            const appIconFolder = assetsFolder.folder('AppIcon.appiconset');

            // 添加图标文件
            for (const [size, iconData] of Object.entries(platformIcons)) {
                appIconFolder.file(iconData.filename, iconData.blob);
                fileCount++;
            }

            // 添加 Contents.json
            const contentsJson = this.generateContentsJson(platform);
            appIconFolder.file('Contents.json', JSON.stringify(contentsJson, null, 2));
            fileCount++;
        }

        // 添加 README 文件
        zip.file('README.txt', 
`IconMaker - Apple App Icon 生成结果
=====================================

生成时间：${new Date().toLocaleString('zh-CN')}

文件夹结构说明：
- ios/       - iOS 应用图标
- ipad/      - iPad 应用图标  
- watch/     - watchOS 应用图标
- macos/     - macOS 应用图标

每个平台文件夹包含：
- Assets.xcassets/AppIcon.appiconset/
  - 各种尺寸的 icon-XXXxXXX.png 文件
  - Contents.json (Asset Catalog 配置)

使用方法：
1. 将 Assets.xcassets 文件夹拖入 Xcode 项目
2. 或在对应平台的 App Icon 设置中选择

生成的图标符合 Apple 官方规范。
`);
        fileCount++;

        return { zip, fileCount };
    }

    /**
     * 生成并下载 ZIP 文件
     * @param {Object} icons - 图标数据对象
     * @param {Function} onProgress - 进度回调
     * @returns {Promise<Blob>} ZIP 文件 Blob
     */
    async generateZip(icons, onProgress) {
        const { zip, fileCount } = await this.createZipStructure(icons);

        if (onProgress) {
            onProgress(1, '正在打包 ZIP...');
        }

        // 生成 ZIP 文件
        const blob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        }, (metadata) => {
            if (onProgress) {
                // 映射压缩进度到 0-100%
                const progress = 0.9 + (metadata.percent / 100) * 0.1;
                onProgress(progress, `打包中... ${Math.round(metadata.percent)}%`);
            }
        });

        return blob;
    }

    /**
     * 下载 ZIP 文件
     * @param {Blob} blob - ZIP 文件 Blob
     * @param {string} filename - 文件名
     */
    downloadZip(blob, filename = 'app-icons.zip') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * 获取 ZIP 文件大小（格式化）
     * @param {Blob} blob - ZIP 文件 Blob
     * @returns {string} 格式化后的大小
     */
    formatSize(blob) {
        const bytes = blob.size;
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

// 导出实例
const zipHandler = new ZipHandler();