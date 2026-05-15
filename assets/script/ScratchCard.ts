
const { ccclass, property } = cc._decorator;

/** 仅清深度/模板，保留颜色缓冲，用于向已有 RenderTexture 上叠加绘制 */
function getCameraDepthStencilClearFlags(): number {
    const CF = cc.Camera.ClearFlags as any;
    if (CF && CF.DEPTH_STENCIL != null) return CF.DEPTH_STENCIL;
    if (CF && CF.DEPTH != null && CF.STENCIL != null) return CF.DEPTH | CF.STENCIL;
    return 6;
}

@ccclass
export class ScratchCard extends cc.Component {

    @property({ type: cc.Graphics, tooltip: CC_DEV && '刮痕绘制组件' })
    public graphics: cc.Graphics = null;

    /** 可选：指定用于抓取 Graphics 的摄像机；不填则在运行时自动创建 */
    @property({ type: cc.Camera, tooltip: CC_DEV && '不填则自动创建，用于把 Graphics 渲染到累积纹理' })
    public scratchCaptureCamera: cc.Camera = null;

    private isScratching = false;
    private scratchRadius = 30;

    /** 累积所有黑色刮痕的 GPU 纹理 */
    private _accumRT: cc.RenderTexture = null;
    private _accumSprite: cc.Sprite = null;
    private _captureCam: cc.Camera = null;
    private _ownsCaptureCamera = false;

    onLoad() {
        this._initScratchAccumulation();
    }

    start() {
        this.graphics.fillColor = cc.Color.BLACK;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        if (this._ownsCaptureCamera && this._captureCam && this._captureCam.node && this._captureCam.node.isValid) {
            this._captureCam.node.destroy();
        }
    }

    onTouchStart() {
        this.isScratching = true;
        this.mergeCurrentGraphicsIntoAccumTextureBeforeClear();
        this.graphics.clear();
    }

    onTouchEnd() {
        this.isScratching = false;
        this.mergeCurrentGraphicsIntoAccumTextureBeforeClear();
        this.graphics.clear();
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if (!this.isScratching || !this.graphics) return;

        const touchPos = event.getLocation();
        const localPos = this.graphics.node.convertToNodeSpaceAR(new cc.Vec3(touchPos.x, touchPos.y, 0));

        this.graphics.circle(localPos.x, localPos.y, this.scratchRadius);
        this.graphics.fill();
    }

    /** 供外部读取：当前已叠加保存的所有刮痕（内存 RenderTexture） */
    public getAccumulatedScratchTexture(): cc.RenderTexture {
        return this._accumRT;
    }

    /**
     * 在 graphics.clear() 之前调用：把当前 Graphics 上的路径渲染到累积 RenderTexture 上，
     * 多次调用会持续叠加，从而一直保留黑色刮痕记录。
     */
    private mergeCurrentGraphicsIntoAccumTextureBeforeClear(): void {
        if (!this.graphics || !this._accumRT || !this._captureCam) return;

        this._syncScratchCaptureCamera();
        this._captureCam.targetTexture = this._accumRT;
        this._captureCam.clearFlags = getCameraDepthStencilClearFlags() as any;
        this._captureCam.render(this.graphics.node);
        this._captureCam.targetTexture = null;
    }

    private _initScratchAccumulation(): void {
        if (!this.graphics) return;

        const gNode = this.graphics.node;
        const sz = gNode.getContentSize();
        const w = Math.max(1, Math.floor(sz.width));
        const h = Math.max(1, Math.floor(sz.height));

        this._accumRT = new cc.RenderTexture();
        this._accumRT.initWithSize(w, h);

        if (this.scratchCaptureCamera) {
            this._captureCam = this.scratchCaptureCamera;
        } else {
            const camNode = new cc.Node('_ScratchAccumCaptureCam');
            const scene = cc.director.getScene();
            if (scene) camNode.parent = scene;
            else camNode.parent = this.node;
            this._captureCam = camNode.addComponent(cc.Camera);
            this._captureCam.enabled = false;
            this._ownsCaptureCamera = true;
        }

        this._captureCam.cullingMask = 1 << gNode.groupIndex;
        this._captureCam.backgroundColor = new cc.Color(0, 0, 0, 0);
        this._captureCam.alignWithScreen = false;
        this._captureCam.ortho = true;
        this._captureCam.nearClip = -1024;
        this._captureCam.farClip = 1024;

        this._clearAccumTextureOnce();

        this._ensureAccumSpriteBehindGraphics(w, h);
    }

    /** 首次将累积纹理清成透明，后续叠加时不再清颜色 */
    private _clearAccumTextureOnce(): void {
        this._syncScratchCaptureCamera();
        this._captureCam.targetTexture = this._accumRT;
        this._captureCam.clearFlags = cc.Camera.ClearFlags.COLOR as any;
        this._captureCam.backgroundColor = new cc.Color(0, 0, 0, 0);
        this._captureCam.render();
        this._captureCam.targetTexture = null;
    }

    private _syncScratchCaptureCamera(): void {
        const gn = this.graphics.node;
        const camNode = this._captureCam.node;
        const worldMid = gn.convertToWorldSpaceAR(cc.v3(0, 0, 0));
        camNode.setPosition(worldMid);
        camNode.angle = gn.angle;

        const sz = gn.getContentSize();
        const sh = Math.max(1, sz.height * Math.abs(gn.scaleY));
        this._captureCam.orthoSize = sh / 2;
        this._captureCam.zoomRatio = 1;
    }

    private _ensureAccumSpriteBehindGraphics(texW: number, texH: number): void {
        const gn = this.graphics.node;
        const parent = gn.parent;
        if (!parent) return;

        const holder = new cc.Node('_ScratchAccumSprite');
        holder.parent = parent;
        holder.setSiblingIndex(gn.getSiblingIndex());
        holder.setContentSize(gn.width, gn.height);
        holder.setPosition(gn.position);
        holder.anchorX = gn.anchorX;
        holder.anchorY = gn.anchorY;
        holder.angle = gn.angle;
        holder.scaleX = gn.scaleX;
        holder.scaleY = gn.scaleY;
        holder.group = gn.group;

        this._accumSprite = holder.addComponent(cc.Sprite);
        const sf = new cc.SpriteFrame();
        sf.setTexture(this._accumRT);
        sf.setRect(new cc.Rect(0, 0, texW, texH));
        sf.setFlipY(true);
        this._accumSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this._accumSprite.spriteFrame = sf;
    }
}
