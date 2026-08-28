
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
        _this.startOffset = 0;
        _this._sprite = null;
        _this._material = null;
        _this._time = 0;
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
        this._time = Math.max(0, this.startOffset);
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
        this._time += dt * Math.max(0, this.playbackSpeed);
        // 防止游戏长时间运行后 GPU 浮点精度下降；视觉图案不会因此跳变。
        if (this._time > 4096) {
            this._time %= 4096;
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
    /** 回到 startOffset 并开始播放。 */
    CharacterBlockRise2D.prototype.restart = function () {
        if (!this._material) {
            return;
        }
        this._time = Math.max(0, this.startOffset);
        this.applyTime();
        this._playing = true;
    };
    /** 外部逻辑可以直接同步时间，例如技能时间轴。 */
    CharacterBlockRise2D.prototype.setTime = function (value) {
        if (!this._material) {
            return;
        }
        this._time = Math.max(0, value);
        this.applyTime();
    };
    CharacterBlockRise2D.prototype.applyTime = function () {
        if (this._material) {
            this._material.setProperty('time', this._time);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxDaGFyYWN0ZXJCbG9ja1Jpc2UyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUU1Qzs7O0dBR0c7QUFFSDtJQUFrRCx3Q0FBWTtJQUE5RDtRQUFBLHFFQTRJQztRQXpJRyxjQUFRLEdBQVksSUFBSSxDQUFDO1FBR3pCLG1CQUFhLEdBQVcsR0FBRyxDQUFDO1FBRzVCLGlCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRWhCLGFBQU8sR0FBYyxJQUFJLENBQUM7UUFDMUIsZUFBUyxHQUF1QixJQUFJLENBQUM7UUFDckMsV0FBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixjQUFRLEdBQVksS0FBSyxDQUFDOztJQThIdEMsQ0FBQztJQTVIRyxxQ0FBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixPQUFPO1NBQ1Y7UUFFRCxnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3hFLEVBQUUsQ0FBQyxJQUFJLENBQUMsK0RBQStELENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMs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QUVELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQzVDLElBQUksRUFDSixJQUFJLEVBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQ2xDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx3Q0FBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQXhJRDtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQzswREFDVjtJQUd6QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzsrREFDTjtJQUc1QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDOzZEQUN6QjtJQVRQLG9CQUFvQjtRQUR4QyxPQUFPO09BQ2Esb0JBQW9CLENBNEl4QztJQUFELDJCQUFDO0NBNUlELEFBNElDLENBNUlpRCxFQUFFLENBQUMsU0FBUyxHQTRJN0Q7a0JBNUlvQixvQkFBb0IiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqIOmpseWKqOinkuiJsuiDjOWQjueahOeoi+W6j+WMluS4iuWNh+aWueWdl+eJueaViOOAglxuICog5bCG6ISa5pys5LiO5L2/55SoIGNoYXJhY3RlckJsb2NrUmlzZTJEIOadkOi0qOeahCBTcHJpdGUg5oyC5Zyo5ZCM5LiA5Liq6IqC54K55Y2z5Y+v44CCXG4gKi9cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFyYWN0ZXJCbG9ja1Jpc2UyRCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn6L+b5YWl5Zy65pmv5ZCO6Ieq5Yqo5pKt5pS+JyB9KVxuICAgIGF1dG9QbGF5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICfmlbTkvZPmkq3mlL7pgJ/luqblgI3njocnIH0pXG4gICAgcGxheWJhY2tTcGVlZDogbnVtYmVyID0gMS4wO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+WIneWni+aXtumXtOWBj+enu++8m+WkmuS4quWunuS+i+WPr+Whq+S4jeWQjOWAvOS7pemBv+WFjeWujOWFqOWQjOatpScgfSlcbiAgICBzdGFydE9mZnNldDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgX3Nwcml0ZTogY2MuU3ByaXRlID0gbnVsbDtcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogY2MuTWF0ZXJpYWxWYXJpYW50ID0gbnVsbDtcbiAgICBwcml2YXRlIF90aW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX3BsYXlpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1tDaGFyYWN0ZXJCbG9ja1Jpc2UyRF0g5b2T5YmN6IqC54K55LiK5rKh5pyJIGNjLlNwcml0ZeOAgicpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/kuKogU3ByaXRlIOmDveaMgeacieeLrOeriyBNYXRlcmlhbFZhcmlhbnTvvIzpgb/lhY3lpJrkuKrop5LoibLlhbHkuqvml7bpl7TlsZ7mgKfjgIJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB0aGlzLl9zcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWwgfHwgdGhpcy5fbWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ3RpbWUnLCAwKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbQ2hhcmFjdGVyQmxvY2tSaXNlMkRdIOivt+WFiOe7mSBTcHJpdGUg5oyH5a6aIGNoYXJhY3RlckJsb2NrUmlzZTJEIOadkOi0qOOAgicpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90aW1lID0gTWF0aC5tYXgoMCwgdGhpcy5zdGFydE9mZnNldCk7XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaExheW91dCgpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgICAgIC8vIOWKqOaAgeWbvumbhumAmuW4uOWcqOmmluW4p+e7mOWItuaXtuWujOaIkOaPkuWFpe+8jOWboOatpOmmluW4p+WQjuWGjeivu+WPluS4gOasoeacgOe7iCBVVuOAglxuICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZShkdDogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZyB8fCAhdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RpbWUgKz0gZHQgKiBNYXRoLm1heCgwLCB0aGlzLnBsYXliYWNrU3BlZWQpO1xuICAgICAgICAvLyDpmLLmraLmuLjmiI/plb/ml7bpl7Tov5DooYzlkI4gR1BVIOa1rueCueeyvuW6puS4i+mZje+8m+inhuinieWbvuahiOS4jeS8muWboOatpOi3s+WPmOOAglxuICAgICAgICBpZiAodGhpcy5fdGltZSA+IDQwOTYpIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgJT0gNDA5NjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFwcGx5VGltZSgpO1xuICAgIH1cblxuICAgIC8qKiDnu6fnu63mkq3mlL7vvIzkuqblj6/nu5HlrprliLAgQnV0dG9uIOeahCBDbGljayBFdmVudHPjgIIgKi9cbiAgICBwbGF5KCkge1xuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOaaguWBnOWcqOW9k+WJjeeUu+mdouOAgiAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIOWbnuWIsCBzdGFydE9mZnNldCDlubblvIDlp4vmkq3mlL7jgIIgKi9cbiAgICByZXN0YXJ0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90aW1lID0gTWF0aC5tYXgoMCwgdGhpcy5zdGFydE9mZnNldCk7XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKiDlpJbpg6jpgLvovpHlj6/ku6Xnm7TmjqXlkIzmraXml7bpl7TvvIzkvovlpoLmioDog73ml7bpl7TovbTjgIIgKi9cbiAgICBzZXRUaW1lKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IE1hdGgubWF4KDAsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5hcHBseVRpbWUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5VGltZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGltZScsIHRoaXMuX3RpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoTGF5b3V0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSB8fCAhdGhpcy5fc3ByaXRlLnNwcml0ZUZyYW1lIHx8ICF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2FmZUhlaWdodCA9IE1hdGgubWF4KDAuMDAwMDAxLCBNYXRoLmFicyh0aGlzLm5vZGUuaGVpZ2h0KSk7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KFxuICAgICAgICAgICAgJ2FzcGVjdFJhdGlvJyxcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubm9kZS53aWR0aCkgLyBzYWZlSGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ29jb3MgMi40IOWKqOaAgeWQiOWbvuWQjiB2X3V2MCDkuI3lho3mmK8gMH4x77yM6ZyA6KaB5Lyg5YWl55yf5a6e5Zu+6ZuG5Yy65Z+f44CCXG4gICAgICAgIGNvbnN0IGZyYW1lVVYgPSB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWVbJ3V2J10gYXMgbnVtYmVyW107XG4gICAgICAgIGlmICghZnJhbWVVViB8fCBmcmFtZVVWLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtaW5VID0gZnJhbWVVVlswXTtcbiAgICAgICAgbGV0IG1heFUgPSBmcmFtZVVWWzBdO1xuICAgICAgICBsZXQgbWluViA9IGZyYW1lVVZbMV07XG4gICAgICAgIGxldCBtYXhWID0gZnJhbWVVVlsxXTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDI7IGluZGV4IDwgZnJhbWVVVi5sZW5ndGg7IGluZGV4ICs9IDIpIHtcbiAgICAgICAgICAgIG1pblUgPSBNYXRoLm1pbihtaW5VLCBmcmFtZVVWW2luZGV4XSk7XG4gICAgICAgICAgICBtYXhVID0gTWF0aC5tYXgobWF4VSwgZnJhbWVVVltpbmRleF0pO1xuICAgICAgICAgICAgbWluViA9IE1hdGgubWluKG1pblYsIGZyYW1lVVZbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICBtYXhWID0gTWF0aC5tYXgobWF4ViwgZnJhbWVVVltpbmRleCArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCd1dlJlY3QnLCBuZXcgY2MuVmVjNChcbiAgICAgICAgICAgIG1pblUsXG4gICAgICAgICAgICBtaW5WLFxuICAgICAgICAgICAgTWF0aC5tYXgoMC4wMDAwMDEsIG1heFUgLSBtaW5VKSxcbiAgICAgICAgICAgIE1hdGgubWF4KDAuMDAwMDAxLCBtYXhWIC0gbWluVilcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5yZWZyZXNoTGF5b3V0LCB0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IudGFyZ2V0T2ZmKHRoaXMpO1xuICAgIH1cbn1cbiJdfQ==