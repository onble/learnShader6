
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/CharacterBlockRise2D.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1d6a93PX1xPMbjtNhW8zhrs', 'CharacterBlockRise2D');
// script/CharacterBlockRise2D.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * 驱动角色背后的程序化上升方块特效。
 * 将脚本与使用 characterBlockRise2D 材质的 Sprite 挂在同一个节点即可。
 */
var CharacterBlockRise2D = /** @class */ (function (_super) {
    __extends(CharacterBlockRise2D, _super);
    function CharacterBlockRise2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoPlay = true;
        _this.playbackSpeed = 1.0;
        _this.cycleDuration = 1.0;
        _this.loopAnimation = true;
        _this.startOffset = 0;
        _this._sprite = null;
        _this._material = null;
        // 传给 Shader 的是 0~1 的归一化循环时间，便于制作无缝的一秒动画。
        _this._time = 0;
        // 宽度呼吸不跟随一秒循环重置，避免快速上升的碎片出现拍动感。
        _this._widthTime = 0;
        _this._playing = false;
        return _this;
    }
    CharacterBlockRise2D.prototype.onLoad = function () {
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) {
            cc.warn('[CharacterBlockRise2D] 当前节点上没有 cc.Sprite。');
            this.enabled = false;
            return;
        }
        // 每个 Sprite 都持有独立 MaterialVariant，避免多个角色共享时间属性。
        this._material = this._sprite.getMaterial(0);
        if (!this._material || this._material.getProperty('time', 0) === undefined) {
            cc.warn('[CharacterBlockRise2D] 请先给 Sprite 指定 characterBlockRise2D 材质。');
            this.enabled = false;
            return;
        }
        this._time = this.toCycleTime(this.startOffset);
        this._widthTime = Math.max(0, this.startOffset);
        this.applyTime();
        this.refreshLayout();
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshLayout, this);
        // 动态图集通常在首帧绘制时完成插入，因此首帧后再读取一次最终 UV。
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.refreshLayout, this);
    };
    CharacterBlockRise2D.prototype.start = function () {
        if (this.autoPlay) {
            this.play();
        }
    };
    CharacterBlockRise2D.prototype.update = function (dt) {
        if (!this._playing || !this._material) {
            return;
        }
        this._time += dt * Math.max(0, this.playbackSpeed) / this.safeCycleDuration();
        this._widthTime += dt * Math.max(0, this.playbackSpeed);
        if (this._widthTime > 4096) {
            this._widthTime %= 4096;
        }
        if (this._time >= 1.0) {
            if (this.loopAnimation) {
                this._time %= 1.0;
            }
            else {
                this._time = 0.0;
                this._playing = false;
            }
        }
        this.applyTime();
    };
    /** 继续播放，亦可绑定到 Button 的 Click Events。 */
    CharacterBlockRise2D.prototype.play = function () {
        if (this._material) {
            this._playing = true;
        }
    };
    /** 暂停在当前画面。 */
    CharacterBlockRise2D.prototype.pause = function () {
        this._playing = false;
    };
    /** 回到 startOffset 并开始播放；角色切换时可调用此方法。 */
    CharacterBlockRise2D.prototype.restart = function () {
        if (!this._material) {
            return;
        }
        this._time = this.toCycleTime(this.startOffset);
        this._widthTime = Math.max(0, this.startOffset);
        this.applyTime();
        this._playing = true;
    };
    /** 外部逻辑可以按秒同步时间，例如技能时间轴。 */
    CharacterBlockRise2D.prototype.setTime = function (value) {
        if (!this._material) {
            return;
        }
        this._time = this.toCycleTime(value);
        this._widthTime = Math.max(0, value);
        this.applyTime();
    };
    CharacterBlockRise2D.prototype.applyTime = function () {
        if (this._material) {
            this._material.setProperty('time', this._time);
            this._material.setProperty('widthTime', this._widthTime);
        }
    };
    CharacterBlockRise2D.prototype.safeCycleDuration = function () {
        return Math.max(0.01, this.cycleDuration);
    };
    CharacterBlockRise2D.prototype.toCycleTime = function (timeInSeconds) {
        var cycleTime = Math.max(0, timeInSeconds) / this.safeCycleDuration();
        return this.loopAnimation ? cycleTime % 1.0 : Math.min(cycleTime, 1.0);
    };
    CharacterBlockRise2D.prototype.refreshLayout = function () {
        if (!this._sprite || !this._sprite.spriteFrame || !this._material) {
            return;
        }
        var safeHeight = Math.max(0.000001, Math.abs(this.node.height));
        this._material.setProperty('aspectRatio', Math.abs(this.node.width) / safeHeight);
        // Cocos 2.4 动态合图后 v_uv0 不再是 0~1，需要传入真实图集区域。
        var frameUV = this._sprite.spriteFrame['uv'];
        if (!frameUV || frameUV.length < 8) {
            return;
        }
        var minU = frameUV[0];
        var maxU = frameUV[0];
        var minV = frameUV[1];
        var maxV = frameUV[1];
        for (var index = 2; index < frameUV.length; index += 2) {
            minU = Math.min(minU, frameUV[index]);
            maxU = Math.max(maxU, frameUV[index]);
            minV = Math.min(minV, frameUV[index + 1]);
            maxV = Math.max(maxV, frameUV[index + 1]);
        }
        this._material.setProperty('uvRect', new cc.Vec4(minU, minV, Math.max(0.000001, maxU - minU), Math.max(0.000001, maxV - minV)));
    };
    CharacterBlockRise2D.prototype.onDestroy = function () {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.refreshLayout, this);
        cc.director.targetOff(this);
    };
    __decorate([
        property({ tooltip: '进入场景后自动播放' })
    ], CharacterBlockRise2D.prototype, "autoPlay", void 0);
    __decorate([
        property({ tooltip: '整体播放速度倍率' })
    ], CharacterBlockRise2D.prototype, "playbackSpeed", void 0);
    __decorate([
        property({ tooltip: '单次循环时长（秒）' })
    ], CharacterBlockRise2D.prototype, "cycleDuration", void 0);
    __decorate([
        property({ tooltip: '完成单次循环后是否继续播放' })
    ], CharacterBlockRise2D.prototype, "loopAnimation", void 0);
    __decorate([
        property({ tooltip: '初始时间偏移；多个实例可填不同值以避免完全同步' })
    ], CharacterBlockRise2D.prototype, "startOffset", void 0);
    CharacterBlockRise2D = __decorate([
        ccclass
    ], CharacterBlockRise2D);
    return CharacterBlockRise2D;
}(cc.Component));
exports.default = CharacterBlockRise2D;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxDaGFyYWN0ZXJCbG9ja1Jpc2UyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUU1Qzs7O0dBR0c7QUFFSDtJQUFrRCx3Q0FBWTtJQUE5RDtRQUFBLHFFQTBLQztRQXZLRyxjQUFRLEdBQVksSUFBSSxDQUFDO1FBR3pCLG1CQUFhLEdBQVcsR0FBRyxDQUFDO1FBRzVCLG1CQUFhLEdBQVcsR0FBRyxDQUFDO1FBRzVCLG1CQUFhLEdBQVksSUFBSSxDQUFDO1FBRzlCLGlCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRWhCLGFBQU8sR0FBYyxJQUFJLENBQUM7UUFDMUIsZUFBUyxHQUF1QixJQUFJLENBQUM7UUFDN0MseUNBQXlDO1FBQ2pDLFdBQUssR0FBVyxDQUFDLENBQUM7UUFDMUIsZ0NBQWdDO1FBQ3hCLGdCQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGNBQVEsR0FBWSxLQUFLLENBQUM7O0lBbUp0QyxDQUFDO0lBakpHLHFDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsRUFBRSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU87U0FDVjtRQUVELGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENB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aUQsRUFBRSxDQUFDLFNBQVMsR0EwSzdEO2tCQTFLb0Isb0JBQW9CIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcblxuLyoqXG4gKiDpqbHliqjop5LoibLog4zlkI7nmoTnqIvluo/ljJbkuIrljYfmlrnlnZfnibnmlYjjgIJcbiAqIOWwhuiEmuacrOS4juS9v+eUqCBjaGFyYWN0ZXJCbG9ja1Jpc2UyRCDmnZDotKjnmoQgU3ByaXRlIOaMguWcqOWQjOS4gOS4quiKgueCueWNs+WPr+OAglxuICovXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhcmFjdGVyQmxvY2tSaXNlMkQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+i/m+WFpeWcuuaZr+WQjuiHquWKqOaSreaUvicgfSlcbiAgICBhdXRvUGxheTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn5pW05L2T5pKt5pS+6YCf5bqm5YCN546HJyB9KVxuICAgIHBsYXliYWNrU3BlZWQ6IG51bWJlciA9IDEuMDtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICfljZXmrKHlvqrnjq/ml7bplb/vvIjnp5LvvIknIH0pXG4gICAgY3ljbGVEdXJhdGlvbjogbnVtYmVyID0gMS4wO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+WujOaIkOWNleasoeW+queOr+WQjuaYr+WQpue7p+e7reaSreaUvicgfSlcbiAgICBsb29wQW5pbWF0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICfliJ3lp4vml7bpl7TlgY/np7vvvJvlpJrkuKrlrp7kvovlj6/loavkuI3lkIzlgLzku6Xpgb/lhY3lrozlhajlkIzmraUnIH0pXG4gICAgc3RhcnRPZmZzZXQ6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIF9zcHJpdGU6IGNjLlNwcml0ZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWw6IGNjLk1hdGVyaWFsVmFyaWFudCA9IG51bGw7XG4gICAgLy8g5Lyg57uZIFNoYWRlciDnmoTmmK8gMH4xIOeahOW9kuS4gOWMluW+queOr+aXtumXtO+8jOS+v+S6juWItuS9nOaXoOe8neeahOS4gOenkuWKqOeUu+OAglxuICAgIHByaXZhdGUgX3RpbWU6IG51bWJlciA9IDA7XG4gICAgLy8g5a695bqm5ZG85ZC45LiN6Lef6ZqP5LiA56eS5b6q546v6YeN572u77yM6YG/5YWN5b+r6YCf5LiK5Y2H55qE56KO54mH5Ye6546w5ouN5Yqo5oSf44CCXG4gICAgcHJpdmF0ZSBfd2lkdGhUaW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX3BsYXlpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1tDaGFyYWN0ZXJCbG9ja1Jpc2UyRF0g5b2T5YmN6IqC54K55LiK5rKh5pyJIGNjLlNwcml0ZeOAgicpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/kuKogU3ByaXRlIOmDveaMgeacieeLrOeriyBNYXRlcmlhbFZhcmlhbnTvvIzpgb/lhY3lpJrkuKrop5LoibLlhbHkuqvml7bpl7TlsZ7mgKfjgIJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB0aGlzLl9zcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWwgfHwgdGhpcy5fbWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ3RpbWUnLCAwKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbQ2hhcmFjdGVyQmxvY2tSaXNlMkRdIOivt+WFiOe7mSBTcHJpdGUg5oyH5a6aIGNoYXJhY3RlckJsb2NrUmlzZTJEIOadkOi0qOOAgicpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90aW1lID0gdGhpcy50b0N5Y2xlVGltZSh0aGlzLnN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgdGhpcy5fd2lkdGhUaW1lID0gTWF0aC5tYXgoMCwgdGhpcy5zdGFydE9mZnNldCk7XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaExheW91dCgpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgICAgIC8vIOWKqOaAgeWbvumbhumAmuW4uOWcqOmmluW4p+e7mOWItuaXtuWujOaIkOaPkuWFpe+8jOWboOatpOmmluW4p+WQjuWGjeivu+WPluS4gOasoeacgOe7iCBVVuOAglxuICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZShkdDogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZyB8fCAhdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RpbWUgKz0gZHQgKiBNYXRoLm1heCgwLCB0aGlzLnBsYXliYWNrU3BlZWQpIC8gdGhpcy5zYWZlQ3ljbGVEdXJhdGlvbigpO1xuICAgICAgICB0aGlzLl93aWR0aFRpbWUgKz0gZHQgKiBNYXRoLm1heCgwLCB0aGlzLnBsYXliYWNrU3BlZWQpO1xuICAgICAgICBpZiAodGhpcy5fd2lkdGhUaW1lID4gNDA5Nikge1xuICAgICAgICAgICAgdGhpcy5fd2lkdGhUaW1lICU9IDQwOTY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3RpbWUgPj0gMS4wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb29wQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZSAlPSAxLjA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RpbWUgPSAwLjA7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgfVxuXG4gICAgLyoqIOe7p+e7reaSreaUvu+8jOS6puWPr+e7keWumuWIsCBCdXR0b24g55qEIENsaWNrIEV2ZW50c+OAgiAqL1xuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5pqC5YGc5Zyo5b2T5YmN55S76Z2i44CCICovXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiog5Zue5YiwIHN0YXJ0T2Zmc2V0IOW5tuW8gOWni+aSreaUvu+8m+inkuiJsuWIh+aNouaXtuWPr+iwg+eUqOatpOaWueazleOAgiAqL1xuICAgIHJlc3RhcnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLnRvQ3ljbGVUaW1lKHRoaXMuc3RhcnRPZmZzZXQpO1xuICAgICAgICB0aGlzLl93aWR0aFRpbWUgPSBNYXRoLm1heCgwLCB0aGlzLnN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgdGhpcy5hcHBseVRpbWUoKTtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqIOWklumDqOmAu+i+keWPr+S7peaMieenkuWQjOatpeaXtumXtO+8jOS+i+WmguaKgOiDveaXtumXtOi9tOOAgiAqL1xuICAgIHNldFRpbWUodmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90aW1lID0gdGhpcy50b0N5Y2xlVGltZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3dpZHRoVGltZSA9IE1hdGgubWF4KDAsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5hcHBseVRpbWUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5VGltZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGltZScsIHRoaXMuX3RpbWUpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3dpZHRoVGltZScsIHRoaXMuX3dpZHRoVGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhZmVDeWNsZUR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLjAxLCB0aGlzLmN5Y2xlRHVyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9DeWNsZVRpbWUodGltZUluU2Vjb25kczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY3ljbGVUaW1lID0gTWF0aC5tYXgoMCwgdGltZUluU2Vjb25kcykgLyB0aGlzLnNhZmVDeWNsZUR1cmF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb3BBbmltYXRpb24gPyBjeWNsZVRpbWUgJSAxLjAgOiBNYXRoLm1pbihjeWNsZVRpbWUsIDEuMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoTGF5b3V0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSB8fCAhdGhpcy5fc3ByaXRlLnNwcml0ZUZyYW1lIHx8ICF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2FmZUhlaWdodCA9IE1hdGgubWF4KDAuMDAwMDAxLCBNYXRoLmFicyh0aGlzLm5vZGUuaGVpZ2h0KSk7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KFxuICAgICAgICAgICAgJ2FzcGVjdFJhdGlvJyxcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubm9kZS53aWR0aCkgLyBzYWZlSGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ29jb3MgMi40IOWKqOaAgeWQiOWbvuWQjiB2X3V2MCDkuI3lho3mmK8gMH4x77yM6ZyA6KaB5Lyg5YWl55yf5a6e5Zu+6ZuG5Yy65Z+f44CCXG4gICAgICAgIGNvbnN0IGZyYW1lVVYgPSB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWVbJ3V2J10gYXMgbnVtYmVyW107XG4gICAgICAgIGlmICghZnJhbWVVViB8fCBmcmFtZVVWLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtaW5VID0gZnJhbWVVVlswXTtcbiAgICAgICAgbGV0IG1heFUgPSBmcmFtZVVWWzBdO1xuICAgICAgICBsZXQgbWluViA9IGZyYW1lVVZbMV07XG4gICAgICAgIGxldCBtYXhWID0gZnJhbWVVVlsxXTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDI7IGluZGV4IDwgZnJhbWVVVi5sZW5ndGg7IGluZGV4ICs9IDIpIHtcbiAgICAgICAgICAgIG1pblUgPSBNYXRoLm1pbihtaW5VLCBmcmFtZVVWW2luZGV4XSk7XG4gICAgICAgICAgICBtYXhVID0gTWF0aC5tYXgobWF4VSwgZnJhbWVVVltpbmRleF0pO1xuICAgICAgICAgICAgbWluViA9IE1hdGgubWluKG1pblYsIGZyYW1lVVZbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICBtYXhWID0gTWF0aC5tYXgobWF4ViwgZnJhbWVVVltpbmRleCArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCd1dlJlY3QnLCBuZXcgY2MuVmVjNChcbiAgICAgICAgICAgIG1pblUsXG4gICAgICAgICAgICBtaW5WLFxuICAgICAgICAgICAgTWF0aC5tYXgoMC4wMDAwMDEsIG1heFUgLSBtaW5VKSxcbiAgICAgICAgICAgIE1hdGgubWF4KDAuMDAwMDAxLCBtYXhWIC0gbWluVilcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5yZWZyZXNoTGF5b3V0LCB0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IudGFyZ2V0T2ZmKHRoaXMpO1xuICAgIH1cbn1cbiJdfQ==