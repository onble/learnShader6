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
        const winSize = cc.view.getVisibleSize();
        const realHeight = (828 / winSize.width) * winSize.height;
        renderTexture.initWithSize(828, realHeight);

        this.maskCamera.targetTexture = renderTexture;
        // this.targetSprite.spriteFrame = spriteFrame;

        // 计算目标图标应该显示的区域的x,y,width,height,然后将摄像机中的对应位置截出来
        const targetRect = this.targetSprite.node.getBoundingBoxToWorld();
        const targetX = targetRect.x;// 414-200 = 214
        const targetY = targetRect.y - 200;// 1472/2 = 736 + 200 = 936 + 200 = 1136
        const targetWidth = targetRect.width;
        const targetHeight = targetRect.height;
        console.warn(targetX, targetY, targetWidth, targetHeight);
        // 将截出来的区域绘制到目标图片上
        const targetSpriteFrame = new cc.SpriteFrame();
        targetSpriteFrame.setTexture(renderTexture);
        targetSpriteFrame.setFlipY(true);
        targetSpriteFrame.setRect(new cc.Rect(0, 0, targetWidth, targetHeight));

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
