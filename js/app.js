/**
 * IconMaker - Main Application
 * 主应用逻辑和交互处理
 */

class IconMakerApp {
    constructor() {
        // DOM 元素
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            previewContainer: document.getElementById('previewContainer'),
            previewImage: document.getElementById('previewImage'),
            imageSize: document.getElementById('imageSize'),
            imageFile: document.getElementById('imageFile'),
            btnRemove: document.getElementById('btnRemove'),
            platformSection: document.getElementById('platformSection'),
            platformCheckboxes: document.querySelectorAll('.platform-checkbox'),
            generateSection: document.getElementById('generateSection'),
            btnGenerate: document.getElementById('btnGenerate'),
            resultSection: document.getElementById('resultSection'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressPercent: document.getElementById('progressPercent'),
            progressStatus: document.getElementById('progressStatus'),
            resultContent: document.getElementById('resultContent'),
            resultInfo: document.getElementById('resultInfo'),
            btnDownload: document.getElementById('btnDownload')
        };

        // 状态
        this.state = {
            file: null,
            selectedPlatforms: ['ios', 'ipad', 'watch', 'macos'],
            isGenerating: false,
            generatedZip: null
        };

        // 绑定事件
        this.bindEvents();
    }

    /**
     * 绑定所有事件监听器
     */
    bindEvents() {
        // 上传区域点击
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.fileInput.click();
        });

        // 文件选择
        this.elements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFile(file);
            }
        });

        // 拖拽事件
        this.elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.add('drag-over');
        });

        this.elements.uploadArea.addEventListener('dragleave', () => {
            this.elements.uploadArea.classList.remove('drag-over');
        });

        this.elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'image/png') {
                this.handleFile(file);
            } else {
                this.showToast('请上传 PNG 格式的图片');
            }
        });

        // 移除按钮
        this.elements.btnRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            this.resetApp();
        });

        // 平台选择
        this.elements.platformCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                this.updateSelectedPlatforms();
            });
        });

        // 生成按钮
        this.elements.btnGenerate.addEventListener('click', () => {
            this.startGeneration();
        });

        // 下载按钮
        this.elements.btnDownload.addEventListener('click', () => {
            if (this.state.generatedZip) {
                zipHandler.downloadZip(this.state.generatedZip, 'app-icons.zip');
            }
        });
    }

    /**
     * 处理上传的文件
     * @param {File} file - 上传的文件
     */
    async handleFile(file) {
        if (file.type !== 'image/png') {
            this.showToast('请上传 PNG 格式的图片');
            return;
        }

        this.state.file = file;

        // 读取文件
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // 加载到 iconGenerator
                await iconGenerator.loadSourceImage(e.target.result);

                // 显示预览
                this.showPreview(e.target.result, file);

                // 显示平台选择
                this.elements.platformSection.style.display = 'block';
                this.elements.generateSection.style.display = 'block';

                // 滚动到平台选择
                setTimeout(() => {
                    this.elements.platformSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 100);
            } catch (error) {
                this.showToast('图片加载失败，请重试');
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    }

    /**
     * 显示预览
     * @param {string} dataUrl - 图片 DataURL
     * @param {File} file - 文件对象
     */
    showPreview(dataUrl, file) {
        const info = iconGenerator.getSourceInfo();

        this.elements.previewImage.src = dataUrl;
        this.elements.imageSize.textContent = `${info.width} × ${info.height} px`;
        this.elements.imageFile.textContent = file.name;
        this.elements.previewContainer.style.display = 'block';
        this.elements.uploadArea.style.display = 'none';
    }

    /**
     * 更新选中的平台
     */
    updateSelectedPlatforms() {
        this.state.selectedPlatforms = [];
        this.elements.platformCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                this.state.selectedPlatforms.push(checkbox.value);
            }
        });
    }

    /**
     * 开始生成图标
     */
    async startGeneration() {
        if (this.state.isGenerating) return;

        if (this.state.selectedPlatforms.length === 0) {
            this.showToast('请至少选择一个平台');
            return;
        }

        this.state.isGenerating = true;
        this.elements.resultSection.style.display = 'block';
        this.elements.progressContainer.style.display = 'block';
        this.elements.resultContent.style.display = 'none';

        // 滚动到结果区域
        setTimeout(() => {
            this.elements.resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);

        try {
            // 生成所有图标
            const icons = await iconGenerator.generateAllIcons(
                this.state.selectedPlatforms,
                (progress, status) => {
                    this.updateProgress(progress, status);
                }
            );

            // 生成 ZIP
            this.updateProgress(0.9, '正在打包 ZIP...');
            const zipBlob = await zipHandler.generateZip(icons, (progress, status) => {
                this.updateProgress(progress, status);
            });

            this.state.generatedZip = zipBlob;

            // 显示完成状态
            this.showResult(icons, zipBlob);
        } catch (error) {
            console.error('生成失败:', error);
            this.showToast('生成失败，请重试');
            this.elements.progressContainer.style.display = 'none';
        } finally {
            this.state.isGenerating = false;
        }
    }

    /**
     * 更新进度显示
     * @param {number} progress - 进度 (0-1)
     * @param {string} status - 状态文本
     */
    updateProgress(progress, status) {
        const percent = Math.round(progress * 100);
        this.elements.progressFill.style.width = `${percent}%`;
        this.elements.progressPercent.textContent = `${percent}%`;
        this.elements.progressStatus.textContent = status;
    }

    /**
     * 显示生成结果
     * @param {Object} icons - 图标数据
     * @param {Blob} zipBlob - ZIP 文件
     */
    showResult(icons, zipBlob) {
        // 计算总图标数
        let totalIcons = 0;
        for (const platform of Object.values(icons)) {
            totalIcons += Object.keys(platform).length;
        }

        this.elements.progressContainer.style.display = 'none';
        this.elements.resultContent.style.display = 'block';
        this.elements.resultInfo.textContent = `共生成 ${totalIcons} 个图标文件 · ${zipHandler.formatSize(zipBlob)}`;

        // 添加成功动画
        this.elements.resultContent.classList.add('animate-success');
    }

    /**
     * 重置应用状态
     */
    resetApp() {
        // 清除状态
        this.state.file = null;
        this.state.generatedZip = null;
        iconGenerator.clear();

        // 重置 UI
        this.elements.previewContainer.style.display = 'none';
        this.elements.uploadArea.style.display = 'block';
        this.elements.platformSection.style.display = 'none';
        this.elements.generateSection.style.display = 'none';
        this.elements.resultSection.style.display = 'none';
        this.elements.fileInput.value = '';

        // 重置进度
        this.elements.progressFill.style.width = '0%';
        this.elements.progressPercent.textContent = '0%';
        this.elements.progressStatus.textContent = '准备生成...';
    }

    /**
     * 显示提示消息
     * @param {string} message - 提示信息
     */
    showToast(message) {
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(toast);

        // 显示动画
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // 3 秒后移除
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.iconMakerApp = new IconMakerApp();
});