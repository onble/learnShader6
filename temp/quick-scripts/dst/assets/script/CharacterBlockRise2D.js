
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
        this.applyTime();
        this._playing = true;
    };
    /** 外部逻辑可以按秒同步时间，例如技能时间轴。 */
    CharacterBlockRise2D.prototype.setTime = function (value) {
        if (!this._material) {
            return;
        }
        this._time = this.toCycleTime(value);
        this.applyTime();
    };
    CharacterBlockRise2D.prototype.applyTime = function () {
        if (this._material) {
            this._material.setProperty('time', this._time);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxDaGFyYWN0ZXJCbG9ja1Jpc2UyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUU1Qzs7O0dBR0c7QUFFSDtJQUFrRCx3Q0FBWTtJQUE5RDtRQUFBLHFFQWdLQztRQTdKRyxjQUFRLEdBQVksSUFBSSxDQUFDO1FBR3pCLG1CQUFhLEdBQVcsR0FBRyxDQUFDO1FBRzVCLG1CQUFhLEdBQVcsR0FBRyxDQUFDO1FBRzVCLG1CQUFhLEdBQVksSUFBSSxDQUFDO1FBRzlCLGlCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRWhCLGFBQU8sR0FBYyxJQUFJLENBQUM7UUFDMUIsZUFBUyxHQUF1QixJQUFJLENBQUM7UUFDN0MseUNBQXlDO1FBQ2pDLFdBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsY0FBUSxHQUFZLEtBQUssQ0FBQzs7SUEySXRDLENBQUM7SUF6SUcscUNBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZixFQUFFLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsT0FBTztTQUNWO1FBRUQsZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLFNB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SUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQTVKRDtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQzswREFDVjtJQUd6QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzsrREFDTjtJQUc1QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQzsrREFDUDtJQUc1QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQzsrREFDVDtJQUc5QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDOzZEQUN6QjtJQWZQLG9CQUFvQjtRQUR4QyxPQUFPO09BQ2Esb0JBQW9CLENBZ0t4QztJQUFELDJCQUFDO0NBaEtELEFBZ0tDLENBaEtpRCxFQUFFLENBQUMsU0FBUyxHQWdLN0Q7a0JBaEtvQixvQkFBb0IiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqIOmpseWKqOinkuiJsuiDjOWQjueahOeoi+W6j+WMluS4iuWNh+aWueWdl+eJueaViOOAglxuICog5bCG6ISa5pys5LiO5L2/55SoIGNoYXJhY3RlckJsb2NrUmlzZTJEIOadkOi0qOeahCBTcHJpdGUg5oyC5Zyo5ZCM5LiA5Liq6IqC54K55Y2z5Y+v44CCXG4gKi9cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFyYWN0ZXJCbG9ja1Jpc2UyRCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn6L+b5YWl5Zy65pmv5ZCO6Ieq5Yqo5pKt5pS+JyB9KVxuICAgIGF1dG9QbGF5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICfmlbTkvZPmkq3mlL7pgJ/luqblgI3njocnIH0pXG4gICAgcGxheWJhY2tTcGVlZDogbnVtYmVyID0gMS4wO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+WNleasoeW+queOr+aXtumVv++8iOenku+8iScgfSlcbiAgICBjeWNsZUR1cmF0aW9uOiBudW1iZXIgPSAxLjA7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn5a6M5oiQ5Y2V5qyh5b6q546v5ZCO5piv5ZCm57un57ut5pKt5pS+JyB9KVxuICAgIGxvb3BBbmltYXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+WIneWni+aXtumXtOWBj+enu++8m+WkmuS4quWunuS+i+WPr+Whq+S4jeWQjOWAvOS7pemBv+WFjeWujOWFqOWQjOatpScgfSlcbiAgICBzdGFydE9mZnNldDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgX3Nwcml0ZTogY2MuU3ByaXRlID0gbnVsbDtcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogY2MuTWF0ZXJpYWxWYXJpYW50ID0gbnVsbDtcbiAgICAvLyDkvKDnu5kgU2hhZGVyIOeahOaYryAwfjEg55qE5b2S5LiA5YyW5b6q546v5pe26Ze077yM5L6/5LqO5Yi25L2c5peg57yd55qE5LiA56eS5Yqo55S744CCXG4gICAgcHJpdmF0ZSBfdGltZTogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9wbGF5aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3Nwcml0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghdGhpcy5fc3ByaXRlKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbQ2hhcmFjdGVyQmxvY2tSaXNlMkRdIOW9k+WJjeiKgueCueS4iuayoeaciSBjYy5TcHJpdGXjgIInKTtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5q+P5LiqIFNwcml0ZSDpg73mjIHmnInni6znq4sgTWF0ZXJpYWxWYXJpYW5077yM6YG/5YWN5aSa5Liq6KeS6Imy5YWx5Lqr5pe26Ze05bGe5oCn44CCXG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gdGhpcy5fc3ByaXRlLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoIXRoaXMuX21hdGVyaWFsIHx8IHRoaXMuX21hdGVyaWFsLmdldFByb3BlcnR5KCd0aW1lJywgMCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2Mud2FybignW0NoYXJhY3RlckJsb2NrUmlzZTJEXSDor7flhYjnu5kgU3ByaXRlIOaMh+WumiBjaGFyYWN0ZXJCbG9ja1Jpc2UyRCDmnZDotKjjgIInKTtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMudG9DeWNsZVRpbWUodGhpcy5zdGFydE9mZnNldCk7XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaExheW91dCgpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgICAgIC8vIOWKqOaAgeWbvumbhumAmuW4uOWcqOmmluW4p+e7mOWItuaXtuWujOaIkOaPkuWFpe+8jOWboOatpOmmluW4p+WQjuWGjeivu+WPluS4gOasoeacgOe7iCBVVuOAglxuICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIHRoaXMucmVmcmVzaExheW91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZShkdDogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZyB8fCAhdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RpbWUgKz0gZHQgKiBNYXRoLm1heCgwLCB0aGlzLnBsYXliYWNrU3BlZWQpIC8gdGhpcy5zYWZlQ3ljbGVEdXJhdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5fdGltZSA+PSAxLjApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvb3BBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lICU9IDEuMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZSA9IDAuMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcHBseVRpbWUoKTtcbiAgICB9XG5cbiAgICAvKiog57un57ut5pKt5pS+77yM5Lqm5Y+v57uR5a6a5YiwIEJ1dHRvbiDnmoQgQ2xpY2sgRXZlbnRz44CCICovXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDmmoLlgZzlnKjlvZPliY3nlLvpnaLjgIIgKi9cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiDlm57liLAgc3RhcnRPZmZzZXQg5bm25byA5aeL5pKt5pS+77yb6KeS6Imy5YiH5o2i5pe25Y+v6LCD55So5q2k5pa55rOV44CCICovXG4gICAgcmVzdGFydCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMudG9DeWNsZVRpbWUodGhpcy5zdGFydE9mZnNldCk7XG4gICAgICAgIHRoaXMuYXBwbHlUaW1lKCk7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKiDlpJbpg6jpgLvovpHlj6/ku6XmjInnp5LlkIzmraXml7bpl7TvvIzkvovlpoLmioDog73ml7bpl7TovbTjgIIgKi9cbiAgICBzZXRUaW1lKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMudG9DeWNsZVRpbWUodmFsdWUpO1xuICAgICAgICB0aGlzLmFwcGx5VGltZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlUaW1lKCkge1xuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCd0aW1lJywgdGhpcy5fdGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhZmVDeWNsZUR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLjAxLCB0aGlzLmN5Y2xlRHVyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9DeWNsZVRpbWUodGltZUluU2Vjb25kczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY3ljbGVUaW1lID0gTWF0aC5tYXgoMCwgdGltZUluU2Vjb25kcykgLyB0aGlzLnNhZmVDeWNsZUR1cmF0aW9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvb3BBbmltYXRpb24gPyBjeWNsZVRpbWUgJSAxLjAgOiBNYXRoLm1pbihjeWNsZVRpbWUsIDEuMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoTGF5b3V0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSB8fCAhdGhpcy5fc3ByaXRlLnNwcml0ZUZyYW1lIHx8ICF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2FmZUhlaWdodCA9IE1hdGgubWF4KDAuMDAwMDAxLCBNYXRoLmFicyh0aGlzLm5vZGUuaGVpZ2h0KSk7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KFxuICAgICAgICAgICAgJ2FzcGVjdFJhdGlvJyxcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubm9kZS53aWR0aCkgLyBzYWZlSGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ29jb3MgMi40IOWKqOaAgeWQiOWbvuWQjiB2X3V2MCDkuI3lho3mmK8gMH4x77yM6ZyA6KaB5Lyg5YWl55yf5a6e5Zu+6ZuG5Yy65Z+f44CCXG4gICAgICAgIGNvbnN0IGZyYW1lVVYgPSB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWVbJ3V2J10gYXMgbnVtYmVyW107XG4gICAgICAgIGlmICghZnJhbWVVViB8fCBmcmFtZVVWLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtaW5VID0gZnJhbWVVVlswXTtcbiAgICAgICAgbGV0IG1heFUgPSBmcmFtZVVWWzBdO1xuICAgICAgICBsZXQgbWluViA9IGZyYW1lVVZbMV07XG4gICAgICAgIGxldCBtYXhWID0gZnJhbWVVVlsxXTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDI7IGluZGV4IDwgZnJhbWVVVi5sZW5ndGg7IGluZGV4ICs9IDIpIHtcbiAgICAgICAgICAgIG1pblUgPSBNYXRoLm1pbihtaW5VLCBmcmFtZVVWW2luZGV4XSk7XG4gICAgICAgICAgICBtYXhVID0gTWF0aC5tYXgobWF4VSwgZnJhbWVVVltpbmRleF0pO1xuICAgICAgICAgICAgbWluViA9IE1hdGgubWluKG1pblYsIGZyYW1lVVZbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICBtYXhWID0gTWF0aC5tYXgobWF4ViwgZnJhbWVVVltpbmRleCArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCd1dlJlY3QnLCBuZXcgY2MuVmVjNChcbiAgICAgICAgICAgIG1pblUsXG4gICAgICAgICAgICBtaW5WLFxuICAgICAgICAgICAgTWF0aC5tYXgoMC4wMDAwMDEsIG1heFUgLSBtaW5VKSxcbiAgICAgICAgICAgIE1hdGgubWF4KDAuMDAwMDAxLCBtYXhWIC0gbWluVilcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5yZWZyZXNoTGF5b3V0LCB0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IudGFyZ2V0T2ZmKHRoaXMpO1xuICAgIH1cbn1cbiJdfQ==