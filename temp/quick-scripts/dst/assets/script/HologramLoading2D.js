
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/HologramLoading2D.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8aa68M55tVPnKOl/465IQyl', 'HologramLoading2D');
// script/HologramLoading2D.ts

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
 * 驱动 hologramLoading2D 材质的 progress 属性。
 * 将脚本与使用该材质的 Sprite 挂在同一个节点即可。
 */
var HologramLoading2D = /** @class */ (function (_super) {
    __extends(HologramLoading2D, _super);
    function HologramLoading2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoPlay = true;
        _this.loop = false;
        _this.delay = 0;
        _this.duration = 1.0;
        _this._sprite = null;
        _this._material = null;
        _this._elapsed = 0;
        _this._playing = false;
        return _this;
    }
    HologramLoading2D.prototype.onLoad = function () {
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) {
            cc.warn('[HologramLoading2D] 当前节点上没有 cc.Sprite。');
            this.enabled = false;
            return;
        }
        // getMaterial 会返回属于当前 RenderComponent 的 MaterialVariant，
        // 修改 progress 不会影响使用同一材质资源的其他 Sprite。
        this._material = this._sprite.getMaterial(0);
        if (!this._material || this._material.getProperty('progress', 0) === undefined) {
            cc.warn('[HologramLoading2D] 请先给 Sprite 指定 hologramLoading2D 材质。');
            this.enabled = false;
            return;
        }
        this.setProgress(0);
        this.refreshUVRect();
        // 动态图集通常在首帧渲染时完成插入；首帧后再读取一次最终 UV。
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.refreshUVRect, this);
    };
    HologramLoading2D.prototype.start = function () {
        if (this.autoPlay) {
            this.play();
        }
    };
    HologramLoading2D.prototype.update = function (dt) {
        if (!this._playing || !this._material) {
            return;
        }
        this._elapsed += dt;
        if (this._elapsed < Math.max(0, this.delay)) {
            return;
        }
        var safeDuration = Math.max(0.001, this.duration);
        var linearProgress = Math.min(1, (this._elapsed - Math.max(0, this.delay)) / safeDuration);
        // smoothstep 缓动：起止阶段更柔和，中段仍保持明确的扫描速度。
        var easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress);
        this.setProgress(easedProgress);
        if (linearProgress >= 1) {
            if (this.loop) {
                this._elapsed = 0;
                this.setProgress(0);
            }
            else {
                this._playing = false;
            }
        }
    };
    /** 从头播放，亦可绑定到 Button 的 Click Events。 */
    HologramLoading2D.prototype.play = function () {
        if (!this._material) {
            return;
        }
        this._elapsed = 0;
        this._playing = true;
        this.setProgress(0);
    };
    /** 暂停在当前进度。 */
    HologramLoading2D.prototype.pause = function () {
        this._playing = false;
    };
    /** 外部加载器也可以直接用该方法同步真实加载进度。 */
    HologramLoading2D.prototype.setProgress = function (value) {
        if (!this._material) {
            return;
        }
        var clampedValue = Math.max(0, Math.min(1, value));
        this._material.setProperty('progress', clampedValue);
    };
    HologramLoading2D.prototype.refreshUVRect = function () {
        if (!this._sprite || !this._sprite.spriteFrame || !this._material) {
            return;
        }
        // Cocos 2.4 会在运行时把可合图的 SpriteFrame 放入动态大图集。
        // v_uv0 此时不再是 0~1，因此必须把实际图集区域传给 Shader 归一化。
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
    HologramLoading2D.prototype.onDestroy = function () {
        cc.director.targetOff(this);
    };
    __decorate([
        property({ tooltip: '自动播放一次加载动画' })
    ], HologramLoading2D.prototype, "autoPlay", void 0);
    __decorate([
        property({ tooltip: '是否循环播放' })
    ], HologramLoading2D.prototype, "loop", void 0);
    __decorate([
        property({ tooltip: '开始播放前的等待时间（秒）' })
    ], HologramLoading2D.prototype, "delay", void 0);
    __decorate([
        property({ tooltip: '一次加载动画的持续时间（秒）' })
    ], HologramLoading2D.prototype, "duration", void 0);
    HologramLoading2D = __decorate([
        ccclass
    ], HologramLoading2D);
    return HologramLoading2D;
}(cc.Component));
exports.default = HologramLoading2D;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxIb2xvZ3JhbUxvYWRpbmcyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUU1Qzs7O0dBR0c7QUFFSDtJQUErQyxxQ0FBWTtJQUEzRDtRQUFBLHFFQTRJQztRQXpJRyxjQUFRLEdBQVksSUFBSSxDQUFDO1FBR3pCLFVBQUksR0FBWSxLQUFLLENBQUM7UUFHdEIsV0FBSyxHQUFXLENBQUMsQ0FBQztRQUdsQixjQUFRLEdBQVcsR0FBRyxDQUFDO1FBRWYsYUFBTyxHQUFjLElBQUksQ0FBQztRQUMxQixlQUFTLEdBQXVCLElBQUksQ0FBQztRQUNyQyxjQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGNBQVEsR0FBWSxLQUFLLENBQUM7O0lBMkh0QyxDQUFDO0lBekhHLGtDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsRUFBRSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU87U0FDVjtRQUVELHlEQUF5RDtRQUN6RCxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzVFLEVBQUUsQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQixrQ0FBa0M7UUFDbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxpQ0FBSyxHQUFMO1FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLEVBQVU7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkMsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QyxPQUFPO1NBQ1Y7UUFFRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDM0IsQ0FBQyxFQUNELENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQzNELENBQUM7UUFFRixzQ0FBc0M7UUFDdEMsSUFBTSxhQUFhLEdBQUcsY0FBYyxHQUFHLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVoQyxJQUFJLGNBQWMsSUFBSSxDQUFDLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO2lCQUFNO2dCQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3pCO1NBQ0o7SUFDTCxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLGdDQUFJLEdBQUo7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNqQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxlQUFlO0lBQ2YsaUNBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsdUNBQVcsR0FBWCxVQUFZLEtBQWE7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTztTQUNWO1FBRUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVPLHlDQUFhLEdBQXJCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDL0QsT0FBTztTQUNWO1FBRUQsNENBQTRDO1FBQzVDLDRDQUE0QztRQUM1QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQWEsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ3BELElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FDNUMsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsQ0FDbEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHFDQUFTLEdBQVQ7UUFDSSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBeElEO1FBREMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDO3VEQUNYO0lBR3pCO1FBREMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO21EQUNWO0lBR3RCO1FBREMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDO29EQUNyQjtJQUdsQjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO3VEQUNqQjtJQVpOLGlCQUFpQjtRQURyQyxPQUFPO09BQ2EsaUJBQWlCLENBNElyQztJQUFELHdCQUFDO0NBNUlELEFBNElDLENBNUk4QyxFQUFFLENBQUMsU0FBUyxHQTRJMUQ7a0JBNUlvQixpQkFBaUIiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKipcbiAqIOmpseWKqCBob2xvZ3JhbUxvYWRpbmcyRCDmnZDotKjnmoQgcHJvZ3Jlc3Mg5bGe5oCn44CCXG4gKiDlsIbohJrmnKzkuI7kvb/nlKjor6XmnZDotKjnmoQgU3ByaXRlIOaMguWcqOWQjOS4gOS4quiKgueCueWNs+WPr+OAglxuICovXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9sb2dyYW1Mb2FkaW5nMkQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+iHquWKqOaSreaUvuS4gOasoeWKoOi9veWKqOeUuycgfSlcbiAgICBhdXRvUGxheTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn5piv5ZCm5b6q546v5pKt5pS+JyB9KVxuICAgIGxvb3A6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICflvIDlp4vmkq3mlL7liY3nmoTnrYnlvoXml7bpl7TvvIjnp5LvvIknIH0pXG4gICAgZGVsYXk6IG51bWJlciA9IDA7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn5LiA5qyh5Yqg6L295Yqo55S755qE5oyB57ut5pe26Ze077yI56eS77yJJyB9KVxuICAgIGR1cmF0aW9uOiBudW1iZXIgPSAxLjA7XG5cbiAgICBwcml2YXRlIF9zcHJpdGU6IGNjLlNwcml0ZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWw6IGNjLk1hdGVyaWFsVmFyaWFudCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZWxhcHNlZDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9wbGF5aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3Nwcml0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghdGhpcy5fc3ByaXRlKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbSG9sb2dyYW1Mb2FkaW5nMkRdIOW9k+WJjeiKgueCueS4iuayoeaciSBjYy5TcHJpdGXjgIInKTtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0TWF0ZXJpYWwg5Lya6L+U5Zue5bGe5LqO5b2T5YmNIFJlbmRlckNvbXBvbmVudCDnmoQgTWF0ZXJpYWxWYXJpYW5077yMXG4gICAgICAgIC8vIOS/ruaUuSBwcm9ncmVzcyDkuI3kvJrlvbHlk43kvb/nlKjlkIzkuIDmnZDotKjotYTmupDnmoTlhbbku5YgU3ByaXRl44CCXG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gdGhpcy5fc3ByaXRlLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoIXRoaXMuX21hdGVyaWFsIHx8IHRoaXMuX21hdGVyaWFsLmdldFByb3BlcnR5KCdwcm9ncmVzcycsIDApID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1tIb2xvZ3JhbUxvYWRpbmcyRF0g6K+35YWI57uZIFNwcml0ZSDmjIflrpogaG9sb2dyYW1Mb2FkaW5nMkQg5p2Q6LSo44CCJyk7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0UHJvZ3Jlc3MoMCk7XG4gICAgICAgIHRoaXMucmVmcmVzaFVWUmVjdCgpO1xuXG4gICAgICAgIC8vIOWKqOaAgeWbvumbhumAmuW4uOWcqOmmluW4p+a4suafk+aXtuWujOaIkOaPkuWFpe+8m+mmluW4p+WQjuWGjeivu+WPluS4gOasoeacgOe7iCBVVuOAglxuICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsIHRoaXMucmVmcmVzaFVWUmVjdCwgdGhpcyk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZShkdDogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZyB8fCAhdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VsYXBzZWQgKz0gZHQ7XG4gICAgICAgIGlmICh0aGlzLl9lbGFwc2VkIDwgTWF0aC5tYXgoMCwgdGhpcy5kZWxheSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNhZmVEdXJhdGlvbiA9IE1hdGgubWF4KDAuMDAxLCB0aGlzLmR1cmF0aW9uKTtcbiAgICAgICAgY29uc3QgbGluZWFyUHJvZ3Jlc3MgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAodGhpcy5fZWxhcHNlZCAtIE1hdGgubWF4KDAsIHRoaXMuZGVsYXkpKSAvIHNhZmVEdXJhdGlvblxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHNtb290aHN0ZXAg57yT5Yqo77ya6LW35q2i6Zi25q615pu05p+U5ZKM77yM5Lit5q615LuN5L+d5oyB5piO56Gu55qE5omr5o+P6YCf5bqm44CCXG4gICAgICAgIGNvbnN0IGVhc2VkUHJvZ3Jlc3MgPSBsaW5lYXJQcm9ncmVzcyAqIGxpbmVhclByb2dyZXNzICogKDMgLSAyICogbGluZWFyUHJvZ3Jlc3MpO1xuICAgICAgICB0aGlzLnNldFByb2dyZXNzKGVhc2VkUHJvZ3Jlc3MpO1xuXG4gICAgICAgIGlmIChsaW5lYXJQcm9ncmVzcyA+PSAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb29wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9ncmVzcygwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOS7juWktOaSreaUvu+8jOS6puWPr+e7keWumuWIsCBCdXR0b24g55qEIENsaWNrIEV2ZW50c+OAgiAqL1xuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VsYXBzZWQgPSAwO1xuICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZXRQcm9ncmVzcygwKTtcbiAgICB9XG5cbiAgICAvKiog5pqC5YGc5Zyo5b2T5YmN6L+b5bqm44CCICovXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiog5aSW6YOo5Yqg6L295Zmo5Lmf5Y+v5Lul55u05o6l55So6K+l5pa55rOV5ZCM5q2l55yf5a6e5Yqg6L296L+b5bqm44CCICovXG4gICAgc2V0UHJvZ3Jlc3ModmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbGFtcGVkVmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB2YWx1ZSkpO1xuICAgICAgICB0aGlzLl9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgncHJvZ3Jlc3MnLCBjbGFtcGVkVmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVmcmVzaFVWUmVjdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGUgfHwgIXRoaXMuX3Nwcml0ZS5zcHJpdGVGcmFtZSB8fCAhdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvY29zIDIuNCDkvJrlnKjov5DooYzml7bmiorlj6/lkIjlm77nmoQgU3ByaXRlRnJhbWUg5pS+5YWl5Yqo5oCB5aSn5Zu+6ZuG44CCXG4gICAgICAgIC8vIHZfdXYwIOatpOaXtuS4jeWGjeaYryAwfjHvvIzlm6DmraTlv4Xpobvmiorlrp7pmYXlm77pm4bljLrln5/kvKDnu5kgU2hhZGVyIOW9kuS4gOWMluOAglxuICAgICAgICBjb25zdCBmcmFtZVVWID0gdGhpcy5fc3ByaXRlLnNwcml0ZUZyYW1lWyd1diddIGFzIG51bWJlcltdO1xuICAgICAgICBpZiAoIWZyYW1lVVYgfHwgZnJhbWVVVi5sZW5ndGggPCA4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWluVSA9IGZyYW1lVVZbMF07XG4gICAgICAgIGxldCBtYXhVID0gZnJhbWVVVlswXTtcbiAgICAgICAgbGV0IG1pblYgPSBmcmFtZVVWWzFdO1xuICAgICAgICBsZXQgbWF4ViA9IGZyYW1lVVZbMV07XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAyOyBpbmRleCA8IGZyYW1lVVYubGVuZ3RoOyBpbmRleCArPSAyKSB7XG4gICAgICAgICAgICBtaW5VID0gTWF0aC5taW4obWluVSwgZnJhbWVVVltpbmRleF0pO1xuICAgICAgICAgICAgbWF4VSA9IE1hdGgubWF4KG1heFUsIGZyYW1lVVZbaW5kZXhdKTtcbiAgICAgICAgICAgIG1pblYgPSBNYXRoLm1pbihtaW5WLCBmcmFtZVVWW2luZGV4ICsgMV0pO1xuICAgICAgICAgICAgbWF4ViA9IE1hdGgubWF4KG1heFYsIGZyYW1lVVZbaW5kZXggKyAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndXZSZWN0JywgbmV3IGNjLlZlYzQoXG4gICAgICAgICAgICBtaW5VLFxuICAgICAgICAgICAgbWluVixcbiAgICAgICAgICAgIE1hdGgubWF4KDAuMDAwMDAxLCBtYXhVIC0gbWluVSksXG4gICAgICAgICAgICBNYXRoLm1heCgwLjAwMDAwMSwgbWF4ViAtIG1pblYpXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IudGFyZ2V0T2ZmKHRoaXMpO1xuICAgIH1cbn1cbiJdfQ==