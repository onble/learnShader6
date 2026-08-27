"use strict";
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