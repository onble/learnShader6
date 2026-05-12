const { ccclass, property } = cc._decorator;

@ccclass
export class testCamera extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '目标图片' })
    private targetSprite: cc.Sprite = null;

    @property({ type: cc.Camera, tooltip: CC_DEV && '遮罩摄像机' })
    private maskCamera: cc.Camera = null;

    onLoad() {
        this._renderTexture();

    }

    protected update(dt: number): void {
        // this._renderTexture();
    }

    private _renderTexture() {
        // 将遮罩摄像拍摄的内容渲染到目标图片上
        const renderTexture = new cc.RenderTexture();
        renderTexture.initWithSize(this.maskCamera.node.width, this.maskCamera.node.height);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(renderTexture);
        spriteFrame.setFlipY(true);
        this.maskCamera.targetTexture = renderTexture;
        this.targetSprite.spriteFrame = spriteFrame;

        // 将摄像机拍摄内容，根据高度进行等比例缩小后放到目标图片上
        const targetHeight = this.targetSprite.node.height;
        const targetWidth = targetHeight * this.maskCamera.node.width / this.maskCamera.node.height;
        renderTexture.width = targetWidth;
        renderTexture.height = targetHeight;

        this.targetSprite.node.width = targetWidth;
        this.targetSprite.node.height = targetHeight;
    }



}
