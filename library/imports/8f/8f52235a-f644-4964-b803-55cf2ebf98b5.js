"use strict";
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