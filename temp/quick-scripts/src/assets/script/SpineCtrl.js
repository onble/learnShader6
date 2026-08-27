"use strict";
cc._RF.push(module, '4df6eUyqxtO5YJ+ZEFBY3bK', 'SpineCtrl');
// script/SpineCtrl.ts

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
exports.SpineCtrl = void 0;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// 参考:https://forum.cocos.org/t/topic/169788/2
var SpineCtrl = /** @class */ (function (_super) {
    __extends(SpineCtrl, _super);
    function SpineCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetSpine = null;
        _this.spine = null;
        return _this;
    }
    SpineCtrl.prototype.start = function () {
        this.spine = this.node.getComponent(sp.Skeleton);
    };
    /** 从指定时间开始播放Spine动画 */
    SpineCtrl.prototype.playSpineFromTime = function (spine, animName, loop, time) {
        var trackEntry = spine.setAnimation(0, animName, loop);
        var duration = trackEntry.animation.duration;
        // 限制播放时间范围
        time = time % duration;
        // 设置Spine动画开始时间
        trackEntry.trackTime = time;
    };
    SpineCtrl.prototype.onBtn = function () {
        var FrameRate = 60;
        var SecondsPerFrame = 1 / FrameRate;
        var time = this.getSpineCurrentTime(this.targetSpine);
        // 在下一帧同步
        this.playSpineFromTime(this.spine, "jump", true, time + SecondsPerFrame);
        this.playSpineFromTime(this.targetSpine, "jump", true, time + SecondsPerFrame);
    };
    SpineCtrl.prototype.onClickButtonTest = function () {
        var time = this.getSpineCurrentTime(this.targetSpine);
        console.log("time", time);
    };
    /**
     * 获取 Spine 动画当前播放时间
     * @param {sp.Skeleton} spine - Spine 骨骼实例
     * @returns {number} 当前动画的播放时间（秒）
     */
    SpineCtrl.prototype.getSpineCurrentTime = function (spine) {
        return spine.getCurrent(0).animationTime;
    };
    /**
     * 传入spine与进度比例（注意初始要把spine的TimeScale设置为0）
     * 参考:https://www.shuzhiduo.com/A/KE5QyDnL5L/#google_vignette
     * @param spine
     * @param rate
     */
    SpineCtrl.prototype.updateSpine = function (spine, rate) {
        var track = spine.getCurrent(0);
        var timeEnd = track.animationEnd;
        var current = timeEnd * rate;
        track.animationStart = current;
        spine.setToSetupPose();
    };
    __decorate([
        property(sp.Skeleton)
    ], SpineCtrl.prototype, "targetSpine", void 0);
    SpineCtrl = __decorate([
        ccclass
    ], SpineCtrl);
    return SpineCtrl;
}(cc.Component));
exports.SpineCtrl = SpineCtrl;

cc._RF.pop();