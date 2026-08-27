"use strict";
cc._RF.push(module, '508acW64W5BKJceRJZ9oUyl', 'ScratchCard');
// script/ScratchCard.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScratchCard = void 0;
var testCamera2_1 = require("./testCamera2");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ScratchCard = /** @class */ (function (_super) {
    __extends(ScratchCard, _super);
    function ScratchCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.texturePainter = null;
        _this.scratchRadius = 30;
        _this.isScratching = false;
        _this.lastPos = null;
        return _this;
    }
    ScratchCard.prototype.start = function () {
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
    };
    // 触摸开始：开始刮
    ScratchCard.prototype.onTouchStart = function (event) {
        this.isScratching = true;
        this.lastPos = this.getLocalTouchPos(event);
        this.drawDot(this.lastPos);
    };
    // 触摸结束：停止刮
    ScratchCard.prototype.onTouchEnd = function () {
        this.isScratching = false;
        this.lastPos = null;
    };
    // 触摸移动：绘制刮痕
    ScratchCard.prototype.onTouchMove = function (event) {
        if (!this.isScratching || !this.graphics)
            return;
        var localPos = this.getLocalTouchPos(event);
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
    };
    ScratchCard.prototype.drawDot = function (pos) {
        if (!this.graphics || !pos)
            return;
        this.graphics.circle(pos.x, pos.y, this.scratchRadius);
        this.graphics.fill();
        if (this.texturePainter) {
            this.texturePainter.commitStroke();
        }
    };
    ScratchCard.prototype.getLocalTouchPos = function (event) {
        var touchPos = event.getLocation();
        var pos = this.graphics.node.convertToNodeSpaceAR(new cc.Vec3(touchPos.x, touchPos.y, 0));
        return cc.v2(pos.x, pos.y);
    };
    ScratchCard.prototype.onDestroy = function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    };
    __decorate([
        property({ type: cc.Graphics, tooltip: CC_DEV && '刮痕绘制组件' })
    ], ScratchCard.prototype, "graphics", void 0);
    __decorate([
        property({ type: testCamera2_1.testCamera2, tooltip: CC_DEV && '将临时笔迹持久化到 RenderTexture' })
    ], ScratchCard.prototype, "texturePainter", void 0);
    __decorate([
        property({ tooltip: CC_DEV && '刮痕半径' })
    ], ScratchCard.prototype, "scratchRadius", void 0);
    ScratchCard = __decorate([
        ccclass
    ], ScratchCard);
    return ScratchCard;
}(cc.Component));
exports.ScratchCard = ScratchCard;

cc._RF.pop();