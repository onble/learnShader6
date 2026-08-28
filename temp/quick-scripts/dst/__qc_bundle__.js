
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/script/CharacterBlockRise2D');
require('./assets/script/CornerColorCtrl');
require('./assets/script/DissolveEffect');
require('./assets/script/Fake3D');
require('./assets/script/HologramLoading2D');
require('./assets/script/MagnifyingGlass');
require('./assets/script/ScratchCard');
require('./assets/script/SpineCtrl');
require('./assets/script/SpineRunner');
require('./assets/script/TextureBlend');
require('./assets/script/TriangleCounter');
require('./assets/script/testCamera');
require('./assets/script/testCamera2');

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/testCamera2.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFx0ZXN0Q2FtZXJhMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFFNUM7Ozs7O0dBS0c7QUFFSDtJQUFpQywrQkFBWTtJQUE3QztRQUFBLHFFQXNKQztRQW5KVyxrQkFBWSxHQUFjLElBQUksQ0FBQztRQUcvQixnQkFBVSxHQUFjLElBQUksQ0FBQztRQUc3QixvQkFBYyxHQUFnQixJQUFJLENBQUM7UUFHbkMsa0JBQVksR0FBYyxJQUFJLENBQUM7UUFHL0Isa0JBQVksR0FBRyxHQUFHLENBQUM7UUFFbkIsb0JBQWMsR0FBcUIsSUFBSSxDQUFDO1FBQ3hDLGtCQUFZLEdBQW1CLElBQUksQ0FBQztRQUNwQyxXQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsV0FBSyxHQUFHLENBQUMsQ0FBQzs7SUFrSXRCLENBQUM7SUFoSUcsNEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4QyxFQUFFLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDekQsT0FBTztTQUNWO1FBRUQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVsRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUVsRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNyQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLFFBQVEsRUFBRTtnQkFDVixRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN6QjtpQkFBTTtnQkFDSCxFQUFFLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7YUFDaEU7U0FDSjtRQUVELDhDQUE4QztRQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCwyQkFBSyxHQUFMO1FBQ0ksaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssb0NBQWMsR0FBdEI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFBRSxPQUFPO1FBRS9CLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUV0QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzVELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4RCxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQzFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLEVBQ3BELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLEVBQ3JELElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxFQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FDN0IsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0NBQVksR0FBbkI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUVyRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBQ25FLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTztZQUFFLE9BQU87UUFFL0MsSUFBSTtZQUNBLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDcEQseUNBQXlDO1lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLENBQ3pCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQ3JELENBQUM7WUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN0QztnQkFBUztZQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUNyQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDL0I7U0FDSjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLGtDQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUFFLE9BQU87UUFFckQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDL0I7UUFFRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUNuRCxJQUFJO1lBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNwRCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUN6QixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLO2dCQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLO2dCQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQ3hCLENBQUM7WUFFVCxzQ0FBc0M7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDNUI7Z0JBQVM7WUFDTixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7WUFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztJQUVELCtCQUFTLEdBQVQ7UUFDSSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMxRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDeEM7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUM1QjtRQUNELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQWxKRDtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksbUJBQW1CLEVBQUUsQ0FBQztxREFDL0I7SUFHdkM7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO21EQUM3QjtJQUdyQztRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksa0JBQWtCLEVBQUUsQ0FBQzt1REFDNUI7SUFHM0M7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLDhCQUE4QixFQUFFLENBQUM7cURBQzFDO0lBR3ZDO1FBREMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSw4QkFBOEIsRUFBRSxDQUFDO3FEQUNyQztJQWZsQixXQUFXO1FBRHZCLE9BQU87T0FDSyxXQUFXLENBc0p2QjtJQUFELGtCQUFDO0NBdEpELEFBc0pDLENBdEpnQyxFQUFFLENBQUMsU0FBUyxHQXNKNUM7QUF0Slksa0NBQVciLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIOWwhuS4tOaXtiBHcmFwaGljcyDnrJTov7nlop7ph4/lhpnlhaXlkIzkuIDlvKAgUmVuZGVyVGV4dHVyZeOAglxyXG4gKlxyXG4gKiBSZW5kZXJUZXh0dXJlIOWPquWcqOWIneWni+WMli/ph43nva7ml7bmuIXpmaTpopzoibLvvJvlkI7nu63mj5DkuqTml7blj6rmuIXmt7HluqblkozmqKHmnb/vvIxcclxuICog5Zug5q2k5pen5YOP57Sg5Lya5LiA55u05L+d55WZ44CCR3JhcGhpY3Mg5q+P5qyh5o+Q5Lqk5ZCO56uL5Y2z5riF56m677yM5LiN5Lya57Sv56ev6Lev5b6E5Yeg5L2V44CCXHJcbiAqL1xyXG5AY2NjbGFzc1xyXG5leHBvcnQgY2xhc3MgdGVzdENhbWVyYTIgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IGNjLlNwcml0ZSwgdG9vbHRpcDogQ0NfREVWICYmICfmmL7npLrmjIHkuYXljJbnrJTov7nnurnnkIbnmoQgU3ByaXRlJyB9KVxyXG4gICAgcHJpdmF0ZSB0YXJnZXRTcHJpdGU6IGNjLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuQ2FtZXJhLCB0b29sdGlwOiBDQ19ERVYgJiYgJ+WPqua4suafk+eslOi/ueiKgueCueeahOemu+Wxj+aRhOWDj+acuicgfSlcclxuICAgIHByaXZhdGUgbWFza0NhbWVyYTogY2MuQ2FtZXJhID0gbnVsbDtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5HcmFwaGljcywgdG9vbHRpcDogQ0NfREVWICYmICfmr4/mrKHmj5DkuqTlkI7kvJrooqvnq4vljbPmuIXnqbrnmoTkuLTml7bnrJTov7knIH0pXHJcbiAgICBwcml2YXRlIHN0cm9rZUdyYXBoaWNzOiBjYy5HcmFwaGljcyA9IG51bGw7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuU3ByaXRlLCB0b29sdGlwOiBDQ19ERVYgJiYgJ+S9v+eUqCBzY3JhdGNoUmV2ZWFsIOadkOi0qOOAgeaMieWIrueXleaYvuekuueahOWGheWuuScgfSlcclxuICAgIHByaXZhdGUgcmV2ZWFsU3ByaXRlOiBjYy5TcHJpdGUgPSBudWxsO1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6IENDX0RFViAmJiAnUmVuZGVyVGV4dHVyZSDlrr3luqbvvJvpq5jluqbmjInlj6/op4HljLrln5/mr5TkvovorqHnrpcnIH0pXHJcbiAgICBwcml2YXRlIHRleHR1cmVXaWR0aCA9IDgyODtcclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJUZXh0dXJlOiBjYy5SZW5kZXJUZXh0dXJlID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3Nwcml0ZUZyYW1lOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZXhXID0gMDtcclxuICAgIHByaXZhdGUgX3RleEggPSAwO1xyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0U3ByaXRlIHx8ICF0aGlzLm1hc2tDYW1lcmEpIHtcclxuICAgICAgICAgICAgY2MuZXJyb3IoJ1t0ZXN0Q2FtZXJhMl0gdGFyZ2V0U3ByaXRlIOWSjCBtYXNrQ2FtZXJhIOW/hemhu+iuvue9ricpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3aW5TaXplID0gY2Mudmlldy5nZXRWaXNpYmxlU2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RleFcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKHRoaXMudGV4dHVyZVdpZHRoKSk7XHJcbiAgICAgICAgdGhpcy5fdGV4SCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IodGhpcy5fdGV4VyAvIHdpblNpemUud2lkdGggKiB3aW5TaXplLmhlaWdodCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlID0gbmV3IGNjLlJlbmRlclRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlLmluaXRXaXRoU2l6ZSh0aGlzLl90ZXhXLCB0aGlzLl90ZXhIKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUoKTtcclxuICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRoaXMuX3JlbmRlclRleHR1cmUpO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lLnNldEZsaXBZKHRydWUpO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lLnNldFJlY3QobmV3IGNjLlJlY3QoMCwgMCwgdGhpcy5fdGV4VywgdGhpcy5fdGV4SCkpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0U3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5fc3ByaXRlRnJhbWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJldmVhbFNwcml0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJldmVhbFNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5yZXZlYWxTcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ21hc2tUZXh0dXJlJywgdGhpcy5fcmVuZGVyVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVJldmVhbFVWKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcignW3Rlc3RDYW1lcmEyXSByZXZlYWxTcHJpdGUg5rKh5pyJ6K6+572uIHNjcmF0Y2hSZXZlYWwg5p2Q6LSoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOivpSBDYW1lcmEg5Y+q55SxIGNvbW1pdFN0cm9rZS9yZXNldFRleHR1cmUg5omL5Yqo6Kem5Y+R44CCXHJcbiAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1hc2tDYW1lcmEuYmFja2dyb3VuZENvbG9yID0gbmV3IGNjLkNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIC8vIOetieaJgOaciea4suafk+e7hOS7tuWujOaIkCBhc3NlbWJsZXIg5Yid5aeL5YyW5ZCO5YaN6aaW5qyh5riF5bGP44CCXHJcbiAgICAgICAgdGhpcy51cGRhdGVSZXZlYWxVVigpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUZXh0dXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgY2FyZF9vcGVuIOeahOS4lueVjOWMuuWfn+aNoueul+aIkOaVtOWxjyBSZW5kZXJUZXh0dXJlIOeahCBVViDljLrln5/jgIJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVSZXZlYWxVVigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmV2ZWFsU3ByaXRlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5yZXZlYWxTcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgaWYgKCFtYXRlcmlhbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5yZXZlYWxTcHJpdGUubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcclxuICAgICAgICBjb25zdCBzY3JlZW5XaWR0aCA9IE1hdGgubWF4KDEsIGNjLnZpc2libGVSZWN0LndpZHRoKTtcclxuICAgICAgICBjb25zdCBzY3JlZW5IZWlnaHQgPSBNYXRoLm1heCgxLCBjYy52aXNpYmxlUmVjdC5oZWlnaHQpO1xyXG5cclxuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgnbWFza1VWUmVjdCcsIG5ldyBjYy5WZWM0KFxyXG4gICAgICAgICAgICAocmVjdC54IC0gY2MudmlzaWJsZVJlY3QuYm90dG9tTGVmdC54KSAvIHNjcmVlbldpZHRoLFxyXG4gICAgICAgICAgICAocmVjdC55IC0gY2MudmlzaWJsZVJlY3QuYm90dG9tTGVmdC55KSAvIHNjcmVlbkhlaWdodCxcclxuICAgICAgICAgICAgcmVjdC53aWR0aCAvIHNjcmVlbldpZHRoLFxyXG4gICAgICAgICAgICByZWN0LmhlaWdodCAvIHNjcmVlbkhlaWdodFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCdtYXNrVGhyZXNob2xkJywgMC4wMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiorlvZPliY3kuLTml7bnrJTov7nlj6DliqDov5vnurnnkIbjgILosIPnlKjnu5PmnZ/lkI4gR3JhcGhpY3Mg5Lit5LiN5YaN5L+d55WZ5Lu75L2V5LiJ6KeS6Z2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb21taXRTdHJva2UoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJUZXh0dXJlIHx8ICF0aGlzLm1hc2tDYW1lcmEpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyUm9vdCA9IHRoaXMuc3Ryb2tlR3JhcGhpY3MgJiYgdGhpcy5zdHJva2VHcmFwaGljcy5ub2RlO1xyXG4gICAgICAgIGlmICghcmVuZGVyUm9vdCB8fCAhcmVuZGVyUm9vdC5pc1ZhbGlkKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gdGhpcy5fcmVuZGVyVGV4dHVyZTtcclxuICAgICAgICAgICAgLy8g5LiN5riFIENPTE9S77yM5L+d55WZ5LmL5YmN5bey57uP5YaZ5YWlIFJlbmRlclRleHR1cmUg55qE5omA5pyJ6Lev5b6E44CCXHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS5jbGVhckZsYWdzID0gKFxyXG4gICAgICAgICAgICAgICAgY2MuQ2FtZXJhLkNsZWFyRmxhZ3MuREVQVEggfCBjYy5DYW1lcmEuQ2xlYXJGbGFncy5TVEVOQ0lMXHJcbiAgICAgICAgICAgICkgYXMgYW55O1xyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEucmVuZGVyKHJlbmRlclJvb3QpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3Ryb2tlR3JhcGhpY3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Ryb2tlR3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOe6ueeQhuS4reS/neWtmOeahOWFqOmDqOi3r+W+hOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzZXRUZXh0dXJlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyVGV4dHVyZSB8fCAhdGhpcy5tYXNrQ2FtZXJhKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZUdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Ryb2tlR3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZEN1bGxpbmdNYXNrID0gdGhpcy5tYXNrQ2FtZXJhLmN1bGxpbmdNYXNrO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gdGhpcy5fcmVuZGVyVGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmNsZWFyRmxhZ3MgPSAoXHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5DT0xPUiB8XHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5ERVBUSCB8XHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5TVEVOQ0lMXHJcbiAgICAgICAgICAgICkgYXMgYW55O1xyXG5cclxuICAgICAgICAgICAgLy8g5LiN5riy5p+T5Lu75L2V6IqC54K577yM5Y+q6K6pIENhbWVyYSDmuIXpmaQgUmVuZGVyVGV4dHVyZeOAglxyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEuY3VsbGluZ01hc2sgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEucmVuZGVyKCk7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmN1bGxpbmdNYXNrID0gb2xkQ3VsbGluZ01hc2s7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1hc2tDYW1lcmEgJiYgdGhpcy5tYXNrQ2FtZXJhLnRhcmdldFRleHR1cmUgPT09IHRoaXMuX3JlbmRlclRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLnRhcmdldFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/CornerColorCtrl.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '18f2fNk3PFJa7+QJnjfSg6B', 'CornerColorCtrl');
// script/CornerColorCtrl.ts

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
// 参考:https://forum.cocos.org/t/topic/159733
var CornerColorCtrl = /** @class */ (function (_super) {
    __extends(CornerColorCtrl, _super);
    function CornerColorCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.leftBottom = cc.Color.WHITE;
        _this.rightBottom = cc.Color.WHITE;
        _this.leftTop = cc.Color.WHITE;
        _this.rightTop = cc.Color.WHITE;
        return _this;
    }
    CornerColorCtrl.prototype.start = function () {
        var _this = this;
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
            _this.renderColor();
        }, this);
    };
    CornerColorCtrl.prototype.renderColor = function () {
        // 获取 renderComponent 
        var renderComponent = this.node.getComponent(cc.RenderComponent);
        var assembler = renderComponent['_assembler'];
        var renderData = assembler['_renderData'];
        var uintVDatas = renderData['uintVDatas'][0];
        uintVDatas[4] = this.leftBottom['_val'];
        uintVDatas[9] = this.rightBottom['_val'];
        uintVDatas[14] = this.leftTop['_val'];
        uintVDatas[19] = this.rightTop['_val'];
    };
    __decorate([
        property(cc.Color)
    ], CornerColorCtrl.prototype, "leftBottom", void 0);
    __decorate([
        property(cc.Color)
    ], CornerColorCtrl.prototype, "rightBottom", void 0);
    __decorate([
        property(cc.Color)
    ], CornerColorCtrl.prototype, "leftTop", void 0);
    __decorate([
        property(cc.Color)
    ], CornerColorCtrl.prototype, "rightTop", void 0);
    CornerColorCtrl = __decorate([
        ccclass
    ], CornerColorCtrl);
    return CornerColorCtrl;
}(cc.Component));
exports.default = CornerColorCtrl;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxDb3JuZXJDb2xvckN0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUFzQixFQUFFLENBQUMsVUFBVSxFQUFsQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWlCLENBQUM7QUFDMUMsNENBQTRDO0FBRzVDO0lBQTZDLG1DQUFZO0lBQXpEO1FBQUEscUVBOEJDO1FBM0JHLGdCQUFVLEdBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFdEMsaUJBQVcsR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUV2QyxhQUFPLEdBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFbkMsY0FBUSxHQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztJQXFCeEMsQ0FBQztJQW5CRywrQkFBSyxHQUFMO1FBQUEsaUJBSUM7UUFIRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQzNDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQscUNBQVcsR0FBWDtRQUNJLHNCQUFzQjtRQUN0QixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFbkUsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1QyxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0MsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQTFCRDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO3VEQUNtQjtJQUV0QztRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO3dEQUNvQjtJQUV2QztRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO29EQUNnQjtJQUVuQztRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO3FEQUNpQjtJQVRuQixlQUFlO1FBRG5DLE9BQU87T0FDYSxlQUFlLENBOEJuQztJQUFELHNCQUFDO0NBOUJELEFBOEJDLENBOUI0QyxFQUFFLENBQUMsU0FBUyxHQThCeEQ7a0JBOUJvQixlQUFlIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XHJcbi8vIOWPguiAgzpodHRwczovL2ZvcnVtLmNvY29zLm9yZy90L3RvcGljLzE1OTczM1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ybmVyQ29sb3JDdHJsIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoY2MuQ29sb3IpXHJcbiAgICBsZWZ0Qm90dG9tOiBjYy5Db2xvciA9IGNjLkNvbG9yLldISVRFO1xyXG4gICAgQHByb3BlcnR5KGNjLkNvbG9yKVxyXG4gICAgcmlnaHRCb3R0b206IGNjLkNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICBAcHJvcGVydHkoY2MuQ29sb3IpXHJcbiAgICBsZWZ0VG9wOiBjYy5Db2xvciA9IGNjLkNvbG9yLldISVRFO1xyXG4gICAgQHByb3BlcnR5KGNjLkNvbG9yKVxyXG4gICAgcmlnaHRUb3A6IGNjLkNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLm9uY2UoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDb2xvcigpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckNvbG9yKCkge1xyXG4gICAgICAgIC8vIOiOt+WPliByZW5kZXJDb21wb25lbnQgXHJcbiAgICAgICAgY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SZW5kZXJDb21wb25lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBhc3NlbWJsZXIgPSByZW5kZXJDb21wb25lbnRbJ19hc3NlbWJsZXInXTtcclxuICAgICAgICBjb25zdCByZW5kZXJEYXRhID0gYXNzZW1ibGVyWydfcmVuZGVyRGF0YSddO1xyXG4gICAgICAgIGNvbnN0IHVpbnRWRGF0YXMgPSByZW5kZXJEYXRhWyd1aW50VkRhdGFzJ11bMF07XHJcblxyXG4gICAgICAgIHVpbnRWRGF0YXNbNF0gPSB0aGlzLmxlZnRCb3R0b21bJ192YWwnXTtcclxuICAgICAgICB1aW50VkRhdGFzWzldID0gdGhpcy5yaWdodEJvdHRvbVsnX3ZhbCddO1xyXG4gICAgICAgIHVpbnRWRGF0YXNbMTRdID0gdGhpcy5sZWZ0VG9wWydfdmFsJ107XHJcbiAgICAgICAgdWludFZEYXRhc1sxOV0gPSB0aGlzLnJpZ2h0VG9wWydfdmFsJ107XHJcbiAgICB9XHJcbn0iXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/DissolveEffect.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e64058U00BPUrEnkMAmm8Sk', 'DissolveEffect');
// script/DissolveEffect.ts

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
var DissolveEffect = /** @class */ (function (_super) {
    __extends(DissolveEffect, _super);
    function DissolveEffect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dissolveInterval = 0.01;
        _this.dissolveStep = 0.01;
        return _this;
    }
    DissolveEffect.prototype.start = function () {
        var _this = this;
        var material = this.getComponent(cc.Sprite).getMaterial(0);
        material.setProperty('dissolveThreshold', 0);
        this.schedule(function () {
            var dissolveThreshold = material.getProperty('dissolveThreshold', 0);
            dissolveThreshold += _this.dissolveStep;
            material.setProperty('dissolveThreshold', dissolveThreshold);
            // console.log(dissolveThreshold);
        }, this.dissolveInterval, 1 / this.dissolveStep);
    };
    __decorate([
        property
    ], DissolveEffect.prototype, "dissolveInterval", void 0);
    __decorate([
        property
    ], DissolveEffect.prototype, "dissolveStep", void 0);
    DissolveEffect = __decorate([
        ccclass
    ], DissolveEffect);
    return DissolveEffect;
}(cc.Component));
exports.default = DissolveEffect;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxEaXNzb2x2ZUVmZmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUc1QztJQUE0QyxrQ0FBWTtJQUF4RDtRQUFBLHFFQXNCQztRQW5CRyxzQkFBZ0IsR0FBVyxJQUFJLENBQUM7UUFFaEMsa0JBQVksR0FBVyxJQUFJLENBQUM7O0lBaUJoQyxDQUFDO0lBZkcsOEJBQUssR0FBTDtRQUFBLGlCQWNDO1FBYkcsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdELFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUVWLElBQUksaUJBQWlCLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyRSxpQkFBaUIsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3ZDLFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUU3RCxrQ0FBa0M7UUFFdEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFsQkQ7UUFEQyxRQUFROzREQUN1QjtJQUVoQztRQURDLFFBQVE7d0RBQ21CO0lBTFgsY0FBYztRQURsQyxPQUFPO09BQ2EsY0FBYyxDQXNCbEM7SUFBRCxxQkFBQztDQXRCRCxBQXNCQyxDQXRCMkMsRUFBRSxDQUFDLFNBQVMsR0FzQnZEO2tCQXRCb0IsY0FBYyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNzb2x2ZUVmZmVjdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5XHJcbiAgICBkaXNzb2x2ZUludGVydmFsOiBudW1iZXIgPSAwLjAxO1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBkaXNzb2x2ZVN0ZXA6IG51bWJlciA9IDAuMDE7XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSB0aGlzLmdldENvbXBvbmVudChjYy5TcHJpdGUpLmdldE1hdGVyaWFsKDApO1xyXG5cclxuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgnZGlzc29sdmVUaHJlc2hvbGQnLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlzc29sdmVUaHJlc2hvbGQgPSBtYXRlcmlhbC5nZXRQcm9wZXJ0eSgnZGlzc29sdmVUaHJlc2hvbGQnLCAwKTtcclxuICAgICAgICAgICAgZGlzc29sdmVUaHJlc2hvbGQgKz0gdGhpcy5kaXNzb2x2ZVN0ZXA7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCdkaXNzb2x2ZVRocmVzaG9sZCcsIGRpc3NvbHZlVGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRpc3NvbHZlVGhyZXNob2xkKTtcclxuXHJcbiAgICAgICAgfSwgdGhpcy5kaXNzb2x2ZUludGVydmFsLCAxIC8gdGhpcy5kaXNzb2x2ZVN0ZXApO1xyXG4gICAgfVxyXG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/Fake3D.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '490af6mo3ZFT7i0eN9x6o5Z', 'Fake3D');
// script/Fake3D.ts

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
var Fake3D = /** @class */ (function (_super) {
    __extends(Fake3D, _super);
    function Fake3D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minAngle = -15;
        _this.maxAngle = 15;
        _this.material = null;
        return _this;
    }
    Fake3D.prototype.start = function () {
        // 材质 初始化
        var sprite = this.node.getComponent(cc.Sprite);
        this.material = sprite.getMaterial(0);
        this.material.setProperty('textureSize', cc.v2(this.node.width, this.node.height));
        // 监听鼠标移动
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    };
    Fake3D.prototype.onMouseEnter = function () {
        cc.tween(this.node)
            .to(0.1, { scale: 1.5 })
            .start();
    };
    Fake3D.prototype.onMouseMove = function (event) {
        var worldPos = event.getLocation();
        var nodePos = this.node.convertToNodeSpaceAR(worldPos);
        var angleX = this.remap(nodePos.x, -this.node.width / 2, this.node.width / 2, this.minAngle, this.maxAngle);
        var angleY = this.remap(nodePos.y, -this.node.height / 2, this.node.height / 2, this.minAngle, this.maxAngle);
        this.material.setProperty('y_rot', angleX);
        this.material.setProperty('x_rot', angleY);
    };
    Fake3D.prototype.onMouseLeave = function () {
        cc.tween(this.node)
            .to(0.2, { scale: 1 })
            .start();
        // 缓慢改变材质属性 方法一
        cc.tween(this.material['effect']._passes[0]._properties.x_rot)
            .to(0.2, { value: 0 })
            .start();
        cc.tween(this.material['effect']._passes[0]._properties.y_rot)
            .to(0.2, { value: 0 })
            .start();
        // 缓慢改变材质属性 方法二
        // const startAngleX = this.material.getProperty('x_rot', 0);
        // const startAngleY = this.material.getProperty('y_rot', 0);
        // cc.tween({ angleVec2: cc.v2(startAngleX, startAngleY) })
        // .to(0.2, { angleVec2: cc.Vec2.ZERO}, {
        //     onUpdate: (target) => {
        //         this.material.setProperty('x_rot', target.angleVec2.x);
        //         this.material.setProperty('y_rot', target.angleVec2.y);
        //     }
        // })
        // .start();
    };
    /**
     * 映射
     * @param num 当前值
     * @param sourceMin 原最小值
     * @param sourceMax 原最大值
     * @param targetMin 目标最小值
     * @param targetMax 目标最大值
     * @returns 映射后的目标值
     */
    Fake3D.prototype.remap = function (num, sourceMin, sourceMax, targetMin, targetMax) {
        if (targetMin === void 0) { targetMin = 0; }
        if (targetMax === void 0) { targetMax = 1; }
        var sourceRange = sourceMax - sourceMin;
        var targetRange = targetMax - targetMin;
        return num / sourceRange * targetRange;
    };
    __decorate([
        property
    ], Fake3D.prototype, "minAngle", void 0);
    __decorate([
        property
    ], Fake3D.prototype, "maxAngle", void 0);
    Fake3D = __decorate([
        ccclass
    ], Fake3D);
    return Fake3D;
}(cc.Component));
exports.default = Fake3D;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxGYWtlM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBb0MsMEJBQVk7SUFBaEQ7UUFBQSxxRUErRUM7UUE5RWEsY0FBUSxHQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLGNBQVEsR0FBVyxFQUFFLENBQUM7UUFFeEIsY0FBUSxHQUFnQixJQUFJLENBQUM7O0lBMkV6QyxDQUFDO0lBekVHLHNCQUFLLEdBQUw7UUFDSSxTQUFTO1FBQ1QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFbkYsU0FBUztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMs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Q0FBd0I7SUFDdkI7UUFBVCxRQUFROzRDQUF1QjtJQUZmLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0ErRTFCO0lBQUQsYUFBQztDQS9FRCxBQStFQyxDQS9FbUMsRUFBRSxDQUFDLFNBQVMsR0ErRS9DO2tCQS9Fb0IsTUFBTSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYWtlM0QgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgQHByb3BlcnR5IG1pbkFuZ2xlOiBudW1iZXIgPSAtMTU7XHJcbiAgICBAcHJvcGVydHkgbWF4QW5nbGU6IG51bWJlciA9IDE1O1xyXG5cclxuICAgIHByaXZhdGUgbWF0ZXJpYWw6IGNjLk1hdGVyaWFsID0gbnVsbDtcclxuXHJcbiAgICBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmnZDotKgg5Yid5aeL5YyWXHJcbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBzcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZVNpemUnLCBjYy52Mih0aGlzLm5vZGUud2lkdGgsIHRoaXMubm9kZS5oZWlnaHQpKTtcclxuXHJcbiAgICAgICAgLy8g55uR5ZCs6byg5qCH56e75YqoXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLm9uTW91c2VFbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIHRoaXMub25Nb3VzZU1vdmUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgdGhpcy5vbk1vdXNlTGVhdmUsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VFbnRlcigpIHtcclxuICAgICAgICBjYy50d2Vlbih0aGlzLm5vZGUpXHJcbiAgICAgICAgICAgIC50bygwLjEsIHsgc2NhbGU6IDEuNSB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTW92ZShldmVudDogY2MuRXZlbnQuRXZlbnRNb3VzZSkge1xyXG4gICAgICAgIGNvbnN0IHdvcmxkUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBjb25zdCBub2RlUG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKHdvcmxkUG9zKTtcclxuXHJcbiAgICAgICAgY29uc3QgYW5nbGVYID0gdGhpcy5yZW1hcChub2RlUG9zLngsIC10aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm1pbkFuZ2xlLCB0aGlzLm1heEFuZ2xlKTtcclxuICAgICAgICBjb25zdCBhbmdsZVkgPSB0aGlzLnJlbWFwKG5vZGVQb3MueSwgLXRoaXMubm9kZS5oZWlnaHQgLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMiwgdGhpcy5taW5BbmdsZSwgdGhpcy5tYXhBbmdsZSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3lfcm90JywgYW5nbGVYKTtcclxuICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd4X3JvdCcsIGFuZ2xlWSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMubm9kZSlcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyBzY2FsZTogMSB9LClcclxuICAgICAgICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIC8vIOe8k+aFouaUueWPmOadkOi0qOWxnuaApyDmlrnms5XkuIBcclxuXHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5tYXRlcmlhbFsnZWZmZWN0J10uX3Bhc3Nlc1swXS5fcHJvcGVydGllcy54X3JvdClcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyB2YWx1ZTogMCB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5tYXRlcmlhbFsnZWZmZWN0J10uX3Bhc3Nlc1swXS5fcHJvcGVydGllcy55X3JvdClcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyB2YWx1ZTogMCB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8g57yT5oWi5pS55Y+Y5p2Q6LSo5bGe5oCnIOaWueazleS6jFxyXG5cclxuICAgICAgICAvLyBjb25zdCBzdGFydEFuZ2xlWCA9IHRoaXMubWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ3hfcm90JywgMCk7XHJcbiAgICAgICAgLy8gY29uc3Qgc3RhcnRBbmdsZVkgPSB0aGlzLm1hdGVyaWFsLmdldFByb3BlcnR5KCd5X3JvdCcsIDApO1xyXG5cclxuICAgICAgICAvLyBjYy50d2Vlbih7IGFuZ2xlVmVjMjogY2MudjIoc3RhcnRBbmdsZVgsIHN0YXJ0QW5nbGVZKSB9KVxyXG4gICAgICAgIC8vIC50bygwLjIsIHsgYW5nbGVWZWMyOiBjYy5WZWMyLlpFUk99LCB7XHJcbiAgICAgICAgLy8gICAgIG9uVXBkYXRlOiAodGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd4X3JvdCcsIHRhcmdldC5hbmdsZVZlYzIueCk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd5X3JvdCcsIHRhcmdldC5hbmdsZVZlYzIueSk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KVxyXG4gICAgICAgIC8vIC5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pig5bCEXHJcbiAgICAgKiBAcGFyYW0gbnVtIOW9k+WJjeWAvFxyXG4gICAgICogQHBhcmFtIHNvdXJjZU1pbiDljp/mnIDlsI/lgLxcclxuICAgICAqIEBwYXJhbSBzb3VyY2VNYXgg5Y6f5pyA5aSn5YC8XHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0TWluIOebruagh+acgOWwj+WAvFxyXG4gICAgICogQHBhcmFtIHRhcmdldE1heCDnm67moIfmnIDlpKflgLxcclxuICAgICAqIEByZXR1cm5zIOaYoOWwhOWQjueahOebruagh+WAvFxyXG4gICAgICovXHJcbiAgICByZW1hcChudW0sIHNvdXJjZU1pbiwgc291cmNlTWF4LCB0YXJnZXRNaW4gPSAwLCB0YXJnZXRNYXggPSAxKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBzb3VyY2VSYW5nZSA9IHNvdXJjZU1heCAtIHNvdXJjZU1pbjtcclxuICAgICAgICBjb25zdCB0YXJnZXRSYW5nZSA9IHRhcmdldE1heCAtIHRhcmdldE1pbjtcclxuICAgICAgICByZXR1cm4gbnVtIC8gc291cmNlUmFuZ2UgKiB0YXJnZXRSYW5nZTtcclxuICAgIH1cclxufSJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/MagnifyingGlass.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '21660wI60tH7qlBLEJAxBqk', 'MagnifyingGlass');
// script/MagnifyingGlass.ts

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
var MagnifyingGlass = /** @class */ (function (_super) {
    __extends(MagnifyingGlass, _super);
    function MagnifyingGlass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.picture = null;
        _this.radiusSlider = null;
        return _this;
        //#endregion 事件监听
    }
    MagnifyingGlass.prototype.onLoad = function () {
        this.picture.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.picture.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchStart, this);
    };
    MagnifyingGlass.prototype.touchStart = function (e) {
        var size = this.picture.node.getContentSize();
        var touch_position = e.getLocation();
        var _inSprteWorldVec2 = this.picture.node.convertToNodeSpaceAR(touch_position);
        var convert_uv_x = (_inSprteWorldVec2.x + size.width / 2) / size.width;
        var convert_uv_y = Math.abs((_inSprteWorldVec2.y - size.height / 2) / size.height);
        // console.log(convert_uv_x.toFixed(2), convert_uv_y.toFixed(2));
        this.picture.getMaterial(0).setProperty('magnifierPos', cc.v2(convert_uv_x, convert_uv_y));
    };
    //#region 事件监听
    MagnifyingGlass.prototype.onRadiusSlider = function (silder) {
        var value = silder.progress;
        this.picture.getMaterial(0).setProperty('magnifierRadius', value);
    };
    MagnifyingGlass.prototype.onScaleSlider = function (silder) {
        var value = silder.progress;
        this.picture.getMaterial(0).setProperty('magnifierScale', value * 2);
    };
    __decorate([
        property({ type: cc.Sprite, tooltip: CC_DEV && '放大图' })
    ], MagnifyingGlass.prototype, "picture", void 0);
    __decorate([
        property({ type: cc.Slider, tooltip: CC_DEV && '半径控制' })
    ], MagnifyingGlass.prototype, "radiusSlider", void 0);
    MagnifyingGlass = __decorate([
        ccclass
    ], MagnifyingGlass);
    return MagnifyingGlass;
}(cc.Component));
exports.default = MagnifyingGlass;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxNYWduaWZ5aW5nR2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBNkMsbUNBQVk7SUFBekQ7UUFBQSxxRUFnQ0M7UUE3QlcsYUFBTyxHQUFjLElBQUksQ0FBQztRQUcxQixrQkFBWSxHQUFjLElBQUksQ0FBQzs7UUF5QnZDLGlCQUFpQjtJQUNyQixDQUFDO0lBeEJHLGdDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFDRCxvQ0FBVSxHQUFWLFVBQVcsQ0FBc0I7UUFDN0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDaEQsSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakYsSUFBTSxZQUFZLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pFLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckYsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsY0FBYztJQUNOLHdDQUFjLEdBQXRCLFVBQXVCLE1BQWlCO1FBQ3BDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFDTyx1Q0FBYSxHQUFyQixVQUFzQixNQUFpQjtRQUNuQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQTNCRDtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7b0RBQ3RCO0lBR2xDO1FBREMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQzt5REFDbEI7SUFOdEIsZUFBZTtRQURuQyxPQUFPO09BQ2EsZUFBZSxDQWdDbkM7SUFBRCxzQkFBQztDQWhDRCxBQWdDQyxDQWhDNEMsRUFBRSxDQUFDLFNBQVMsR0FnQ3hEO2tCQWhDb0IsZUFBZSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWduaWZ5aW5nR2xhc3MgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IGNjLlNwcml0ZSwgdG9vbHRpcDogQ0NfREVWICYmICfmlL7lpKflm74nIH0pXHJcbiAgICBwcml2YXRlIHBpY3R1cmU6IGNjLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuU2xpZGVyLCB0b29sdGlwOiBDQ19ERVYgJiYgJ+WNiuW+hOaOp+WIticgfSlcclxuICAgIHByaXZhdGUgcmFkaXVzU2xpZGVyOiBjYy5TbGlkZXIgPSBudWxsO1xyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLnBpY3R1cmUubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy50b3VjaFN0YXJ0LCB0aGlzKTtcclxuICAgICAgICB0aGlzLnBpY3R1cmUubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLnRvdWNoU3RhcnQsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgdG91Y2hTdGFydChlOiBjYy5FdmVudC5FdmVudFRvdWNoKSB7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMucGljdHVyZS5ub2RlLmdldENvbnRlbnRTaXplKCk7XHJcbiAgICAgICAgY29uc3QgdG91Y2hfcG9zaXRpb24gPSBlLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgX2luU3BydGVXb3JsZFZlYzIgPSB0aGlzLnBpY3R1cmUubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaF9wb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgY29udmVydF91dl94ID0gKF9pblNwcnRlV29ybGRWZWMyLnggKyBzaXplLndpZHRoIC8gMikgLyBzaXplLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNvbnZlcnRfdXZfeSA9IE1hdGguYWJzKChfaW5TcHJ0ZVdvcmxkVmVjMi55IC0gc2l6ZS5oZWlnaHQgLyAyKSAvIHNpemUuaGVpZ2h0KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjb252ZXJ0X3V2X3gudG9GaXhlZCgyKSwgY29udmVydF91dl95LnRvRml4ZWQoMikpO1xyXG4gICAgICAgIHRoaXMucGljdHVyZS5nZXRNYXRlcmlhbCgwKS5zZXRQcm9wZXJ0eSgnbWFnbmlmaWVyUG9zJywgY2MudjIoY29udmVydF91dl94LCBjb252ZXJ0X3V2X3kpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNyZWdpb24g5LqL5Lu255uR5ZCsXHJcbiAgICBwcml2YXRlIG9uUmFkaXVzU2xpZGVyKHNpbGRlcjogY2MuU2xpZGVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBzaWxkZXIucHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5waWN0dXJlLmdldE1hdGVyaWFsKDApLnNldFByb3BlcnR5KCdtYWduaWZpZXJSYWRpdXMnLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uU2NhbGVTbGlkZXIoc2lsZGVyOiBjYy5TbGlkZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHNpbGRlci5wcm9ncmVzcztcclxuICAgICAgICB0aGlzLnBpY3R1cmUuZ2V0TWF0ZXJpYWwoMCkuc2V0UHJvcGVydHkoJ21hZ25pZmllclNjYWxlJywgdmFsdWUgKiAyKTtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvbiDkuovku7bnm5HlkKxcclxufVxyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/SpineCtrl.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4df6eUyqxtO5YJ+ZEFBY3bK', 'SpineCtrl');
// script/SpineCtrl.ts

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
exports.SpineCtrl = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// 参考:https://forum.cocos.org/t/topic/169788/2
var SpineCtrl = /** @class */ (function (_super) {
    __extends(SpineCtrl, _super);
    function SpineCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetSpine = null;
        _this.spine = null;
        return _this;
    }
    SpineCtrl.prototype.start = function () {
        this.spine = this.node.getComponent(sp.Skeleton);
    };
    /** 从指定时间开始播放Spine动画 */
    SpineCtrl.prototype.playSpineFromTime = function (spine, animName, loop, time) {
        var trackEntry = spine.setAnimation(0, animName, loop);
        var duration = trackEntry.animation.duration;
        // 限制播放时间范围
        time = time % duration;
        // 设置Spine动画开始时间
        trackEntry.trackTime = time;
    };
    SpineCtrl.prototype.onBtn = function () {
        var FrameRate = 60;
        var SecondsPerFrame = 1 / FrameRate;
        var time = this.getSpineCurrentTime(this.targetSpine);
        // 在下一帧同步
        this.playSpineFromTime(this.spine, "jump", true, time + SecondsPerFrame);
        this.playSpineFromTime(this.targetSpine, "jump", true, time + SecondsPerFrame);
    };
    SpineCtrl.prototype.onClickButtonTest = function () {
        var time = this.getSpineCurrentTime(this.targetSpine);
        console.log("time", time);
    };
    /**
     * 获取 Spine 动画当前播放时间
     * @param {sp.Skeleton} spine - Spine 骨骼实例
     * @returns {number} 当前动画的播放时间（秒）
     */
    SpineCtrl.prototype.getSpineCurrentTime = function (spine) {
        return spine.getCurrent(0).animationTime;
    };
    /**
     * 传入spine与进度比例（注意初始要把spine的TimeScale设置为0）
     * 参考:https://www.shuzhiduo.com/A/KE5QyDnL5L/#google_vignette
     * @param spine
     * @param rate
     */
    SpineCtrl.prototype.updateSpine = function (spine, rate) {
        var track = spine.getCurrent(0);
        var timeEnd = track.animationEnd;
        var current = timeEnd * rate;
        track.animationStart = current;
        spine.setToSetupPose();
    };
    __decorate([
        property(sp.Skeleton)
    ], SpineCtrl.prototype, "targetSpine", void 0);
    SpineCtrl = __decorate([
        ccclass
    ], SpineCtrl);
    return SpineCtrl;
}(cc.Component));
exports.SpineCtrl = SpineCtrl;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxTcGluZUN0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFNLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBQzVDLDhDQUE4QztBQUc5QztJQUErQiw2QkFBWTtJQUEzQztRQUFBLHFFQTBEQztRQXhEMEIsaUJBQVcsR0FBZ0IsSUFBSSxDQUFDO1FBRS9DLFdBQUssR0FBZ0IsSUFBSSxDQUFDOztJQXNEdEMsQ0FBQztJQXBEYSx5QkFBSyxHQUFmO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHVCQUF1QjtJQUNoQixxQ0FBaUIsR0FBeEIsVUFBeUIsS0FBa0IsRUFBRSxRQUFnQixFQUFFLElBQWEsRUFBRSxJQUFZO1FBQ3RGLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUMvQyxXQUFXO1FBQ1gsSUFBSSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdkIsZ0JBQWdCO1FBQ2hCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCx5QkFBSyxHQUFMO1FBQ0ksSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV4RCxTQUFTO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVPLHFDQUFpQixHQUF6QjtRQUNJLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyx1Q0FBbUIsR0FBM0IsVUFBNEIsS0FBa0I7UUFDMUMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQTtJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSywrQkFBVyxHQUFuQixVQUFvQixLQUFrQixFQUFFLElBQVk7UUFDaEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDL0IsS0FBSyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7UUFDL0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUF2RHNCO1FBQXRCLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO2tEQUFpQztJQUY5QyxTQUFTO1FBRHJCLE9BQU87T0FDSyxTQUFTLENBMERyQjtJQUFELGdCQUFDO0NBMURELEFBMERDLENBMUQ4QixFQUFFLENBQUMsU0FBUyxHQTBEMUM7QUExRFksOEJBQVMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG4vLyDlj4LogIM6aHR0cHM6Ly9mb3J1bS5jb2Nvcy5vcmcvdC90b3BpYy8xNjk3ODgvMlxyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIFNwaW5lQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5KHNwLlNrZWxldG9uKSB0YXJnZXRTcGluZTogc3AuU2tlbGV0b24gPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc3BpbmU6IHNwLlNrZWxldG9uID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcGluZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDku47mjIflrprml7bpl7TlvIDlp4vmkq3mlL5TcGluZeWKqOeUuyAqL1xyXG4gICAgcHVibGljIHBsYXlTcGluZUZyb21UaW1lKHNwaW5lOiBzcC5Ta2VsZXRvbiwgYW5pbU5hbWU6IHN0cmluZywgbG9vcDogYm9vbGVhbiwgdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdHJhY2tFbnRyeSA9IHNwaW5lLnNldEFuaW1hdGlvbigwLCBhbmltTmFtZSwgbG9vcCk7XHJcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0cmFja0VudHJ5LmFuaW1hdGlvbi5kdXJhdGlvbjtcclxuICAgICAgICAvLyDpmZDliLbmkq3mlL7ml7bpl7TojIPlm7RcclxuICAgICAgICB0aW1lID0gdGltZSAlIGR1cmF0aW9uO1xyXG4gICAgICAgIC8vIOiuvue9rlNwaW5l5Yqo55S75byA5aeL5pe26Ze0XHJcbiAgICAgICAgdHJhY2tFbnRyeS50cmFja1RpbWUgPSB0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQnRuKCkge1xyXG4gICAgICAgIGNvbnN0IEZyYW1lUmF0ZSA9IDYwO1xyXG4gICAgICAgIGNvbnN0IFNlY29uZHNQZXJGcmFtZSA9IDEgLyBGcmFtZVJhdGU7XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmdldFNwaW5lQ3VycmVudFRpbWUodGhpcy50YXJnZXRTcGluZSk7XHJcblxyXG4gICAgICAgIC8vIOWcqOS4i+S4gOW4p+WQjOatpVxyXG4gICAgICAgIHRoaXMucGxheVNwaW5lRnJvbVRpbWUodGhpcy5zcGluZSwgXCJqdW1wXCIsIHRydWUsIHRpbWUgKyBTZWNvbmRzUGVyRnJhbWUpO1xyXG4gICAgICAgIHRoaXMucGxheVNwaW5lRnJvbVRpbWUodGhpcy50YXJnZXRTcGluZSwgXCJqdW1wXCIsIHRydWUsIHRpbWUgKyBTZWNvbmRzUGVyRnJhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25DbGlja0J1dHRvblRlc3QoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGltZSA9IHRoaXMuZ2V0U3BpbmVDdXJyZW50VGltZSh0aGlzLnRhcmdldFNwaW5lKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRpbWVcIiwgdGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5YgU3BpbmUg5Yqo55S75b2T5YmN5pKt5pS+5pe26Ze0XHJcbiAgICAgKiBAcGFyYW0ge3NwLlNrZWxldG9ufSBzcGluZSAtIFNwaW5lIOmqqOmqvOWunuS+i1xyXG4gICAgICogQHJldHVybnMge251bWJlcn0g5b2T5YmN5Yqo55S755qE5pKt5pS+5pe26Ze077yI56eS77yJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0U3BpbmVDdXJyZW50VGltZShzcGluZTogc3AuU2tlbGV0b24pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcGluZS5nZXRDdXJyZW50KDApLmFuaW1hdGlvblRpbWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS8oOWFpXNwaW5l5LiO6L+b5bqm5q+U5L6L77yI5rOo5oSP5Yid5aeL6KaB5oqKc3BpbmXnmoRUaW1lU2NhbGXorr7nva7kuLow77yJXHJcbiAgICAgKiDlj4LogIM6aHR0cHM6Ly93d3cuc2h1emhpZHVvLmNvbS9BL0tFNVF5RG5MNUwvI2dvb2dsZV92aWduZXR0ZVxyXG4gICAgICogQHBhcmFtIHNwaW5lIFxyXG4gICAgICogQHBhcmFtIHJhdGUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlU3BpbmUoc3BpbmU6IHNwLlNrZWxldG9uLCByYXRlOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0cmFjayA9IHNwaW5lLmdldEN1cnJlbnQoMCk7XHJcbiAgICAgICAgY29uc3QgdGltZUVuZCA9IHRyYWNrLmFuaW1hdGlvbkVuZDtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGltZUVuZCAqIHJhdGU7XHJcbiAgICAgICAgdHJhY2suYW5pbWF0aW9uU3RhcnQgPSBjdXJyZW50O1xyXG4gICAgICAgIHNwaW5lLnNldFRvU2V0dXBQb3NlKCk7XHJcbiAgICB9XHJcbn0iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/TextureBlend.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'bb40fu51/JPU7vI57pqi/5n', 'TextureBlend');
// script/TextureBlend.ts

"use strict";
/**
 * 将两张 cc.Texture2D（含 cc.RenderTexture）按「上层盖在下层上」做 Alpha 合成，
 * 得到一张新的 cc.RenderTexture（同样继承 Texture2D，可当普通贴图用）。
 *
 * 实现：离屏 Camera + 两个 Sprite（底 / 顶），一次渲染写入目标 RT。
 * 注意：若贴图参与动态合图，请先对资源设 packable=false 或使用独立整图，避免 UV 错位。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.blendTwoTexturesToTexture2D = exports.blendTwoTexturesToRenderTexture = void 0;
/**
 * @param bottom 底层纹理
 * @param top 上层纹理（按 Sprite 默认混合：支持半透明叠在底层上）
 * @param opts 可选输出尺寸；若小于某张输入，会按比例拉伸铺满输出区域
 * @returns 新的 RenderTexture；失败时返回 null（参数非法或引擎未就绪）
 */
function blendTwoTexturesToRenderTexture(bottom, top, opts) {
    var _a, _b;
    if (!bottom || !top || !bottom.width || !bottom.height || !top.width || !top.height) {
        return null;
    }
    var w = Math.max(1, Math.floor((_a = opts === null || opts === void 0 ? void 0 : opts.width) !== null && _a !== void 0 ? _a : Math.max(bottom.width, top.width)));
    var h = Math.max(1, Math.floor((_b = opts === null || opts === void 0 ? void 0 : opts.height) !== null && _b !== void 0 ? _b : Math.max(bottom.height, top.height)));
    var out = new cc.RenderTexture();
    out.initWithSize(w, h);
    var scene = cc.director.getScene();
    if (!scene)
        return null;
    var root = new cc.Node('_BlendTexRoot');
    root.parent = scene;
    root.setPosition(10000, 10000);
    root.group = 'default';
    var camNode = new cc.Node('_BlendTexCam');
    camNode.parent = scene;
    camNode.setPosition(10000, 10000);
    camNode.group = root.group;
    var cam = camNode.addComponent(cc.Camera);
    cam.enabled = false;
    cam.clearFlags = cc.Camera.ClearFlags.COLOR;
    cam.backgroundColor = new cc.Color(0, 0, 0, 0);
    cam.alignWithScreen = false;
    cam.ortho = true;
    cam.nearClip = -1024;
    cam.farClip = 1024;
    cam.orthoSize = h / 2;
    cam.zoomRatio = 1;
    cam.cullingMask = 1 << root.groupIndex;
    var addLayer = function (tex, z) {
        var n = new cc.Node();
        n.parent = root;
        n.group = root.group;
        n.zIndex = z;
        n.setContentSize(w, h);
        n.setPosition(0, 0);
        n.anchorX = 0.5;
        n.anchorY = 0.5;
        var sp = n.addComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var sf = new cc.SpriteFrame();
        sf.setTexture(tex, new cc.Rect(0, 0, tex.width, tex.height));
        sp.spriteFrame = sf;
    };
    addLayer(bottom, 0);
    addLayer(top, 1);
    cam.targetTexture = out;
    cam.render(root);
    cam.targetTexture = null;
    root.destroy();
    camNode.destroy();
    return out;
}
exports.blendTwoTexturesToRenderTexture = blendTwoTexturesToRenderTexture;
/**
 * 与 {@link blendTwoTexturesToRenderTexture} 相同，仅返回类型写为 Texture2D 便于接属性类型。
 */
function blendTwoTexturesToTexture2D(bottom, top, opts) {
    return blendTwoTexturesToRenderTexture(bottom, top, opts);
}
exports.blendTwoTexturesToTexture2D = blendTwoTexturesToTexture2D;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxUZXh0dXJlQmxlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRzs7O0FBU0g7Ozs7O0dBS0c7QUFDSCxTQUFnQiwrQkFBK0IsQ0FDM0MsTUFBb0IsRUFDcEIsR0FBaUIsRUFDakIsSUFBOEI7O0lBRTlCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2pGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxPQUFDLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLE9BQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsSUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbkMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkIsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQyxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRXhCLElBQU0sSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUV2QixJQUFNLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBRTNCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBWSxDQUFDO0lBQ25ELEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9DLEdBQUcsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDckIsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDbkIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7SUFFdkMsSUFBTSxRQUFRLEdBQUcsVUFBQyxHQUFpQixFQUFFLENBQVM7UUFDMUMsSUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDaEIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3RCxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDLENBQUM7SUFFRixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFakIsR0FBRyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUV6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFbEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBbkVELDBFQW1FQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsMkJBQTJCLENBQ3ZDLE1BQW9CLEVBQ3BCLEdBQWlCLEVBQ2pCLElBQThCO0lBRTlCLE9BQU8sK0JBQStCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBTkQsa0VBTUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5bCG5Lik5bygIGNjLlRleHR1cmUyRO+8iOWQqyBjYy5SZW5kZXJUZXh0dXJl77yJ5oyJ44CM5LiK5bGC55uW5Zyo5LiL5bGC5LiK44CN5YGaIEFscGhhIOWQiOaIkO+8jFxyXG4gKiDlvpfliLDkuIDlvKDmlrDnmoQgY2MuUmVuZGVyVGV4dHVyZe+8iOWQjOagt+e7p+aJvyBUZXh0dXJlMkTvvIzlj6/lvZPmma7pgJrotLTlm77nlKjvvInjgIJcclxuICpcclxuICog5a6e546w77ya56a75bGPIENhbWVyYSArIOS4pOS4qiBTcHJpdGXvvIjlupUgLyDpobbvvInvvIzkuIDmrKHmuLLmn5PlhpnlhaXnm67moIcgUlTjgIJcclxuICog5rOo5oSP77ya6Iul6LS05Zu+5Y+C5LiO5Yqo5oCB5ZCI5Zu+77yM6K+35YWI5a+56LWE5rqQ6K6+IHBhY2thYmxlPWZhbHNlIOaIluS9v+eUqOeLrOeri+aVtOWbvu+8jOmBv+WFjSBVViDplJnkvY3jgIJcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJsZW5kVHdvVGV4dHVyZXNPcHRpb25zIHtcclxuICAgIC8qKiDovpPlh7rlrr3luqbvvJvpu5jorqQgbWF4KOW6leWuvSwg6aG25a69KSAqL1xyXG4gICAgd2lkdGg/OiBudW1iZXI7XHJcbiAgICAvKiog6L6T5Ye66auY5bqm77yb6buY6K6kIG1heCjlupXpq5gsIOmhtumrmCkgKi9cclxuICAgIGhlaWdodD86IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBib3R0b20g5bqV5bGC57q555CGXHJcbiAqIEBwYXJhbSB0b3Ag5LiK5bGC57q555CG77yI5oyJIFNwcml0ZSDpu5jorqTmt7flkIjvvJrmlK/mjIHljYrpgI/mmI7lj6DlnKjlupXlsYLkuIrvvIlcclxuICogQHBhcmFtIG9wdHMg5Y+v6YCJ6L6T5Ye65bC65a+477yb6Iul5bCP5LqO5p+Q5byg6L6T5YWl77yM5Lya5oyJ5q+U5L6L5ouJ5Ly46ZO65ruh6L6T5Ye65Yy65Z+fXHJcbiAqIEByZXR1cm5zIOaWsOeahCBSZW5kZXJUZXh0dXJl77yb5aSx6LSl5pe26L+U5ZueIG51bGzvvIjlj4LmlbDpnZ7ms5XmiJblvJXmk47mnKrlsLHnu6rvvIlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBibGVuZFR3b1RleHR1cmVzVG9SZW5kZXJUZXh0dXJlKFxyXG4gICAgYm90dG9tOiBjYy5UZXh0dXJlMkQsXHJcbiAgICB0b3A6IGNjLlRleHR1cmUyRCxcclxuICAgIG9wdHM/OiBCbGVuZFR3b1RleHR1cmVzT3B0aW9uc1xyXG4pOiBjYy5SZW5kZXJUZXh0dXJlIHwgbnVsbCB7XHJcbiAgICBpZiAoIWJvdHRvbSB8fCAhdG9wIHx8ICFib3R0b20ud2lkdGggfHwgIWJvdHRvbS5oZWlnaHQgfHwgIXRvcC53aWR0aCB8fCAhdG9wLmhlaWdodCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKG9wdHM/LndpZHRoID8/IE1hdGgubWF4KGJvdHRvbS53aWR0aCwgdG9wLndpZHRoKSkpO1xyXG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3Iob3B0cz8uaGVpZ2h0ID8/IE1hdGgubWF4KGJvdHRvbS5oZWlnaHQsIHRvcC5oZWlnaHQpKSk7XHJcblxyXG4gICAgY29uc3Qgb3V0ID0gbmV3IGNjLlJlbmRlclRleHR1cmUoKTtcclxuICAgIG91dC5pbml0V2l0aFNpemUodywgaCk7XHJcblxyXG4gICAgY29uc3Qgc2NlbmUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpO1xyXG4gICAgaWYgKCFzY2VuZSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBjYy5Ob2RlKCdfQmxlbmRUZXhSb290Jyk7XHJcbiAgICByb290LnBhcmVudCA9IHNjZW5lO1xyXG4gICAgcm9vdC5zZXRQb3NpdGlvbigxMDAwMCwgMTAwMDApO1xyXG4gICAgcm9vdC5ncm91cCA9ICdkZWZhdWx0JztcclxuXHJcbiAgICBjb25zdCBjYW1Ob2RlID0gbmV3IGNjLk5vZGUoJ19CbGVuZFRleENhbScpO1xyXG4gICAgY2FtTm9kZS5wYXJlbnQgPSBzY2VuZTtcclxuICAgIGNhbU5vZGUuc2V0UG9zaXRpb24oMTAwMDAsIDEwMDAwKTtcclxuICAgIGNhbU5vZGUuZ3JvdXAgPSByb290Lmdyb3VwO1xyXG5cclxuICAgIGNvbnN0IGNhbSA9IGNhbU5vZGUuYWRkQ29tcG9uZW50KGNjLkNhbWVyYSk7XHJcbiAgICBjYW0uZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY2FtLmNsZWFyRmxhZ3MgPSBjYy5DYW1lcmEuQ2xlYXJGbGFncy5DT0xPUiBhcyBhbnk7XHJcbiAgICBjYW0uYmFja2dyb3VuZENvbG9yID0gbmV3IGNjLkNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgY2FtLmFsaWduV2l0aFNjcmVlbiA9IGZhbHNlO1xyXG4gICAgY2FtLm9ydGhvID0gdHJ1ZTtcclxuICAgIGNhbS5uZWFyQ2xpcCA9IC0xMDI0O1xyXG4gICAgY2FtLmZhckNsaXAgPSAxMDI0O1xyXG4gICAgY2FtLm9ydGhvU2l6ZSA9IGggLyAyO1xyXG4gICAgY2FtLnpvb21SYXRpbyA9IDE7XHJcbiAgICBjYW0uY3VsbGluZ01hc2sgPSAxIDw8IHJvb3QuZ3JvdXBJbmRleDtcclxuXHJcbiAgICBjb25zdCBhZGRMYXllciA9ICh0ZXg6IGNjLlRleHR1cmUyRCwgejogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbiA9IG5ldyBjYy5Ob2RlKCk7XHJcbiAgICAgICAgbi5wYXJlbnQgPSByb290O1xyXG4gICAgICAgIG4uZ3JvdXAgPSByb290Lmdyb3VwO1xyXG4gICAgICAgIG4uekluZGV4ID0gejtcclxuICAgICAgICBuLnNldENvbnRlbnRTaXplKHcsIGgpO1xyXG4gICAgICAgIG4uc2V0UG9zaXRpb24oMCwgMCk7XHJcbiAgICAgICAgbi5hbmNob3JYID0gMC41O1xyXG4gICAgICAgIG4uYW5jaG9yWSA9IDAuNTtcclxuICAgICAgICBjb25zdCBzcCA9IG4uYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XHJcbiAgICAgICAgc3Auc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuQ1VTVE9NO1xyXG4gICAgICAgIGNvbnN0IHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKCk7XHJcbiAgICAgICAgc2Yuc2V0VGV4dHVyZSh0ZXgsIG5ldyBjYy5SZWN0KDAsIDAsIHRleC53aWR0aCwgdGV4LmhlaWdodCkpO1xyXG4gICAgICAgIHNwLnNwcml0ZUZyYW1lID0gc2Y7XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZExheWVyKGJvdHRvbSwgMCk7XHJcbiAgICBhZGRMYXllcih0b3AsIDEpO1xyXG5cclxuICAgIGNhbS50YXJnZXRUZXh0dXJlID0gb3V0O1xyXG4gICAgY2FtLnJlbmRlcihyb290KTtcclxuICAgIGNhbS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuXHJcbiAgICByb290LmRlc3Ryb3koKTtcclxuICAgIGNhbU5vZGUuZGVzdHJveSgpO1xyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuI4ge0BsaW5rIGJsZW5kVHdvVGV4dHVyZXNUb1JlbmRlclRleHR1cmV9IOebuOWQjO+8jOS7hei/lOWbnuexu+Wei+WGmeS4uiBUZXh0dXJlMkQg5L6/5LqO5o6l5bGe5oCn57G75Z6L44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYmxlbmRUd29UZXh0dXJlc1RvVGV4dHVyZTJEKFxyXG4gICAgYm90dG9tOiBjYy5UZXh0dXJlMkQsXHJcbiAgICB0b3A6IGNjLlRleHR1cmUyRCxcclxuICAgIG9wdHM/OiBCbGVuZFR3b1RleHR1cmVzT3B0aW9uc1xyXG4pOiBjYy5UZXh0dXJlMkQgfCBudWxsIHtcclxuICAgIHJldHVybiBibGVuZFR3b1RleHR1cmVzVG9SZW5kZXJUZXh0dXJlKGJvdHRvbSwgdG9wLCBvcHRzKTtcclxufVxyXG4iXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/SpineRunner.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0f779SzpjZMWJdE6vZ1QBHl', 'SpineRunner');
// script/SpineRunner.ts

// 编辑器模式下运行spine
if (CC_EDITOR) {
    // 重写update方法 达到在编辑模式下 自动播放动画的功能
    sp.Skeleton.prototype['update'] = function (dt) {
        if (CC_EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }
        if (this.paused) {
            return;
        }
        dt *= this.timeScale * sp['timeScale'];
        if (!this.isAnimationCached()) {
            this._updateRealtime(dt);
            return;
        }
        if (this._isAniComplete) {
            if (this._animationQueue.length === 0 && !this._headAniInfo) {
                var frameCache = this._frameCache;
                if (frameCache && frameCache.isInvalid()) {
                    frameCache.updateToFrame();
                    var frames = frameCache.frames;
                    this._curFrame = frames[frames.length - 1];
                }
                return;
            }
            if (!this._headAniInfo) {
                this._headAniInfo = this._animationQueue.shift();
            }
            this._accTime += dt;
            if (this._accTime > this._headAniInfo.delay) {
                var aniInfo = this._headAniInfo;
                this._headAniInfo = null;
                this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
            }
            return;
        }
        this._updateCache(dt);
    };
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxTcGluZVJ1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZ0I7QUFDaEIsSUFBSSxTQUFTLEVBQUU7SUFDWCxnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxFQUFFO1FBQzFDLElBQUksU0FBUyxFQUFFO1lBQ1gsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQzVCLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUd2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QixPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN6RCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNsQyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQ3RDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDOUM7Z0JBQ0QsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNwRDtZQUNELElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtnQkFDekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUM7Q0FDTCIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIOe8lui+keWZqOaooeW8j+S4i+i/kOihjHNwaW5lXHJcbmlmIChDQ19FRElUT1IpIHtcclxuICAgIC8vIOmHjeWGmXVwZGF0ZeaWueazlSDovr7liLDlnKjnvJbovpHmqKHlvI/kuIsg6Ieq5Yqo5pKt5pS+5Yqo55S755qE5Yqf6IO9XHJcbiAgICBzcC5Ta2VsZXRvbi5wcm90b3R5cGVbJ3VwZGF0ZSddID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xyXG4gICAgICAgICAgICBjY1snZW5naW5lJ10uX2FuaW1hdGluZ0luRWRpdE1vZGUgPSAxO1xyXG4gICAgICAgICAgICBjY1snZW5naW5lJ10uYW5pbWF0aW5nSW5FZGl0TW9kZSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgZHQgKj0gdGhpcy50aW1lU2NhbGUgKiBzcFsndGltZVNjYWxlJ107XHJcblxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSZWFsdGltZShkdCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0FuaUNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbmltYXRpb25RdWV1ZS5sZW5ndGggPT09IDAgJiYgIXRoaXMuX2hlYWRBbmlJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJhbWVDYWNoZSA9IHRoaXMuX2ZyYW1lQ2FjaGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWVDYWNoZSAmJiBmcmFtZUNhY2hlLmlzSW52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lcyA9IGZyYW1lQ2FjaGUuZnJhbWVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRBbmlJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkQW5pSW5mbyA9IHRoaXMuX2FuaW1hdGlvblF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSArPSBkdDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPiB0aGlzLl9oZWFkQW5pSW5mby5kZWxheSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuaUluZm8gPSB0aGlzLl9oZWFkQW5pSW5mbztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRBbmlJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIGFuaUluZm8uYW5pbWF0aW9uTmFtZSwgYW5pSW5mby5sb29wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVDYWNoZShkdCk7XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/testCamera.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8f522Na9kRJZLgDVc8uv5i1', 'testCamera');
// script/testCamera.ts

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
exports.testCamera = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var testCamera = /** @class */ (function (_super) {
    __extends(testCamera, _super);
    function testCamera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetSprite = null;
        _this.maskCamera = null;
        return _this;
    }
    testCamera.prototype.onLoad = function () {
        this._renderTexture();
    };
    testCamera.prototype.update = function (dt) {
        // this._renderTexture();
    };
    testCamera.prototype._renderTexture = function () {
        // 将遮罩摄像拍摄的内容渲染到目标图片上
        var renderTexture = new cc.RenderTexture();
        var winSize = cc.view.getVisibleSize();
        var realHeight = (828 / winSize.width) * winSize.height;
        renderTexture.initWithSize(828, realHeight);
        this.maskCamera.targetTexture = renderTexture;
        // this.targetSprite.spriteFrame = spriteFrame;
        // 计算目标图标应该显示的区域的x,y,width,height,然后将摄像机中的对应位置截出来
        var targetRect = this.targetSprite.node.getBoundingBoxToWorld();
        var targetX = targetRect.x; // 414-200 = 214
        var targetY = targetRect.y - 200; // 1472/2 = 736 + 200 = 936 + 200 = 1136
        var targetWidth = targetRect.width;
        var targetHeight = targetRect.height;
        console.warn(targetX, targetY, targetWidth, targetHeight);
        // 将截出来的区域绘制到目标图片上
        var targetSpriteFrame = new cc.SpriteFrame();
        targetSpriteFrame.setTexture(renderTexture);
        targetSpriteFrame.setFlipY(true);
        targetSpriteFrame.setRect(new cc.Rect(0, 0, targetWidth, targetHeight));
        this.targetSprite.spriteFrame = targetSpriteFrame;
    };
    /**
     * 获取节点在特定坐标系下的左下角点位置，基于设计尺寸 828×1472 进行偏移校正
     * @param {cc.Node} node - 目标节点
     * @returns {cc.Vec2} 节点左下角经偏移校正后的坐标点
     */
    testCamera.prototype._getNodeLeftBootomPoint = function (node) {
        var x = node.x;
        var y = node.y;
        var width = node.width;
        var height = node.height;
        var pos = new cc.Vec2(x - width / 2 + 828 / 2, y - height / 2 + 1472 / 2);
        return pos;
    };
    __decorate([
        property({ type: cc.Sprite, tooltip: CC_DEV && '目标图片' })
    ], testCamera.prototype, "targetSprite", void 0);
    __decorate([
        property({ type: cc.Camera, tooltip: CC_DEV && '遮罩摄像机' })
    ], testCamera.prototype, "maskCamera", void 0);
    testCamera = __decorate([
        ccclass
    ], testCamera);
    return testCamera;
}(cc.Component));
exports.testCamera = testCamera;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFx0ZXN0Q2FtZXJhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUc1QztJQUFnQyw4QkFBWTtJQUE1QztRQUFBLHFFQTBEQztRQXZEVyxrQkFBWSxHQUFjLElBQUksQ0FBQztRQUcvQixnQkFBVSxHQUFjLElBQUksQ0FBQzs7SUFvRHpDLENBQUM7SUFsREcsMkJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRVMsMkJBQU0sR0FBaEIsVUFBaUIsRUFBVTtRQUN2Qix5QkFBeUI7SUFDN0IsQ0FBQztJQUVPLG1DQUFjLEdBQXRCO1FBQ0kscUJBQXFCO1FBQ3JCLElBQU0sYUFBYSxHQUFHLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzdDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsSUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDMUQsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQzlDLCtDQUErQztRQUUvQyxpREFBaUQ7UUFDakQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNsRSxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUEsZ0JBQWdCO1FBQzdDLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUEsd0NBQXdDO1FBQzNFLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzFELGtCQUFrQjtRQUNsQixJQUFNLGlCQUFpQixHQUFHLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9DLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1QyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssNENBQXVCLEdBQS9CLFVBQWdDLElBQWE7UUFDekMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUUsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBbkREO1FBREMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztvREFDbEI7SUFHdkM7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO2tEQUNyQjtJQU41QixVQUFVO1FBRHRCLE9BQU87T0FDSyxVQUFVLENBMER0QjtJQUFELGlCQUFDO0NBMURELEFBMERDLENBMUQrQixFQUFFLENBQUMsU0FBUyxHQTBEM0M7QUExRFksZ0NBQVUiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIHRlc3RDYW1lcmEgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IGNjLlNwcml0ZSwgdG9vbHRpcDogQ0NfREVWICYmICfnm67moIflm77niYcnIH0pXHJcbiAgICBwcml2YXRlIHRhcmdldFNwcml0ZTogY2MuU3ByaXRlID0gbnVsbDtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5DYW1lcmEsIHRvb2x0aXA6IENDX0RFViAmJiAn6YGu572p5pGE5YOP5py6JyB9KVxyXG4gICAgcHJpdmF0ZSBtYXNrQ2FtZXJhOiBjYy5DYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgLy8gdGhpcy5fcmVuZGVyVGV4dHVyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlclRleHR1cmUoKSB7XHJcbiAgICAgICAgLy8g5bCG6YGu572p5pGE5YOP5ouN5pGE55qE5YaF5a655riy5p+T5Yiw55uu5qCH5Zu+54mH5LiKXHJcbiAgICAgICAgY29uc3QgcmVuZGVyVGV4dHVyZSA9IG5ldyBjYy5SZW5kZXJUZXh0dXJlKCk7XHJcbiAgICAgICAgY29uc3Qgd2luU2l6ZSA9IGNjLnZpZXcuZ2V0VmlzaWJsZVNpemUoKTtcclxuICAgICAgICBjb25zdCByZWFsSGVpZ2h0ID0gKDgyOCAvIHdpblNpemUud2lkdGgpICogd2luU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgcmVuZGVyVGV4dHVyZS5pbml0V2l0aFNpemUoODI4LCByZWFsSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLnRhcmdldFRleHR1cmUgPSByZW5kZXJUZXh0dXJlO1xyXG4gICAgICAgIC8vIHRoaXMudGFyZ2V0U3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+ebruagh+Wbvuagh+W6lOivpeaYvuekuueahOWMuuWfn+eahHgseSx3aWR0aCxoZWlnaHQs54S25ZCO5bCG5pGE5YOP5py65Lit55qE5a+55bqU5L2N572u5oiq5Ye65p2lXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0UmVjdCA9IHRoaXMudGFyZ2V0U3ByaXRlLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0WCA9IHRhcmdldFJlY3QueDsvLyA0MTQtMjAwID0gMjE0XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0WSA9IHRhcmdldFJlY3QueSAtIDIwMDsvLyAxNDcyLzIgPSA3MzYgKyAyMDAgPSA5MzYgKyAyMDAgPSAxMTM2XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0V2lkdGggPSB0YXJnZXRSZWN0LndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldEhlaWdodCA9IHRhcmdldFJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnNvbGUud2Fybih0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXaWR0aCwgdGFyZ2V0SGVpZ2h0KTtcclxuICAgICAgICAvLyDlsIbmiKrlh7rmnaXnmoTljLrln5/nu5jliLbliLDnm67moIflm77niYfkuIpcclxuICAgICAgICBjb25zdCB0YXJnZXRTcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSgpO1xyXG4gICAgICAgIHRhcmdldFNwcml0ZUZyYW1lLnNldFRleHR1cmUocmVuZGVyVGV4dHVyZSk7XHJcbiAgICAgICAgdGFyZ2V0U3ByaXRlRnJhbWUuc2V0RmxpcFkodHJ1ZSk7XHJcbiAgICAgICAgdGFyZ2V0U3ByaXRlRnJhbWUuc2V0UmVjdChuZXcgY2MuUmVjdCgwLCAwLCB0YXJnZXRXaWR0aCwgdGFyZ2V0SGVpZ2h0KSk7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0U3ByaXRlLnNwcml0ZUZyYW1lID0gdGFyZ2V0U3ByaXRlRnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5boioLngrnlnKjnibnlrprlnZDmoIfns7vkuIvnmoTlt6bkuIvop5LngrnkvY3nva7vvIzln7rkuo7orr7orqHlsLrlr7ggODI4w5cxNDcyIOi/m+ihjOWBj+enu+agoeato1xyXG4gICAgICogQHBhcmFtIHtjYy5Ob2RlfSBub2RlIC0g55uu5qCH6IqC54K5XHJcbiAgICAgKiBAcmV0dXJucyB7Y2MuVmVjMn0g6IqC54K55bem5LiL6KeS57uP5YGP56e75qCh5q2j5ZCO55qE5Z2Q5qCH54K5XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldE5vZGVMZWZ0Qm9vdG9tUG9pbnQobm9kZTogY2MuTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBub2RlLng7XHJcbiAgICAgICAgY29uc3QgeSA9IG5vZGUueTtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IG5vZGUud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gbm9kZS5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgcG9zID0gbmV3IGNjLlZlYzIoeCAtIHdpZHRoIC8gMiArIDgyOCAvIDIsIHkgLSBoZWlnaHQgLyAyICsgMTQ3MiAvIDIpO1xyXG4gICAgICAgIHJldHVybiBwb3M7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/TriangleCounter.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0b0e86m2tNNb69G1oirSlTM', 'TriangleCounter');
// script/TriangleCounter.ts

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
 * Cocos Creator 2.4 WebGL triangle counter.
 *
 * Add this component to a persistent node. It counts the primitives submitted
 * through WebGL drawElements/drawArrays, so batching, Graphics, Spine and
 * MeshRenderer are included in the result.
 */
var TriangleCounter = /** @class */ (function (_super) {
    __extends(TriangleCounter, _super);
    function TriangleCounter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.output = null;
        _this.refreshInterval = 0.25;
        _this.showDrawCalls = true;
        _this._gl = null;
        _this._originalDrawElements = null;
        _this._originalDrawArrays = null;
        _this._wrappedDrawElements = null;
        _this._wrappedDrawArrays = null;
        _this._frameTriangles = 0;
        _this._frameDrawCalls = 0;
        _this._refreshElapsed = 0;
        _this._installed = false;
        _this._unsupportedReason = '';
        return _this;
    }
    TriangleCounter_1 = TriangleCounter;
    TriangleCounter.prototype.onEnable = function () {
        this._install();
        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
    };
    TriangleCounter.prototype.onDisable = function () {
        cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
        this._uninstall();
    };
    TriangleCounter.prototype.update = function (dt) {
        if (!this._installed && !this._unsupportedReason) {
            this._install();
        }
        if (!this.output) {
            return;
        }
        this._refreshElapsed += dt;
        if (this._refreshElapsed < Math.max(0.05, this.refreshInterval)) {
            return;
        }
        this._refreshElapsed = 0;
        if (!this._installed) {
            this.output.string = "Triangles: N/A\n" + (this._unsupportedReason || 'Waiting for WebGL...');
            return;
        }
        var drawInfo = this.showDrawCalls ? "\nDraw Calls: " + TriangleCounter_1.drawCalls : '';
        this.output.string = "Triangles: " + TriangleCounter_1.triangles + drawInfo;
    };
    TriangleCounter.prototype._install = function () {
        if (this._installed) {
            return;
        }
        if (CC_JSB || cc.sys.isNative) {
            this._unsupportedReason = 'Native renderer is not exposed to JavaScript';
            cc.warn('[TriangleCounter] Native preview cannot expose exact GPU triangle submissions. Please use Browser Preview.');
            return;
        }
        if (cc.game.renderType !== cc.game.RENDER_TYPE_WEBGL) {
            this._unsupportedReason = 'WebGL only';
            return;
        }
        var renderer = cc.renderer;
        var device = renderer && renderer.device;
        var gl = device && device._gl;
        if (!gl || typeof gl.drawElements !== 'function' || typeof gl.drawArrays !== 'function') {
            return;
        }
        this._gl = gl;
        this._originalDrawElements = gl.drawElements;
        this._originalDrawArrays = gl.drawArrays;
        var self = this;
        this._wrappedDrawElements = function (mode, count, type, offset) {
            if (count > 0) {
                self._frameTriangles += self._getTriangleCount(mode, count);
                self._frameDrawCalls++;
            }
            return self._originalDrawElements.call(this, mode, count, type, offset);
        };
        this._wrappedDrawArrays = function (mode, first, count) {
            if (count > 0) {
                self._frameTriangles += self._getTriangleCount(mode, count);
                self._frameDrawCalls++;
            }
            return self._originalDrawArrays.call(this, mode, first, count);
        };
        gl.drawElements = this._wrappedDrawElements;
        gl.drawArrays = this._wrappedDrawArrays;
        this._installed = true;
        this._unsupportedReason = '';
    };
    TriangleCounter.prototype._uninstall = function () {
        if (this._gl) {
            if (this._gl.drawElements === this._wrappedDrawElements) {
                this._gl.drawElements = this._originalDrawElements;
            }
            if (this._gl.drawArrays === this._wrappedDrawArrays) {
                this._gl.drawArrays = this._originalDrawArrays;
            }
        }
        this._installed = false;
        this._gl = null;
        this._originalDrawElements = null;
        this._originalDrawArrays = null;
        this._wrappedDrawElements = null;
        this._wrappedDrawArrays = null;
    };
    TriangleCounter.prototype._beforeDraw = function () {
        this._frameTriangles = 0;
        this._frameDrawCalls = 0;
    };
    TriangleCounter.prototype._afterDraw = function () {
        TriangleCounter_1.triangles = this._frameTriangles;
        TriangleCounter_1.drawCalls = this._frameDrawCalls;
    };
    TriangleCounter.prototype._getTriangleCount = function (primitiveType, vertexOrIndexCount) {
        // WebGL primitive constants: TRIANGLES=4, TRIANGLE_STRIP=5, TRIANGLE_FAN=6.
        switch (primitiveType) {
            case 4:
                return Math.floor(vertexOrIndexCount / 3);
            case 5:
            case 6:
                return Math.max(0, vertexOrIndexCount - 2);
            default:
                return 0;
        }
    };
    var TriangleCounter_1;
    /** Number of triangles submitted in the most recently completed frame. */
    TriangleCounter.triangles = 0;
    /** Number of non-empty draw calls observed in that frame. */
    TriangleCounter.drawCalls = 0;
    __decorate([
        property({ type: cc.Label, tooltip: CC_DEV && '用于显示统计结果；不设置时仍可从静态属性读取' })
    ], TriangleCounter.prototype, "output", void 0);
    __decorate([
        property({ tooltip: CC_DEV && '界面刷新间隔，单位为秒' })
    ], TriangleCounter.prototype, "refreshInterval", void 0);
    __decorate([
        property({ tooltip: CC_DEV && '同时显示引擎记录的 DrawCall 数量' })
    ], TriangleCounter.prototype, "showDrawCalls", void 0);
    TriangleCounter = TriangleCounter_1 = __decorate([
        ccclass
    ], TriangleCounter);
    return TriangleCounter;
}(cc.Component));
exports.default = TriangleCounter;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxUcmlhbmdsZUNvdW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFPNUM7Ozs7OztHQU1HO0FBRUg7SUFBNkMsbUNBQVk7SUFBekQ7UUFBQSxxRUF5SkM7UUFoSlUsWUFBTSxHQUFhLElBQUksQ0FBQztRQUd4QixxQkFBZSxHQUFHLElBQUksQ0FBQztRQUd2QixtQkFBYSxHQUFHLElBQUksQ0FBQztRQUVwQixTQUFHLEdBQWUsSUFBSSxDQUFDO1FBQ3ZCLDJCQUFxQixHQUF3RSxJQUFJLENBQUM7UUFDbEcseUJBQW1CLEdBQXlELElBQUksQ0FBQztRQUNqRiwwQkFBb0IsR0FBd0UsSUFBSSxDQUFDO1FBQ2pHLHdCQUFrQixHQUF5RCxJQUFJLENBQUM7UUFDaEYscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsZ0JBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsd0JBQWtCLEdBQUcsRUFBRSxDQUFDOztJQStIcEMsQ0FBQzt3QkF6Sm9CLGVBQWU7SUE0QnRCLGtDQUFRLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVTLG1DQUFT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UyxHQUFHLENBQUMsQ0FBQztJQUc1QjtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksd0JBQXdCLEVBQUUsQ0FBQzttREFDM0M7SUFHL0I7UUFEQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLGFBQWEsRUFBRSxDQUFDOzREQUNqQjtJQUc5QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksdUJBQXVCLEVBQUUsQ0FBQzswREFDN0I7SUFmWCxlQUFlO1FBRG5DLE9BQU87T0FDYSxlQUFlLENBeUpuQztJQUFELHNCQUFDO0NBekpELEFBeUpDLENBeko0QyxFQUFFLENBQUMsU0FBUyxHQXlKeEQ7a0JBekpvQixlQUFlIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbnR5cGUgVHJpYW5nbGVHTCA9IFdlYkdMUmVuZGVyaW5nQ29udGV4dCAmIHtcclxuICAgIGRyYXdFbGVtZW50czogKG1vZGU6IG51bWJlciwgY291bnQ6IG51bWJlciwgdHlwZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikgPT4gdm9pZDtcclxuICAgIGRyYXdBcnJheXM6IChtb2RlOiBudW1iZXIsIGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpID0+IHZvaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29jb3MgQ3JlYXRvciAyLjQgV2ViR0wgdHJpYW5nbGUgY291bnRlci5cclxuICpcclxuICogQWRkIHRoaXMgY29tcG9uZW50IHRvIGEgcGVyc2lzdGVudCBub2RlLiBJdCBjb3VudHMgdGhlIHByaW1pdGl2ZXMgc3VibWl0dGVkXHJcbiAqIHRocm91Z2ggV2ViR0wgZHJhd0VsZW1lbnRzL2RyYXdBcnJheXMsIHNvIGJhdGNoaW5nLCBHcmFwaGljcywgU3BpbmUgYW5kXHJcbiAqIE1lc2hSZW5kZXJlciBhcmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdC5cclxuICovXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaWFuZ2xlQ291bnRlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqIE51bWJlciBvZiB0cmlhbmdsZXMgc3VibWl0dGVkIGluIHRoZSBtb3N0IHJlY2VudGx5IGNvbXBsZXRlZCBmcmFtZS4gKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJpYW5nbGVzID0gMDtcclxuXHJcbiAgICAvKiogTnVtYmVyIG9mIG5vbi1lbXB0eSBkcmF3IGNhbGxzIG9ic2VydmVkIGluIHRoYXQgZnJhbWUuICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRyYXdDYWxscyA9IDA7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuTGFiZWwsIHRvb2x0aXA6IENDX0RFViAmJiAn55So5LqO5pi+56S657uf6K6h57uT5p6c77yb5LiN6K6+572u5pe25LuN5Y+v5LuO6Z2Z5oCB5bGe5oCn6K+75Y+WJyB9KVxyXG4gICAgcHVibGljIG91dHB1dDogY2MuTGFiZWwgPSBudWxsO1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6IENDX0RFViAmJiAn55WM6Z2i5Yi35paw6Ze06ZqU77yM5Y2V5L2N5Li656eSJyB9KVxyXG4gICAgcHVibGljIHJlZnJlc2hJbnRlcnZhbCA9IDAuMjU7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogQ0NfREVWICYmICflkIzml7bmmL7npLrlvJXmk47orrDlvZXnmoQgRHJhd0NhbGwg5pWw6YePJyB9KVxyXG4gICAgcHVibGljIHNob3dEcmF3Q2FsbHMgPSB0cnVlO1xyXG5cclxuICAgIHByaXZhdGUgX2dsOiBUcmlhbmdsZUdMID0gbnVsbDtcclxuICAgIHByaXZhdGUgX29yaWdpbmFsRHJhd0VsZW1lbnRzOiAobW9kZTogbnVtYmVyLCBjb3VudDogbnVtYmVyLCB0eXBlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX29yaWdpbmFsRHJhd0FycmF5czogKG1vZGU6IG51bWJlciwgZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF93cmFwcGVkRHJhd0VsZW1lbnRzOiAobW9kZTogbnVtYmVyLCBjb3VudDogbnVtYmVyLCB0eXBlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3dyYXBwZWREcmF3QXJyYXlzOiAobW9kZTogbnVtYmVyLCBmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2ZyYW1lVHJpYW5nbGVzID0gMDtcclxuICAgIHByaXZhdGUgX2ZyYW1lRHJhd0NhbGxzID0gMDtcclxuICAgIHByaXZhdGUgX3JlZnJlc2hFbGFwc2VkID0gMDtcclxuICAgIHByaXZhdGUgX2luc3RhbGxlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfdW5zdXBwb3J0ZWRSZWFzb24gPSAnJztcclxuXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbCgpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9iZWZvcmVEcmF3LCB0aGlzKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5vbihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCB0aGlzLl9hZnRlckRyYXcsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGUoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9iZWZvcmVEcmF3LCB0aGlzKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgdGhpcy5fYWZ0ZXJEcmF3LCB0aGlzKTtcclxuICAgICAgICB0aGlzLl91bmluc3RhbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2luc3RhbGxlZCAmJiAhdGhpcy5fdW5zdXBwb3J0ZWRSZWFzb24pIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm91dHB1dCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZWZyZXNoRWxhcHNlZCArPSBkdDtcclxuICAgICAgICBpZiAodGhpcy5fcmVmcmVzaEVsYXBzZWQgPCBNYXRoLm1heCgwLjA1LCB0aGlzLnJlZnJlc2hJbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVmcmVzaEVsYXBzZWQgPSAwO1xyXG4gICAgICAgIGlmICghdGhpcy5faW5zdGFsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LnN0cmluZyA9IGBUcmlhbmdsZXM6IE4vQVxcbiR7dGhpcy5fdW5zdXBwb3J0ZWRSZWFzb24gfHwgJ1dhaXRpbmcgZm9yIFdlYkdMLi4uJ31gO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkcmF3SW5mbyA9IHRoaXMuc2hvd0RyYXdDYWxscyA/IGBcXG5EcmF3IENhbGxzOiAke1RyaWFuZ2xlQ291bnRlci5kcmF3Q2FsbHN9YCA6ICcnO1xyXG4gICAgICAgIHRoaXMub3V0cHV0LnN0cmluZyA9IGBUcmlhbmdsZXM6ICR7VHJpYW5nbGVDb3VudGVyLnRyaWFuZ2xlc30ke2RyYXdJbmZvfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5zdGFsbCgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFsbGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChDQ19KU0IgfHwgY2Muc3lzLmlzTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJ05hdGl2ZSByZW5kZXJlciBpcyBub3QgZXhwb3NlZCB0byBKYXZhU2NyaXB0JztcclxuICAgICAgICAgICAgY2Mud2FybignW1RyaWFuZ2xlQ291bnRlcl0gTmF0aXZlIHByZXZpZXcgY2Fubm90IGV4cG9zZSBleGFjdCBHUFUgdHJpYW5nbGUgc3VibWlzc2lvbnMuIFBsZWFzZSB1c2UgQnJvd3NlciBQcmV2aWV3LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlICE9PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJ1dlYkdMIG9ubHknO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IChjYyBhcyBhbnkpLnJlbmRlcmVyO1xyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHJlbmRlcmVyICYmIHJlbmRlcmVyLmRldmljZTtcclxuICAgICAgICBjb25zdCBnbCA9IGRldmljZSAmJiBkZXZpY2UuX2dsIGFzIFRyaWFuZ2xlR0w7XHJcbiAgICAgICAgaWYgKCFnbCB8fCB0eXBlb2YgZ2wuZHJhd0VsZW1lbnRzICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBnbC5kcmF3QXJyYXlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dsID0gZ2w7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3RWxlbWVudHMgPSBnbC5kcmF3RWxlbWVudHM7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3QXJyYXlzID0gZ2wuZHJhd0FycmF5cztcclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fd3JhcHBlZERyYXdFbGVtZW50cyA9IGZ1bmN0aW9uIChtb2RlOiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHR5cGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVUcmlhbmdsZXMgKz0gc2VsZi5fZ2V0VHJpYW5nbGVDb3VudChtb2RlLCBjb3VudCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLl9mcmFtZURyYXdDYWxscysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9vcmlnaW5hbERyYXdFbGVtZW50cy5jYWxsKHRoaXMsIG1vZGUsIGNvdW50LCB0eXBlLCBvZmZzZXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fd3JhcHBlZERyYXdBcnJheXMgPSBmdW5jdGlvbiAobW9kZTogbnVtYmVyLCBmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2ZyYW1lVHJpYW5nbGVzICs9IHNlbGYuX2dldFRyaWFuZ2xlQ291bnQobW9kZSwgY291bnQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVEcmF3Q2FsbHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fb3JpZ2luYWxEcmF3QXJyYXlzLmNhbGwodGhpcywgbW9kZSwgZmlyc3QsIGNvdW50KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyA9IHRoaXMuX3dyYXBwZWREcmF3RWxlbWVudHM7XHJcbiAgICAgICAgZ2wuZHJhd0FycmF5cyA9IHRoaXMuX3dyYXBwZWREcmF3QXJyYXlzO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnN0YWxsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdW5pbnN0YWxsKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9nbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2wuZHJhd0VsZW1lbnRzID09PSB0aGlzLl93cmFwcGVkRHJhd0VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nbC5kcmF3RWxlbWVudHMgPSB0aGlzLl9vcmlnaW5hbERyYXdFbGVtZW50cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2wuZHJhd0FycmF5cyA9PT0gdGhpcy5fd3JhcHBlZERyYXdBcnJheXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dsLmRyYXdBcnJheXMgPSB0aGlzLl9vcmlnaW5hbERyYXdBcnJheXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2luc3RhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2dsID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vcmlnaW5hbERyYXdFbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3QXJyYXlzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkRHJhd0VsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkRHJhd0FycmF5cyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYmVmb3JlRHJhdygpIHtcclxuICAgICAgICB0aGlzLl9mcmFtZVRyaWFuZ2xlcyA9IDA7XHJcbiAgICAgICAgdGhpcy5fZnJhbWVEcmF3Q2FsbHMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FmdGVyRHJhdygpIHtcclxuICAgICAgICBUcmlhbmdsZUNvdW50ZXIudHJpYW5nbGVzID0gdGhpcy5fZnJhbWVUcmlhbmdsZXM7XHJcbiAgICAgICAgVHJpYW5nbGVDb3VudGVyLmRyYXdDYWxscyA9IHRoaXMuX2ZyYW1lRHJhd0NhbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFRyaWFuZ2xlQ291bnQocHJpbWl0aXZlVHlwZTogbnVtYmVyLCB2ZXJ0ZXhPckluZGV4Q291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFdlYkdMIHByaW1pdGl2ZSBjb25zdGFudHM6IFRSSUFOR0xFUz00LCBUUklBTkdMRV9TVFJJUD01LCBUUklBTkdMRV9GQU49Ni5cclxuICAgICAgICBzd2l0Y2ggKHByaW1pdGl2ZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmVydGV4T3JJbmRleENvdW50IC8gMyk7XHJcbiAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIHZlcnRleE9ySW5kZXhDb3VudCAtIDIpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------
