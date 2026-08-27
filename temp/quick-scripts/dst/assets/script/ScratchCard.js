
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ScratchCard.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxTY3JhdGNoQ2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTRDO0FBRXRDLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQWlDLCtCQUFZO0lBQTdDO1FBQUEscUVBMEZDO1FBdkZVLGNBQVEsR0FBZ0IsSUFBSSxDQUFDO1FBRzVCLG9CQUFjLEdBQWdCLElBQUksQ0FBQztRQUduQyxtQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUVuQixrQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixhQUFPLEdBQVksSUFBSSxDQUFDOztJQThFcEMsQ0FBQztJQTVFRywyQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hDLEVBQUUsQ0FBQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxD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UUFEQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLE1BQU0sRUFBRSxDQUFDO3NEQUNiO0lBVGxCLFdBQVc7UUFEdkIsT0FBTztPQUNLLFdBQVcsQ0EwRnZCO0lBQUQsa0JBQUM7Q0ExRkQsQUEwRkMsQ0ExRmdDLEVBQUUsQ0FBQyxTQUFTLEdBMEY1QztBQTFGWSxrQ0FBVyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRlc3RDYW1lcmEyIH0gZnJvbSAnLi90ZXN0Q2FtZXJhMic7XHJcblxyXG5jb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIFNjcmF0Y2hDYXJkIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5HcmFwaGljcywgdG9vbHRpcDogQ0NfREVWICYmICfliK7nl5Xnu5jliLbnu4Tku7YnIH0pXHJcbiAgICBwdWJsaWMgZ3JhcGhpY3M6IGNjLkdyYXBoaWNzID0gbnVsbDtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0eXBlOiB0ZXN0Q2FtZXJhMiwgdG9vbHRpcDogQ0NfREVWICYmICflsIbkuLTml7bnrJTov7nmjIHkuYXljJbliLAgUmVuZGVyVGV4dHVyZScgfSlcclxuICAgIHByaXZhdGUgdGV4dHVyZVBhaW50ZXI6IHRlc3RDYW1lcmEyID0gbnVsbDtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiBDQ19ERVYgJiYgJ+WIrueXleWNiuW+hCcgfSlcclxuICAgIHByaXZhdGUgc2NyYXRjaFJhZGl1cyA9IDMwO1xyXG5cclxuICAgIHByaXZhdGUgaXNTY3JhdGNoaW5nID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGxhc3RQb3M6IGNjLlZlYzIgPSBudWxsO1xyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ncmFwaGljcyB8fCAhdGhpcy50ZXh0dXJlUGFpbnRlcikge1xyXG4gICAgICAgICAgICBjYy5lcnJvcignW1NjcmF0Y2hDYXJkXSBncmFwaGljcyDlkowgdGV4dHVyZVBhaW50ZXIg5b+F6aG76K6+572uJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmZpbGxDb2xvciA9IGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmxpbmVXaWR0aCA9IHRoaXMuc2NyYXRjaFJhZGl1cyAqIDI7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5saW5lQ2FwID0gY2MuR3JhcGhpY3MuTGluZUNhcC5ST1VORDtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmxpbmVKb2luID0gY2MuR3JhcGhpY3MuTGluZUpvaW4uUk9VTkQ7XHJcblxyXG4gICAgICAgIC8vIOe7keWumuinpuaRuOS6i+S7tlxyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Kem5pG45byA5aeL77ya5byA5aeL5YiuXHJcbiAgICBvblRvdWNoU3RhcnQoZXZlbnQ6IGNjLkV2ZW50LkV2ZW50VG91Y2gpIHtcclxuICAgICAgICB0aGlzLmlzU2NyYXRjaGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sYXN0UG9zID0gdGhpcy5nZXRMb2NhbFRvdWNoUG9zKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmRyYXdEb3QodGhpcy5sYXN0UG9zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDop6bmkbjnu5PmnZ/vvJrlgZzmraLliK5cclxuICAgIG9uVG91Y2hFbmQoKSB7XHJcbiAgICAgICAgdGhpcy5pc1NjcmF0Y2hpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxhc3RQb3MgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOinpuaRuOenu+WKqO+8mue7mOWItuWIrueXlVxyXG4gICAgb25Ub3VjaE1vdmUoZXZlbnQ6IGNjLkV2ZW50LkV2ZW50VG91Y2gpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTY3JhdGNoaW5nIHx8ICF0aGlzLmdyYXBoaWNzKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsUG9zID0gdGhpcy5nZXRMb2NhbFRvdWNoUG9zKGV2ZW50KTtcclxuICAgICAgICBpZiAoIXRoaXMubGFzdFBvcykge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdEb3QobG9jYWxQb3MpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3MgPSBsb2NhbFBvcztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5tb3ZlVG8odGhpcy5sYXN0UG9zLngsIHRoaXMubGFzdFBvcy55KTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmxpbmVUbyhsb2NhbFBvcy54LCBsb2NhbFBvcy55KTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLnN0cm9rZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnRleHR1cmVQYWludGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZVBhaW50ZXIuY29tbWl0U3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdFBvcyA9IGxvY2FsUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0RvdChwb3M6IGNjLlZlYzIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ3JhcGhpY3MgfHwgIXBvcykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MuY2lyY2xlKHBvcy54LCBwb3MueSwgdGhpcy5zY3JhdGNoUmFkaXVzKTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmZpbGwoKTtcclxuICAgICAgICBpZiAodGhpcy50ZXh0dXJlUGFpbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVQYWludGVyLmNvbW1pdFN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldExvY2FsVG91Y2hQb3MoZXZlbnQ6IGNjLkV2ZW50LkV2ZW50VG91Y2gpIHtcclxuICAgICAgICBjb25zdCB0b3VjaFBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy5ncmFwaGljcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKFxyXG4gICAgICAgICAgICBuZXcgY2MuVmVjMyh0b3VjaFBvcy54LCB0b3VjaFBvcy55LCAwKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGNjLnYyKHBvcy54LCBwb3MueSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25Ub3VjaE1vdmUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==