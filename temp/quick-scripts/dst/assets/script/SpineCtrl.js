
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/SpineCtrl.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxTcGluZUN0cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFNLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBQzVDLDhDQUE4QztBQUc5QztJQUErQiw2QkFBWTtJQUEzQztRQUFBLHFFQTBEQztRQXhEMEIsaUJBQVcsR0FBZ0IsSUFBSSxDQUFDO1FBRS9DLFdBQUssR0FBZ0IsSUFBSSxDQUFDOztJQXNEdEMsQ0FBQztJQXBEYSx5QkFBSyxHQUFmO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHVCQUF1QjtJQUNoQixxQ0FBaUIsR0FBeEIsVUFBeUIsS0FBa0IsRUFBRSxRQUFnQixFQUFFLElBQWEsRUFBRSxJQUFZO1FBQ3RGLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUMvQyxXQUFXO1FBQ1gsSUFBSSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdkIsZ0JBQWdCO1FBQ2hCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCx5QkFBSyxHQUFMO1FBQ0ksSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV4RCxTQUFTO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVPLHFDQUFpQixHQUF6QjtRQUNJLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyx1Q0FBbUIsR0FBM0IsVUFBNEIsS0FBa0I7UUFDMUMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQTtJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSywrQkFBVyxHQUFuQixVQUFvQixLQUFrQixFQUFFLElBQVk7UUFDaEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDL0IsS0FBSyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7UUFDL0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUF2RHNCO1FBQXRCLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO2tEQUFpQztJQUY5QyxTQUFTO1FBRHJCLE9BQU87T0FDSyxTQUFTLENBMERyQjtJQUFELGdCQUFDO0NBMURELEFBMERDLENBMUQ4QixFQUFFLENBQUMsU0FBUyxHQTBEMUM7QUExRFksOEJBQVMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG4vLyDlj4LogIM6aHR0cHM6Ly9mb3J1bS5jb2Nvcy5vcmcvdC90b3BpYy8xNjk3ODgvMlxyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIFNwaW5lQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5KHNwLlNrZWxldG9uKSB0YXJnZXRTcGluZTogc3AuU2tlbGV0b24gPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc3BpbmU6IHNwLlNrZWxldG9uID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcGluZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDku47mjIflrprml7bpl7TlvIDlp4vmkq3mlL5TcGluZeWKqOeUuyAqL1xyXG4gICAgcHVibGljIHBsYXlTcGluZUZyb21UaW1lKHNwaW5lOiBzcC5Ta2VsZXRvbiwgYW5pbU5hbWU6IHN0cmluZywgbG9vcDogYm9vbGVhbiwgdGltZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdHJhY2tFbnRyeSA9IHNwaW5lLnNldEFuaW1hdGlvbigwLCBhbmltTmFtZSwgbG9vcCk7XHJcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0cmFja0VudHJ5LmFuaW1hdGlvbi5kdXJhdGlvbjtcclxuICAgICAgICAvLyDpmZDliLbmkq3mlL7ml7bpl7TojIPlm7RcclxuICAgICAgICB0aW1lID0gdGltZSAlIGR1cmF0aW9uO1xyXG4gICAgICAgIC8vIOiuvue9rlNwaW5l5Yqo55S75byA5aeL5pe26Ze0XHJcbiAgICAgICAgdHJhY2tFbnRyeS50cmFja1RpbWUgPSB0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQnRuKCkge1xyXG4gICAgICAgIGNvbnN0IEZyYW1lUmF0ZSA9IDYwO1xyXG4gICAgICAgIGNvbnN0IFNlY29uZHNQZXJGcmFtZSA9IDEgLyBGcmFtZVJhdGU7XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLmdldFNwaW5lQ3VycmVudFRpbWUodGhpcy50YXJnZXRTcGluZSk7XHJcblxyXG4gICAgICAgIC8vIOWcqOS4i+S4gOW4p+WQjOatpVxyXG4gICAgICAgIHRoaXMucGxheVNwaW5lRnJvbVRpbWUodGhpcy5zcGluZSwgXCJqdW1wXCIsIHRydWUsIHRpbWUgKyBTZWNvbmRzUGVyRnJhbWUpO1xyXG4gICAgICAgIHRoaXMucGxheVNwaW5lRnJvbVRpbWUodGhpcy50YXJnZXRTcGluZSwgXCJqdW1wXCIsIHRydWUsIHRpbWUgKyBTZWNvbmRzUGVyRnJhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25DbGlja0J1dHRvblRlc3QoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGltZSA9IHRoaXMuZ2V0U3BpbmVDdXJyZW50VGltZSh0aGlzLnRhcmdldFNwaW5lKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRpbWVcIiwgdGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5YgU3BpbmUg5Yqo55S75b2T5YmN5pKt5pS+5pe26Ze0XHJcbiAgICAgKiBAcGFyYW0ge3NwLlNrZWxldG9ufSBzcGluZSAtIFNwaW5lIOmqqOmqvOWunuS+i1xyXG4gICAgICogQHJldHVybnMge251bWJlcn0g5b2T5YmN5Yqo55S755qE5pKt5pS+5pe26Ze077yI56eS77yJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0U3BpbmVDdXJyZW50VGltZShzcGluZTogc3AuU2tlbGV0b24pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBzcGluZS5nZXRDdXJyZW50KDApLmFuaW1hdGlvblRpbWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS8oOWFpXNwaW5l5LiO6L+b5bqm5q+U5L6L77yI5rOo5oSP5Yid5aeL6KaB5oqKc3BpbmXnmoRUaW1lU2NhbGXorr7nva7kuLow77yJXHJcbiAgICAgKiDlj4LogIM6aHR0cHM6Ly93d3cuc2h1emhpZHVvLmNvbS9BL0tFNVF5RG5MNUwvI2dvb2dsZV92aWduZXR0ZVxyXG4gICAgICogQHBhcmFtIHNwaW5lIFxyXG4gICAgICogQHBhcmFtIHJhdGUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlU3BpbmUoc3BpbmU6IHNwLlNrZWxldG9uLCByYXRlOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0cmFjayA9IHNwaW5lLmdldEN1cnJlbnQoMCk7XHJcbiAgICAgICAgY29uc3QgdGltZUVuZCA9IHRyYWNrLmFuaW1hdGlvbkVuZDtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGltZUVuZCAqIHJhdGU7XHJcbiAgICAgICAgdHJhY2suYW5pbWF0aW9uU3RhcnQgPSBjdXJyZW50O1xyXG4gICAgICAgIHNwaW5lLnNldFRvU2V0dXBQb3NlKCk7XHJcbiAgICB9XHJcbn0iXX0=