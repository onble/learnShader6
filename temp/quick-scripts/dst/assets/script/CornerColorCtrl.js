
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