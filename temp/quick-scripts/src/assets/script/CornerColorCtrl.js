"use strict";
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