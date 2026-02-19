/**
 * IconMaker - Icon Generator Module
 * 负责图像处理和图标生成
 */

class IconGenerator {
    constructor() {
        // Apple 各平台的图标尺寸规范
        this.iconSizes = {
            ios: [
                { size: 1024, name: '1024x1024', purpose: 'App Store' },
                { size: 180, name: '180x180', purpose: 'iPhone @3x' },
                { size: 120, name: '120x120', purpose: 'iPhone @2x' }
            ],
            ipad: [
                { size: 167, name: '167x167', purpose: 'iPad Pro @2x' },
                { size: 152, name: '152x152', purpose: 'iPad @2x' },
                { size: 76, name: '76x76', purpose: 'iPad @1x' }
            ],
            watch: [
                { size: 1024, name: '1024x1024', purpose: 'App Store' },
                { size: 556, name: '556x556', purpose: 'Watch 49mm @2x' },
                { size: 472, name: '472x472', purpose: 'Watch 45mm @2x' },
                { size: 428, name: '428x428', purpose: 'Watch 44mm @2x' },
                { size: 396, name: '396x396', purpose: 'Watch 41mm @2x' },
                { size: 352, name: '352x352', purpose: 'Watch 40mm @2x' },
                { size: 272, name: '272x272', purpose: 'Watch 38mm @2x' },
                { size: 234, name: '234x234', purpose: 'Watch 36mm @2x' },
                { size: 216, name: '216x216', purpose: 'Watch 34mm @2x' },
                { size: 196, name: '196x196', purpose: 'Watch 32mm @2x' },
                { size: 172, name: '172x172', purpose: 'Watch 30mm @2x' }
            ],
            macos: [
                { size: 1024, name: '1024x1024', purpose: 'App Store' },
                { size: 512, name: '512x512', purpose: 'macOS @2x' },
                { size: 256, name: '256x256', purpose: 'macOS @1x' },
                { size: 128, name: '128x128', purpose: 'macOS @2x' },
                { size: 64, name: '64x64', purpose: 'macOS @1x' },
                { size: 32, name: '32x32', purpose: 'macOS @1x' },
                { size: 16, name: '16x16', purpose: 'macOS @1x' }
            ]
        };
        
        this.sourceImage = null;
        this.sourceWidth = 0;
        this.sourceHeight = 0;
    }

    /**
     * 加载源图像
     * @param {string} dataUrl - 图片的 DataURL
     * @returns {Promise<boolean>} 是否加载成功
     */
    async loadSourceImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sourceImage = img;
                this.sourceWidth = img.width;
                this.sourceHeight = img.height;
                resolve(true);
            };
            img.onerror = (e) => {
                reject(new Error('图片加载失败'));
            };
            img.src = dataUrl;
        });
    }

    /**
     * 获取源图像信息
     * @returns {Object} 图像信息
     */
    getSourceInfo() {
        return {
            width: this.sourceWidth,
            height: this.sourceHeight
        };
    }

    /**
     * 生成指定尺寸的图标
     * @param {number} size - 目标尺寸
     * @returns {Promise<Blob>} 生成的图片 Blob
     */
    async generateIcon(size) {
        if (!this.sourceImage) {
            throw new Error('请先加载源图像');
        }

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // 计算缩放参数（保持宽高比，居中裁剪）
        const scale = Math.max(size / this.sourceWidth, size / this.sourceHeight);
        const newWidth = this.sourceWidth * scale;
        const newHeight = this.sourceHeight * scale;
        const x = (size - newWidth) / 2;
        const y = (size - newHeight) / 2;

        // 绘制背景（透明）
        ctx.clearRect(0, 0, size, size);

        // 高质量缩放
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 绘制缩放后的图像
        ctx.drawImage(this.sourceImage, x, y, newWidth, newHeight);

        // 转换为 Blob
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('图片转换失败'));
                }
            }, 'image/png');
        });
    }

    /**
     * 获取指定平台的所有图标尺寸
     * @param {string} platform - 平台名称
     * @returns {Array} 尺寸数组
     */
    getPlatformSizes(platform) {
        return this.iconSizes[platform] || [];
    }

    /**
     * 获取所有选中平台的图标尺寸
     * @param {Array<string>} platforms - 选中的平台列表
     * @returns {Object} 包含所有图标的对象
     */
    getAllSizesForPlatforms(platforms) {
        const result = {};
        for (const platform of platforms) {
            if (this.iconSizes[platform]) {
                result[platform] = this.iconSizes[platform];
            }
        }
        return result;
    }

    /**
     * 批量生成图标
     * @param {Array<string>} platforms - 要生成的平台列表
     * @param {Function} onProgress - 进度回调函数
     * @returns {Promise<Object>} 生成的图标数据
     */
    async generateAllIcons(platforms, onProgress) {
        const allSizes = this.getAllSizesForPlatforms(platforms);
        const icons = {};
        let totalIcons = 0;
        let generatedIcons = 0;

        // 计算总图标数
        for (const platform of platforms) {
            totalIcons += this.iconSizes[platform].length;
        }

        // 为每个平台生成图标
        for (const platform of platforms) {
            icons[platform] = {};
            const sizes = this.iconSizes[platform];

            for (const { size, name, purpose } of sizes) {
                try {
                    const blob = await this.generateIcon(size);
                    icons[platform][size] = {
                        blob,
                        name,
                        purpose,
                        filename: `icon-${size}x${size}.png`
                    };
                    generatedIcons++;

                    if (onProgress) {
                        onProgress(generatedIcons / totalIcons, `正在生成 ${platform} ${name}...`);
                    }
                } catch (error) {
                    console.error(`生成 ${platform} ${size} 失败:`, error);
                }
            }
        }

        return icons;
    }

    /**
     * 生成预览缩略图
     * @param {number} size - 缩略图尺寸
     * @returns {Promise<string>} DataURL
     */
    async generateThumbnail(size = 128) {
        if (!this.sourceImage) return null;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const scale = Math.max(size / this.sourceWidth, size / this.sourceHeight);
        const newWidth = this.sourceWidth * scale;
        const newHeight = this.sourceHeight * scale;
        const x = (size - newWidth) / 2;
        const y = (size - newHeight) / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(this.sourceImage, x, y, newWidth, newHeight);

        return canvas.toDataURL('image/png');
    }

    /**
     * 清除源图像
     */
    clear() {
        this.sourceImage = null;
        this.sourceWidth = 0;
        this.sourceHeight = 0;
    }
}

// 导出实例
const iconGenerator = new IconGenerator();