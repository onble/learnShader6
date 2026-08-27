
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