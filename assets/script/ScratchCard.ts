
const { ccclass, property } = cc._decorator;

@ccclass
export class ScratchCard extends cc.Component {


    @property({ type: cc.Graphics, tooltip: CC_DEV && '刮痕绘制组件' })
    public graphics: cc.Graphics = null;

    private isScratching = false;
    private scratchRadius = 30;  // 刮痕半径

    start() {
        this.graphics.fillColor = cc.Color.BLACK; // 遮罩层默认黑色


        // 绑定触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // 触摸开始：开始刮
    onTouchStart() {
        this.isScratching = true;
    }

    // 触摸结束：停止刮
    onTouchEnd() {
        this.isScratching = false;
    }

    // 触摸移动：绘制刮痕
    onTouchMove(event: cc.Event.EventTouch) {
        if (!this.isScratching || !this.graphics) return;

        // 获取触摸点坐标（转换到Mask节点坐标系）
        const touchPos = event.getLocation();
        const localPos = this.graphics.node.convertToNodeSpaceAR(new cc.Vec3(touchPos.x, touchPos.y, 0));

        // 绘制圆形刮痕（透明区域）
        this.graphics.circle(localPos.x, localPos.y, this.scratchRadius);
        this.graphics.fill();
    }
}
