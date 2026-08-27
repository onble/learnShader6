"use strict";
cc._RF.push(module, '56b5bKSI/lHrpDTE/JYEtN5', 'testCamera2');
// script/testCamera2.ts

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
exports.testCamera2 = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * 将临时 Graphics 笔迹增量写入同一张 RenderTexture。
 *
 * RenderTexture 只在初始化/重置时清除颜色；后续提交时只清深度和模板，
 * 因此旧像素会一直保留。Graphics 每次提交后立即清空，不会累积路径几何。
 */
var testCamera2 = /** @class */ (function (_super) {
    __extends(testCamera2, _super);
    function testCamera2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetSprite = null;
        _this.maskCamera = null;
        _this.strokeGraphics = null;
        _this.revealSprite = null;
        _this.textureWidth = 828;
        _this._renderTexture = null;
        _this._spriteFrame = null;
        _this._texW = 0;
        _this._texH = 0;
        return _this;
    }
    testCamera2.prototype.onLoad = function () {
        if (!this.targetSprite || !this.maskCamera) {
            cc.error('[testCamera2] targetSprite 和 maskCamera 必须设置');
            return;
        }
        var winSize = cc.view.getVisibleSize();
        this._texW = Math.max(1, Math.floor(this.textureWidth));
        this._texH = Math.max(1, Math.floor(this._texW / winSize.width * winSize.height));
        this._renderTexture = new cc.RenderTexture();
        this._renderTexture.initWithSize(this._texW, this._texH);
        this._spriteFrame = new cc.SpriteFrame();
        this._spriteFrame.setTexture(this._renderTexture);
        this._spriteFrame.setFlipY(true);
        this._spriteFrame.setRect(new cc.Rect(0, 0, this._texW, this._texH));
        this.targetSprite.spriteFrame = this._spriteFrame;
        if (this.revealSprite) {
            this.revealSprite.node.active = true;
            var material = this.revealSprite.getMaterial(0);
            if (material) {
                material.setProperty('maskTexture', this._renderTexture);
                this.updateRevealUV();
            }
            else {
                cc.error('[testCamera2] revealSprite 没有设置 scratchReveal 材质');
            }
        }
        // 该 Camera 只由 commitStroke/resetTexture 手动触发。
        this.maskCamera.enabled = false;
        this.maskCamera.backgroundColor = new cc.Color(0, 0, 0, 0);
    };
    testCamera2.prototype.start = function () {
        // 等所有渲染组件完成 assembler 初始化后再首次清屏。
        this.updateRevealUV();
        this.resetTexture();
    };
    /**
     * 将 card_open 的世界区域换算成整屏 RenderTexture 的 UV 区域。
     */
    testCamera2.prototype.updateRevealUV = function () {
        if (!this.revealSprite)
            return;
        var material = this.revealSprite.getMaterial(0);
        if (!material)
            return;
        var rect = this.revealSprite.node.getBoundingBoxToWorld();
        var screenWidth = Math.max(1, cc.visibleRect.width);
        var screenHeight = Math.max(1, cc.visibleRect.height);
        material.setProperty('maskUVRect', new cc.Vec4((rect.x - cc.visibleRect.bottomLeft.x) / screenWidth, (rect.y - cc.visibleRect.bottomLeft.y) / screenHeight, rect.width / screenWidth, rect.height / screenHeight));
        material.setProperty('maskThreshold', 0.01);
    };
    /**
     * 把当前临时笔迹叠加进纹理。调用结束后 Graphics 中不再保留任何三角面。
     */
    testCamera2.prototype.commitStroke = function () {
        if (!this._renderTexture || !this.maskCamera)
            return;
        var renderRoot = this.strokeGraphics && this.strokeGraphics.node;
        if (!renderRoot || !renderRoot.isValid)
            return;
        try {
            this.maskCamera.targetTexture = this._renderTexture;
            // 不清 COLOR，保留之前已经写入 RenderTexture 的所有路径。
            this.maskCamera.clearFlags = (cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL);
            this.maskCamera.render(renderRoot);
        }
        finally {
            this.maskCamera.targetTexture = null;
            if (this.strokeGraphics) {
                this.strokeGraphics.clear();
            }
        }
    };
    /**
     * 清除纹理中保存的全部路径。
     */
    testCamera2.prototype.resetTexture = function () {
        if (!this._renderTexture || !this.maskCamera)
            return;
        if (this.strokeGraphics) {
            this.strokeGraphics.clear();
        }
        var oldCullingMask = this.maskCamera.cullingMask;
        try {
            this.maskCamera.targetTexture = this._renderTexture;
            this.maskCamera.clearFlags = (cc.Camera.ClearFlags.COLOR |
                cc.Camera.ClearFlags.DEPTH |
                cc.Camera.ClearFlags.STENCIL);
            // 不渲染任何节点，只让 Camera 清除 RenderTexture。
            this.maskCamera.cullingMask = 0;
            this.maskCamera.render();
        }
        finally {
            this.maskCamera.cullingMask = oldCullingMask;
            this.maskCamera.targetTexture = null;
        }
    };
    testCamera2.prototype.onDestroy = function () {
        if (this.maskCamera && this.maskCamera.targetTexture === this._renderTexture) {
            this.maskCamera.targetTexture = null;
        }
        if (this._spriteFrame) {
            this._spriteFrame.destroy();
            this._spriteFrame = null;
        }
        if (this._renderTexture) {
            this._renderTexture.destroy();
            this._renderTexture = null;
        }
    };
    __decorate([
        property({ type: cc.Sprite, tooltip: CC_DEV && '显示持久化笔迹纹理的 Sprite' })
    ], testCamera2.prototype, "targetSprite", void 0);
    __decorate([
        property({ type: cc.Camera, tooltip: CC_DEV && '只渲染笔迹节点的离屏摄像机' })
    ], testCamera2.prototype, "maskCamera", void 0);
    __decorate([
        property({ type: cc.Graphics, tooltip: CC_DEV && '每次提交后会被立即清空的临时笔迹' })
    ], testCamera2.prototype, "strokeGraphics", void 0);
    __decorate([
        property({ type: cc.Sprite, tooltip: CC_DEV && '使用 scratchReveal 材质、按刮痕显示的内容' })
    ], testCamera2.prototype, "revealSprite", void 0);
    __decorate([
        property({ tooltip: CC_DEV && 'RenderTexture 宽度；高度按可见区域比例计算' })
    ], testCamera2.prototype, "textureWidth", void 0);
    testCamera2 = __decorate([
        ccclass
    ], testCamera2);
    return testCamera2;
}(cc.Component));
exports.testCamera2 = testCamera2;

cc._RF.pop();