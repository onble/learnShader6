import { testCamera2 } from './testCamera2';

const { ccclass, property } = cc._decorator;

@ccclass
export class ScratchCard extends cc.Component {

    @property({ type: cc.Graphics, tooltip: CC_DEV && '刮痕绘制组件' })
    public graphics: cc.Graphics = null;

    @property({ type: testCamera2, tooltip: CC_DEV && '将临时笔迹持久化到 RenderTexture' })
    private texturePainter: testCamera2 = null;

    @property({ tooltip: CC_DEV && '刮痕半径' })
    private scratchRadius = 30;

    private isScratching = false;
    private lastPos: cc.Vec2 = null;

    start() {
        if (!this.graphics || !this.texturePainter) {
            cc.error('[ScratchCard] graphics 和 texturePainter 必须设置');
            this.enabled = false;
            return;
        }

        this.graphics.fillColor = cc.Color.WHITE;
        this.graphics.strokeColor = cc.Color.WHITE;
        this.graphics.lineWidth = this.scratchRadius * 2;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;

        // 绑定触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    // 触摸开始：开始刮
    onTouchStart(event: cc.Event.EventTouch) {
        this.isScratching = true;
        this.lastPos = this.getLocalTouchPos(event);
        this.drawDot(this.lastPos);
    }

    // 触摸结束：停止刮
    onTouchEnd() {
        this.isScratching = false;
        this.lastPos = null;
    }

    // 触摸移动：绘制刮痕
    onTouchMove(event: cc.Event.EventTouch) {
        if (!this.isScratching || !this.graphics) return;

        const localPos = this.getLocalTouchPos(event);
        if (!this.lastPos) {
            this.drawDot(localPos);
            this.lastPos = localPos;
            return;
        }

        this.graphics.moveTo(this.lastPos.x, this.lastPos.y);
        this.graphics.lineTo(localPos.x, localPos.y);
        this.graphics.stroke();
        if (this.texturePainter) {
            this.texturePainter.commitStroke();
        }
        this.lastPos = localPos;
    }

    private drawDot(pos: cc.Vec2) {
        if (!this.graphics || !pos) return;
        this.graphics.circle(pos.x, pos.y, this.scratchRadius);
        this.graphics.fill();
        if (this.texturePainter) {
            this.texturePainter.commitStroke();
        }
    }

    private getLocalTouchPos(event: cc.Event.EventTouch) {
        const touchPos = event.getLocation();
        const pos = this.graphics.node.convertToNodeSpaceAR(
            new cc.Vec3(touchPos.x, touchPos.y, 0)
        );
        return cc.v2(pos.x, pos.y);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
