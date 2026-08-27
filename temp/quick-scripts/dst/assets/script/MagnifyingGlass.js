
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