"use strict";
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