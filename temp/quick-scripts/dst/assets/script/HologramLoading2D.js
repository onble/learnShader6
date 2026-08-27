
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
        // Shader 内部按参考视频的真实时间比例拆分能量柱、角色显形点和
        // Glitch 残影阶段，因此这里必须传入线性时间，不能再次缓动。
        this.setProgress(linearProgress);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxIb2xvZ3JhbUxvYWRpbmcyRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUU1Qzs7O0dBR0c7QUFFSDtJQUErQyxxQ0FBWTtJQUEzRDtRQUFBLHFFQTRJQztRQXpJRyxjQUFRLEdBQVksSUFBSSxDQUFDO1FBR3pCLFVBQUksR0FBWSxLQUFLLENBQUM7UUFHdEIsV0FBSyxHQUFXLENBQUMsQ0FBQztRQUdsQixjQUFRLEdBQVcsR0FBRyxDQUFDO1FBRWYsYUFBTyxHQUFjLElBQUksQ0FBQztRQUMxQixlQUFTLEdBQXVCLElBQUksQ0FBQztRQUNyQyxjQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGNBQVEsR0FBWSxLQUFLLENBQUM7O0lBMkh0QyxDQUFDO0lBekhHLGtDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsRUFBRSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU87U0FDVjtRQUVELHlEQUF5RDtRQUN6RCxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzVFLEVBQUUsQ0FBQyxJQUFJLENBQUMs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RUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQ2xDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQ0FBUyxHQUFUO1FBQ0ksRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQXhJRDtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQzt1REFDWDtJQUd6QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQzttREFDVjtJQUd0QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQztvREFDckI7SUFHbEI7UUFEQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQzt1REFDakI7SUFaTixpQkFBaUI7UUFEckMsT0FBTztPQUNhLGlCQUFpQixDQTRJckM7SUFBRCx3QkFBQztDQTVJRCxBQTRJQyxDQTVJOEMsRUFBRSxDQUFDLFNBQVMsR0E0STFEO2tCQTVJb0IsaUJBQWlCIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcblxuLyoqXG4gKiDpqbHliqggaG9sb2dyYW1Mb2FkaW5nMkQg5p2Q6LSo55qEIHByb2dyZXNzIOWxnuaAp+OAglxuICog5bCG6ISa5pys5LiO5L2/55So6K+l5p2Q6LSo55qEIFNwcml0ZSDmjILlnKjlkIzkuIDkuKroioLngrnljbPlj6/jgIJcbiAqL1xuQGNjY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbG9ncmFtTG9hZGluZzJEIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6ICfoh6rliqjmkq3mlL7kuIDmrKHliqDovb3liqjnlLsnIH0pXG4gICAgYXV0b1BsYXk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+aYr+WQpuW+queOr+aSreaUvicgfSlcbiAgICBsb29wOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAcHJvcGVydHkoeyB0b29sdGlwOiAn5byA5aeL5pKt5pS+5YmN55qE562J5b6F5pe26Ze077yI56eS77yJJyB9KVxuICAgIGRlbGF5OiBudW1iZXIgPSAwO1xuXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogJ+S4gOasoeWKoOi9veWKqOeUu+eahOaMgee7reaXtumXtO+8iOenku+8iScgfSlcbiAgICBkdXJhdGlvbjogbnVtYmVyID0gMS4wO1xuXG4gICAgcHJpdmF0ZSBfc3ByaXRlOiBjYy5TcHJpdGUgPSBudWxsO1xuICAgIHByaXZhdGUgX21hdGVyaWFsOiBjYy5NYXRlcmlhbFZhcmlhbnQgPSBudWxsO1xuICAgIHByaXZhdGUgX2VsYXBzZWQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfcGxheWluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSB0aGlzLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSkge1xuICAgICAgICAgICAgY2Mud2FybignW0hvbG9ncmFtTG9hZGluZzJEXSDlvZPliY3oioLngrnkuIrmsqHmnIkgY2MuU3ByaXRl44CCJyk7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldE1hdGVyaWFsIOS8mui/lOWbnuWxnuS6juW9k+WJjSBSZW5kZXJDb21wb25lbnQg55qEIE1hdGVyaWFsVmFyaWFudO+8jFxuICAgICAgICAvLyDkv67mlLkgcHJvZ3Jlc3Mg5LiN5Lya5b2x5ZON5L2/55So5ZCM5LiA5p2Q6LSo6LWE5rqQ55qE5YW25LuWIFNwcml0ZeOAglxuICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHRoaXMuX3Nwcml0ZS5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCB8fCB0aGlzLl9tYXRlcmlhbC5nZXRQcm9wZXJ0eSgncHJvZ3Jlc3MnLCAwKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbSG9sb2dyYW1Mb2FkaW5nMkRdIOivt+WFiOe7mSBTcHJpdGUg5oyH5a6aIGhvbG9ncmFtTG9hZGluZzJEIOadkOi0qOOAgicpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFByb2dyZXNzKDApO1xuICAgICAgICB0aGlzLnJlZnJlc2hVVlJlY3QoKTtcblxuICAgICAgICAvLyDliqjmgIHlm77pm4bpgJrluLjlnKjpppbluKfmuLLmn5Pml7blrozmiJDmj5LlhaXvvJvpppbluKflkI7lho3or7vlj5bkuIDmrKHmnIDnu4ggVVbjgIJcbiAgICAgICAgY2MuZGlyZWN0b3Iub25jZShjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCB0aGlzLnJlZnJlc2hVVlJlY3QsIHRoaXMpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBpZiAodGhpcy5hdXRvUGxheSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoZHQ6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX3BsYXlpbmcgfHwgIXRoaXMuX21hdGVyaWFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lbGFwc2VkICs9IGR0O1xuICAgICAgICBpZiAodGhpcy5fZWxhcHNlZCA8IE1hdGgubWF4KDAsIHRoaXMuZGVsYXkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzYWZlRHVyYXRpb24gPSBNYXRoLm1heCgwLjAwMSwgdGhpcy5kdXJhdGlvbik7XG4gICAgICAgIGNvbnN0IGxpbmVhclByb2dyZXNzID0gTWF0aC5taW4oXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgKHRoaXMuX2VsYXBzZWQgLSBNYXRoLm1heCgwLCB0aGlzLmRlbGF5KSkgLyBzYWZlRHVyYXRpb25cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBTaGFkZXIg5YaF6YOo5oyJ5Y+C6ICD6KeG6aKR55qE55yf5a6e5pe26Ze05q+U5L6L5ouG5YiG6IO96YeP5p+x44CB6KeS6Imy5pi+5b2i54K55ZKMXG4gICAgICAgIC8vIEdsaXRjaCDmrovlvbHpmLbmrrXvvIzlm6DmraTov5nph4zlv4XpobvkvKDlhaXnur/mgKfml7bpl7TvvIzkuI3og73lho3mrKHnvJPliqjjgIJcbiAgICAgICAgdGhpcy5zZXRQcm9ncmVzcyhsaW5lYXJQcm9ncmVzcyk7XG5cbiAgICAgICAgaWYgKGxpbmVhclByb2dyZXNzID49IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByb2dyZXNzKDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5LuO5aS05pKt5pS+77yM5Lqm5Y+v57uR5a6a5YiwIEJ1dHRvbiDnmoQgQ2xpY2sgRXZlbnRz44CCICovXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFByb2dyZXNzKDApO1xuICAgIH1cblxuICAgIC8qKiDmmoLlgZzlnKjlvZPliY3ov5vluqbjgIIgKi9cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiDlpJbpg6jliqDovb3lmajkuZ/lj6/ku6Xnm7TmjqXnlKjor6Xmlrnms5XlkIzmraXnnJ/lrp7liqDovb3ov5vluqbjgIIgKi9cbiAgICBzZXRQcm9ncmVzcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNsYW1wZWRWYWx1ZSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHZhbHVlKSk7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCdwcm9ncmVzcycsIGNsYW1wZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZyZXNoVVZSZWN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSB8fCAhdGhpcy5fc3ByaXRlLnNwcml0ZUZyYW1lIHx8ICF0aGlzLl9tYXRlcmlhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29jb3MgMi40IOS8muWcqOi/kOihjOaXtuaKiuWPr+WQiOWbvueahCBTcHJpdGVGcmFtZSDmlL7lhaXliqjmgIHlpKflm77pm4bjgIJcbiAgICAgICAgLy8gdl91djAg5q2k5pe25LiN5YaN5pivIDB+Me+8jOWboOatpOW/hemhu+aKiuWunumZheWbvumbhuWMuuWfn+S8oOe7mSBTaGFkZXIg5b2S5LiA5YyW44CCXG4gICAgICAgIGNvbnN0IGZyYW1lVVYgPSB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWVbJ3V2J10gYXMgbnVtYmVyW107XG4gICAgICAgIGlmICghZnJhbWVVViB8fCBmcmFtZVVWLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtaW5VID0gZnJhbWVVVlswXTtcbiAgICAgICAgbGV0IG1heFUgPSBmcmFtZVVWWzBdO1xuICAgICAgICBsZXQgbWluViA9IGZyYW1lVVZbMV07XG4gICAgICAgIGxldCBtYXhWID0gZnJhbWVVVlsxXTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDI7IGluZGV4IDwgZnJhbWVVVi5sZW5ndGg7IGluZGV4ICs9IDIpIHtcbiAgICAgICAgICAgIG1pblUgPSBNYXRoLm1pbihtaW5VLCBmcmFtZVVWW2luZGV4XSk7XG4gICAgICAgICAgICBtYXhVID0gTWF0aC5tYXgobWF4VSwgZnJhbWVVVltpbmRleF0pO1xuICAgICAgICAgICAgbWluViA9IE1hdGgubWluKG1pblYsIGZyYW1lVVZbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICBtYXhWID0gTWF0aC5tYXgobWF4ViwgZnJhbWVVVltpbmRleCArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCd1dlJlY3QnLCBuZXcgY2MuVmVjNChcbiAgICAgICAgICAgIG1pblUsXG4gICAgICAgICAgICBtaW5WLFxuICAgICAgICAgICAgTWF0aC5tYXgoMC4wMDAwMDEsIG1heFUgLSBtaW5VKSxcbiAgICAgICAgICAgIE1hdGgubWF4KDAuMDAwMDAxLCBtYXhWIC0gbWluVilcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95KCkge1xuICAgICAgICBjYy5kaXJlY3Rvci50YXJnZXRPZmYodGhpcyk7XG4gICAgfVxufVxuIl19