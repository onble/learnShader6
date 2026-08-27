"use strict";
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