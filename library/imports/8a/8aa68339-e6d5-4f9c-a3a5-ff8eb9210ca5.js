"use strict";
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