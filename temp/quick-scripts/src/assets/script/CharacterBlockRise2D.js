"use strict";
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