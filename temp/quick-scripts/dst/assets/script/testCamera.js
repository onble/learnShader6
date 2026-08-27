
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