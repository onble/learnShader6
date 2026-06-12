const { ccclass, property } = cc._decorator;

/**
 * 将临时 Graphics 笔迹增量写入同一张 RenderTexture。
 *
 * RenderTexture 只在初始化/重置时清除颜色；后续提交时只清深度和模板，
 * 因此旧像素会一直保留。Graphics 每次提交后立即清空，不会累积路径几何。
 */
@ccclass
export class testCamera2 extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '显示持久化笔迹纹理的 Sprite' })
    private targetSprite: cc.Sprite = null;

    @property({ type: cc.Camera, tooltip: CC_DEV && '只渲染笔迹节点的离屏摄像机' })
    private maskCamera: cc.Camera = null;

    @property({ type: cc.Graphics, tooltip: CC_DEV && '每次提交后会被立即清空的临时笔迹' })
    private strokeGraphics: cc.Graphics = null;

    @property({ tooltip: CC_DEV && 'RenderTexture 宽度；高度按可见区域比例计算' })
    private textureWidth = 828;

    private _renderTexture: cc.RenderTexture = null;
    private _spriteFrame: cc.SpriteFrame = null;
    private _texW = 0;
    private _texH = 0;

    onLoad() {
        if (!this.targetSprite || !this.maskCamera) {
            cc.error('[testCamera2] targetSprite 和 maskCamera 必须设置');
            return;
        }

        const winSize = cc.view.getVisibleSize();
        this._texW = Math.max(1, Math.floor(this.textureWidth));
        this._texH = Math.max(1, Math.floor(this._texW / winSize.width * winSize.height));

        this._renderTexture = new cc.RenderTexture();
        this._renderTexture.initWithSize(this._texW, this._texH);

        this._spriteFrame = new cc.SpriteFrame();
        this._spriteFrame.setTexture(this._renderTexture);
        this._spriteFrame.setFlipY(true);
        this._spriteFrame.setRect(new cc.Rect(0, 0, this._texW, this._texH));
        this.targetSprite.spriteFrame = this._spriteFrame;

        // 该 Camera 只由 commitStroke/resetTexture 手动触发。
        this.maskCamera.enabled = false;
        this.maskCamera.backgroundColor = new cc.Color(0, 0, 0, 0);
        this.resetTexture();
    }

    /**
     * 把当前临时笔迹叠加进纹理。调用结束后 Graphics 中不再保留任何三角面。
     */
    public commitStroke() {
        if (!this._renderTexture || !this.maskCamera) return;

        const renderRoot = this.strokeGraphics && this.strokeGraphics.node;
        if (!renderRoot || !renderRoot.isValid) return;

        this.maskCamera.targetTexture = this._renderTexture;
        // 不清 COLOR，保留之前已经写入 RenderTexture 的所有路径。
        this.maskCamera.clearFlags = (
            cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL
        ) as any;
        this.maskCamera.render(renderRoot);
        this.maskCamera.targetTexture = null;

        if (this.strokeGraphics) {
            this.strokeGraphics.clear();
        }
    }

    /**
     * 清除纹理中保存的全部路径。
     */
    public resetTexture() {
        if (!this._renderTexture || !this.maskCamera) return;

        if (this.strokeGraphics) {
            this.strokeGraphics.clear();
        }

        this.maskCamera.targetTexture = this._renderTexture;
        this.maskCamera.clearFlags = (
            cc.Camera.ClearFlags.COLOR |
            cc.Camera.ClearFlags.DEPTH |
            cc.Camera.ClearFlags.STENCIL
        ) as any;

        // 用已经清空的 Graphics 节点触发一次渲染，避免 reset 时画入其他遮罩内容。
        const renderRoot = this.strokeGraphics && this.strokeGraphics.node;
        if (renderRoot && renderRoot.isValid) {
            this.maskCamera.render(renderRoot);
        } else {
            this.maskCamera.render();
        }

        this.maskCamera.targetTexture = null;
    }

    onDestroy() {
        if (this.maskCamera && this.maskCamera.targetTexture === this._renderTexture) {
            this.maskCamera.targetTexture = null;
        }
        if (this._spriteFrame) {
            this._spriteFrame.destroy();
            this._spriteFrame = null;
        }
        if (this._renderTexture) {
            this._renderTexture.destroy();
            this._renderTexture = null;
        }
    }
}
