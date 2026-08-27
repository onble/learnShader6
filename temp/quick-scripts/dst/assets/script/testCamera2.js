
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFx0ZXN0Q2FtZXJhMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFFNUM7Ozs7O0dBS0c7QUFFSDtJQUFpQywrQkFBWTtJQUE3QztRQUFBLHFFQXNKQztRQW5KVyxrQkFBWSxHQUFjLElBQUksQ0FBQztRQUcvQixnQkFBVSxHQUFjLElBQUksQ0FBQztRQUc3QixvQkFBYyxHQUFnQixJQUFJLENBQUM7UUFHbkMsa0JBQVksR0FBYyxJQUFJLENBQUM7UUFHL0Isa0JBQVksR0FBRyxHQUFHLENBQUM7UUFFbkIsb0JBQWMsR0FBcUIsSUFBSSxDQUFDO1FBQ3hDLGtCQUFZLEdBQW1CLElBQUksQ0FBQztRQUNwQyxXQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsV0FBSyxHQUFHLENBQUMsQ0FBQzs7SUFrSXRCLENBQUM7SUFoSUcsNEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4QyxFQUFFLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDekQsT0FBTztTQUNWO1FBRUQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUss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QVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksbUJBQW1CLEVBQUUsQ0FBQztxREFDL0I7SUFHdkM7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO21EQUM3QjtJQUdyQztRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksa0JBQWtCLEVBQUUsQ0FBQzt1REFDNUI7SUFHM0M7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLDhCQUE4QixFQUFFLENBQUM7cURBQzFDO0lBR3ZDO1FBREMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSw4QkFBOEIsRUFBRSxDQUFDO3FEQUNyQztJQWZsQixXQUFXO1FBRHZCLE9BQU87T0FDSyxXQUFXLENBc0p2QjtJQUFELGtCQUFDO0NBdEpELEFBc0pDLENBdEpnQyxFQUFFLENBQUMsU0FBUyxHQXNKNUM7QUF0Slksa0NBQVciLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIOWwhuS4tOaXtiBHcmFwaGljcyDnrJTov7nlop7ph4/lhpnlhaXlkIzkuIDlvKAgUmVuZGVyVGV4dHVyZeOAglxyXG4gKlxyXG4gKiBSZW5kZXJUZXh0dXJlIOWPquWcqOWIneWni+WMli/ph43nva7ml7bmuIXpmaTpopzoibLvvJvlkI7nu63mj5DkuqTml7blj6rmuIXmt7HluqblkozmqKHmnb/vvIxcclxuICog5Zug5q2k5pen5YOP57Sg5Lya5LiA55u05L+d55WZ44CCR3JhcGhpY3Mg5q+P5qyh5o+Q5Lqk5ZCO56uL5Y2z5riF56m677yM5LiN5Lya57Sv56ev6Lev5b6E5Yeg5L2V44CCXHJcbiAqL1xyXG5AY2NjbGFzc1xyXG5leHBvcnQgY2xhc3MgdGVzdENhbWVyYTIgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IGNjLlNwcml0ZSwgdG9vbHRpcDogQ0NfREVWICYmICfmmL7npLrmjIHkuYXljJbnrJTov7nnurnnkIbnmoQgU3ByaXRlJyB9KVxyXG4gICAgcHJpdmF0ZSB0YXJnZXRTcHJpdGU6IGNjLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuQ2FtZXJhLCB0b29sdGlwOiBDQ19ERVYgJiYgJ+WPqua4suafk+eslOi/ueiKgueCueeahOemu+Wxj+aRhOWDj+acuicgfSlcclxuICAgIHByaXZhdGUgbWFza0NhbWVyYTogY2MuQ2FtZXJhID0gbnVsbDtcclxuXHJcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5HcmFwaGljcywgdG9vbHRpcDogQ0NfREVWICYmICfmr4/mrKHmj5DkuqTlkI7kvJrooqvnq4vljbPmuIXnqbrnmoTkuLTml7bnrJTov7knIH0pXHJcbiAgICBwcml2YXRlIHN0cm9rZUdyYXBoaWNzOiBjYy5HcmFwaGljcyA9IG51bGw7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuU3ByaXRlLCB0b29sdGlwOiBDQ19ERVYgJiYgJ+S9v+eUqCBzY3JhdGNoUmV2ZWFsIOadkOi0qOOAgeaMieWIrueXleaYvuekuueahOWGheWuuScgfSlcclxuICAgIHByaXZhdGUgcmV2ZWFsU3ByaXRlOiBjYy5TcHJpdGUgPSBudWxsO1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6IENDX0RFViAmJiAnUmVuZGVyVGV4dHVyZSDlrr3luqbvvJvpq5jluqbmjInlj6/op4HljLrln5/mr5TkvovorqHnrpcnIH0pXHJcbiAgICBwcml2YXRlIHRleHR1cmVXaWR0aCA9IDgyODtcclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJUZXh0dXJlOiBjYy5SZW5kZXJUZXh0dXJlID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3Nwcml0ZUZyYW1lOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZXhXID0gMDtcclxuICAgIHByaXZhdGUgX3RleEggPSAwO1xyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0U3ByaXRlIHx8ICF0aGlzLm1hc2tDYW1lcmEpIHtcclxuICAgICAgICAgICAgY2MuZXJyb3IoJ1t0ZXN0Q2FtZXJhMl0gdGFyZ2V0U3ByaXRlIOWSjCBtYXNrQ2FtZXJhIOW/hemhu+iuvue9ricpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3aW5TaXplID0gY2Mudmlldy5nZXRWaXNpYmxlU2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RleFcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKHRoaXMudGV4dHVyZVdpZHRoKSk7XHJcbiAgICAgICAgdGhpcy5fdGV4SCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IodGhpcy5fdGV4VyAvIHdpblNpemUud2lkdGggKiB3aW5TaXplLmhlaWdodCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlID0gbmV3IGNjLlJlbmRlclRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlLmluaXRXaXRoU2l6ZSh0aGlzLl90ZXhXLCB0aGlzLl90ZXhIKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUoKTtcclxuICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRoaXMuX3JlbmRlclRleHR1cmUpO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lLnNldEZsaXBZKHRydWUpO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lLnNldFJlY3QobmV3IGNjLlJlY3QoMCwgMCwgdGhpcy5fdGV4VywgdGhpcy5fdGV4SCkpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0U3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5fc3ByaXRlRnJhbWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJldmVhbFNwcml0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJldmVhbFNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5yZXZlYWxTcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ21hc2tUZXh0dXJlJywgdGhpcy5fcmVuZGVyVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVJldmVhbFVWKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcignW3Rlc3RDYW1lcmEyXSByZXZlYWxTcHJpdGUg5rKh5pyJ6K6+572uIHNjcmF0Y2hSZXZlYWwg5p2Q6LSoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOivpSBDYW1lcmEg5Y+q55SxIGNvbW1pdFN0cm9rZS9yZXNldFRleHR1cmUg5omL5Yqo6Kem5Y+R44CCXHJcbiAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1hc2tDYW1lcmEuYmFja2dyb3VuZENvbG9yID0gbmV3IGNjLkNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIC8vIOetieaJgOaciea4suafk+e7hOS7tuWujOaIkCBhc3NlbWJsZXIg5Yid5aeL5YyW5ZCO5YaN6aaW5qyh5riF5bGP44CCXHJcbiAgICAgICAgdGhpcy51cGRhdGVSZXZlYWxVVigpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUZXh0dXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgY2FyZF9vcGVuIOeahOS4lueVjOWMuuWfn+aNoueul+aIkOaVtOWxjyBSZW5kZXJUZXh0dXJlIOeahCBVViDljLrln5/jgIJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVSZXZlYWxVVigpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmV2ZWFsU3ByaXRlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5yZXZlYWxTcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgaWYgKCFtYXRlcmlhbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5yZXZlYWxTcHJpdGUubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcclxuICAgICAgICBjb25zdCBzY3JlZW5XaWR0aCA9IE1hdGgubWF4KDEsIGNjLnZpc2libGVSZWN0LndpZHRoKTtcclxuICAgICAgICBjb25zdCBzY3JlZW5IZWlnaHQgPSBNYXRoLm1heCgxLCBjYy52aXNpYmxlUmVjdC5oZWlnaHQpO1xyXG5cclxuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgnbWFza1VWUmVjdCcsIG5ldyBjYy5WZWM0KFxyXG4gICAgICAgICAgICAocmVjdC54IC0gY2MudmlzaWJsZVJlY3QuYm90dG9tTGVmdC54KSAvIHNjcmVlbldpZHRoLFxyXG4gICAgICAgICAgICAocmVjdC55IC0gY2MudmlzaWJsZVJlY3QuYm90dG9tTGVmdC55KSAvIHNjcmVlbkhlaWdodCxcclxuICAgICAgICAgICAgcmVjdC53aWR0aCAvIHNjcmVlbldpZHRoLFxyXG4gICAgICAgICAgICByZWN0LmhlaWdodCAvIHNjcmVlbkhlaWdodFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIG1hdGVyaWFsLnNldFByb3BlcnR5KCdtYXNrVGhyZXNob2xkJywgMC4wMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiorlvZPliY3kuLTml7bnrJTov7nlj6DliqDov5vnurnnkIbjgILosIPnlKjnu5PmnZ/lkI4gR3JhcGhpY3Mg5Lit5LiN5YaN5L+d55WZ5Lu75L2V5LiJ6KeS6Z2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb21taXRTdHJva2UoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJUZXh0dXJlIHx8ICF0aGlzLm1hc2tDYW1lcmEpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyUm9vdCA9IHRoaXMuc3Ryb2tlR3JhcGhpY3MgJiYgdGhpcy5zdHJva2VHcmFwaGljcy5ub2RlO1xyXG4gICAgICAgIGlmICghcmVuZGVyUm9vdCB8fCAhcmVuZGVyUm9vdC5pc1ZhbGlkKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gdGhpcy5fcmVuZGVyVGV4dHVyZTtcclxuICAgICAgICAgICAgLy8g5LiN5riFIENPTE9S77yM5L+d55WZ5LmL5YmN5bey57uP5YaZ5YWlIFJlbmRlclRleHR1cmUg55qE5omA5pyJ6Lev5b6E44CCXHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS5jbGVhckZsYWdzID0gKFxyXG4gICAgICAgICAgICAgICAgY2MuQ2FtZXJhLkNsZWFyRmxhZ3MuREVQVEggfCBjYy5DYW1lcmEuQ2xlYXJGbGFncy5TVEVOQ0lMXHJcbiAgICAgICAgICAgICkgYXMgYW55O1xyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEucmVuZGVyKHJlbmRlclJvb3QpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3Ryb2tlR3JhcGhpY3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Ryb2tlR3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOe6ueeQhuS4reS/neWtmOeahOWFqOmDqOi3r+W+hOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzZXRUZXh0dXJlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyVGV4dHVyZSB8fCAhdGhpcy5tYXNrQ2FtZXJhKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZUdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Ryb2tlR3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9sZEN1bGxpbmdNYXNrID0gdGhpcy5tYXNrQ2FtZXJhLmN1bGxpbmdNYXNrO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gdGhpcy5fcmVuZGVyVGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmNsZWFyRmxhZ3MgPSAoXHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5DT0xPUiB8XHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5ERVBUSCB8XHJcbiAgICAgICAgICAgICAgICBjYy5DYW1lcmEuQ2xlYXJGbGFncy5TVEVOQ0lMXHJcbiAgICAgICAgICAgICkgYXMgYW55O1xyXG5cclxuICAgICAgICAgICAgLy8g5LiN5riy5p+T5Lu75L2V6IqC54K577yM5Y+q6K6pIENhbWVyYSDmuIXpmaQgUmVuZGVyVGV4dHVyZeOAglxyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEuY3VsbGluZ01hc2sgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm1hc2tDYW1lcmEucmVuZGVyKCk7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLmN1bGxpbmdNYXNrID0gb2xkQ3VsbGluZ01hc2s7XHJcbiAgICAgICAgICAgIHRoaXMubWFza0NhbWVyYS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1hc2tDYW1lcmEgJiYgdGhpcy5tYXNrQ2FtZXJhLnRhcmdldFRleHR1cmUgPT09IHRoaXMuX3JlbmRlclRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXNrQ2FtZXJhLnRhcmdldFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19