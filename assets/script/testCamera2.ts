const { ccclass, property } = cc._decorator;

/**
 * 用「双缓冲 RenderTexture」做笔迹叠加：
 * - 每帧摄像机拍到的是：仍贴着上一帧 readRT 的 Sprite + 你新画的一层（须与 Sprite 在同一棵子树里且被该摄像机照到）
 * - 写入 writeRT，再交换 read/write；下一帧继续叠
 *
 * 若图一直干净：多半是 maskCamera 的 cullingMask 没有包含 targetSprite 所在分组，
 * 或 captureRoot 里没有包含「显示上一帧的 Sprite」节点。
 */
@ccclass
export class testCamera2 extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '显示累积结果的 Sprite（须在 captureRoot 子树内）' })
    private targetSprite: cc.Sprite = null;

    @property({ type: cc.Camera, tooltip: CC_DEV && '用于拍到「底图 + 新笔」的摄像机' })
    private maskCamera: cc.Camera = null;

    /** 若指定，则只 render 该节点子树（推荐）；不填则 maskCamera.render() 无参，依赖 cullingMask 照到整层 */
    @property({ type: cc.Node, tooltip: CC_DEV && '须包含 targetSprite 节点 + 笔刷/Graphics 等' })
    private captureRoot: cc.Node = null;

    /** 是否每帧在 update 里拍（很耗性能，调试可关） */
    @property
    private renderEveryFrame = true;

    private _readRT: cc.RenderTexture = null;
    private _writeRT: cc.RenderTexture = null;
    private _spriteFrame: cc.SpriteFrame = null;
    private _texW = 0;
    private _texH = 0;

    onLoad() {
        const winSize = cc.view.getVisibleSize();
        this._texW = 828;
        this._texH = Math.max(1, Math.floor((this._texW / winSize.width) * winSize.height));

        this._readRT = new cc.RenderTexture();
        this._readRT.initWithSize(this._texW, this._texH);
        this._writeRT = new cc.RenderTexture();
        this._writeRT.initWithSize(this._texW, this._texH);

        this._spriteFrame = new cc.SpriteFrame();
        this._spriteFrame.setTexture(this._readRT);
        this._spriteFrame.setFlipY(true);
        this._spriteFrame.setRect(new cc.Rect(0, 0, this._texW, this._texH));

        if (this.targetSprite) {
            this.targetSprite.spriteFrame = this._spriteFrame;
        }
    }

    protected update(dt: number): void {
        if (this.renderEveryFrame) {
            this._renderTexture();
        }
    }

    private _renderTexture() {
        if (!this.maskCamera || !this.targetSprite || !this._readRT || !this._writeRT) return;

        // 此时 Sprite 仍使用 _readRT，摄像机渲到 _writeRT，避免「同一张 RT 又读又写」导致全空或花屏
        this.maskCamera.targetTexture = this._writeRT;
        this.maskCamera.clearFlags = cc.Camera.ClearFlags.COLOR as any;
        this.maskCamera.backgroundColor = new cc.Color(0, 0, 0, 0);

        if (this.captureRoot && this.captureRoot.isValid) {
            this.maskCamera.render(this.captureRoot);
        } else {
            this.maskCamera.render();
        }

        this.maskCamera.targetTexture = null;

        this._spriteFrame.setTexture(this._writeRT);
        this._spriteFrame.setFlipY(true);
        this._spriteFrame.setRect(new cc.Rect(0, 0, this._texW, this._texH));
        this.targetSprite.spriteFrame = this._spriteFrame;

        const t = this._readRT;
        this._readRT = this._writeRT;
        this._writeRT = t;
    }
}
