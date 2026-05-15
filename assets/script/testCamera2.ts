const { ccclass, property } = cc._decorator;

@ccclass
export class testCamera2 extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '目标图片' })
    private targetSprite: cc.Sprite = null;

    @property({ type: cc.Camera, tooltip: CC_DEV && '遮罩摄像机' })
    private maskCamera: cc.Camera = null;

    onLoad() {
        this.scheduleOnce(() => {
            this._renderTexture();
            console.warn('renderTexture');
        }, 3)
    }

    protected update(dt: number): void {
        // this._renderTexture();
    }

    private _renderTexture() {
        const renderTexture = new cc.RenderTexture();
        const winSize = cc.view.getVisibleSize();
        // RT 像素尺寸（与摄像机渲到 RT 上的分辨率一致）
        const texW = 828;
        const texH = Math.floor((texW / winSize.width) * winSize.height);
        renderTexture.initWithSize(texW, texH);

        this.maskCamera.targetTexture = renderTexture;
        // 先写入 RT，再挂到 Sprite；否则会用未渲染的空白纹理
        this.maskCamera.render();
        this.maskCamera.targetTexture = null;

        // setRect 的宽高必须与 RenderTexture 实际像素尺寸一致，否则会 UV 错位，
        // 再叠 setFlipY(true) 时很容易表现为整图「往上/往下偏了一截」。
        const targetSpriteFrame = new cc.SpriteFrame();
        targetSpriteFrame.setTexture(renderTexture);
        targetSpriteFrame.setFlipY(true);
        targetSpriteFrame.setRect(new cc.Rect(0, 0, texW, texH));

        this.targetSprite.spriteFrame = targetSpriteFrame;
    }

    /**
     * 获取节点在特定坐标系下的左下角点位置，基于设计尺寸 828×1472 进行偏移校正
     * @param {cc.Node} node - 目标节点
     * @returns {cc.Vec2} 节点左下角经偏移校正后的坐标点
     */
    private _getNodeLeftBootomPoint(node: cc.Node) {
        const x = node.x;
        const y = node.y;
        const width = node.width;
        const height = node.height;
        const pos = new cc.Vec2(x - width / 2 + 828 / 2, y - height / 2 + 1472 / 2);
        return pos;
    }



}
