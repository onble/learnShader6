
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/Fake3D.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxGYWtlM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBb0MsMEJBQVk7SUFBaEQ7UUFBQSxxRUErRUM7UUE5RWEsY0FBUSxHQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLGNBQVEsR0FBVyxFQUFFLENBQUM7UUFFeEIsY0FBUSxHQUFnQixJQUFJLENBQUM7O0lBMkV6QyxDQUFDO0lBekVHLHNCQUFLLEdBQUw7UUFDSSxTQUFTO1FBQ1QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFbkYsU0FBUztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMs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Q0FBd0I7SUFDdkI7UUFBVCxRQUFROzRDQUF1QjtJQUZmLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0ErRTFCO0lBQUQsYUFBQztDQS9FRCxBQStFQyxDQS9FbUMsRUFBRSxDQUFDLFNBQVMsR0ErRS9DO2tCQS9Fb0IsTUFBTSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYWtlM0QgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgQHByb3BlcnR5IG1pbkFuZ2xlOiBudW1iZXIgPSAtMTU7XHJcbiAgICBAcHJvcGVydHkgbWF4QW5nbGU6IG51bWJlciA9IDE1O1xyXG5cclxuICAgIHByaXZhdGUgbWF0ZXJpYWw6IGNjLk1hdGVyaWFsID0gbnVsbDtcclxuXHJcbiAgICBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICAvLyDmnZDotKgg5Yid5aeL5YyWXHJcbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBzcHJpdGUuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZVNpemUnLCBjYy52Mih0aGlzLm5vZGUud2lkdGgsIHRoaXMubm9kZS5oZWlnaHQpKTtcclxuXHJcbiAgICAgICAgLy8g55uR5ZCs6byg5qCH56e75YqoXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLm9uTW91c2VFbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIHRoaXMub25Nb3VzZU1vdmUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgdGhpcy5vbk1vdXNlTGVhdmUsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VFbnRlcigpIHtcclxuICAgICAgICBjYy50d2Vlbih0aGlzLm5vZGUpXHJcbiAgICAgICAgICAgIC50bygwLjEsIHsgc2NhbGU6IDEuNSB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTW92ZShldmVudDogY2MuRXZlbnQuRXZlbnRNb3VzZSkge1xyXG4gICAgICAgIGNvbnN0IHdvcmxkUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBjb25zdCBub2RlUG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKHdvcmxkUG9zKTtcclxuXHJcbiAgICAgICAgY29uc3QgYW5nbGVYID0gdGhpcy5yZW1hcChub2RlUG9zLngsIC10aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm5vZGUud2lkdGggLyAyLCB0aGlzLm1pbkFuZ2xlLCB0aGlzLm1heEFuZ2xlKTtcclxuICAgICAgICBjb25zdCBhbmdsZVkgPSB0aGlzLnJlbWFwKG5vZGVQb3MueSwgLXRoaXMubm9kZS5oZWlnaHQgLyAyLCB0aGlzLm5vZGUuaGVpZ2h0IC8gMiwgdGhpcy5taW5BbmdsZSwgdGhpcy5tYXhBbmdsZSk7XHJcblxyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3lfcm90JywgYW5nbGVYKTtcclxuICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd4X3JvdCcsIGFuZ2xlWSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMubm9kZSlcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyBzY2FsZTogMSB9LClcclxuICAgICAgICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIC8vIOe8k+aFouaUueWPmOadkOi0qOWxnuaApyDmlrnms5XkuIBcclxuXHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5tYXRlcmlhbFsnZWZmZWN0J10uX3Bhc3Nlc1swXS5fcHJvcGVydGllcy54X3JvdClcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyB2YWx1ZTogMCB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5tYXRlcmlhbFsnZWZmZWN0J10uX3Bhc3Nlc1swXS5fcHJvcGVydGllcy55X3JvdClcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyB2YWx1ZTogMCB9KVxyXG4gICAgICAgICAgICAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8g57yT5oWi5pS55Y+Y5p2Q6LSo5bGe5oCnIOaWueazleS6jFxyXG5cclxuICAgICAgICAvLyBjb25zdCBzdGFydEFuZ2xlWCA9IHRoaXMubWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ3hfcm90JywgMCk7XHJcbiAgICAgICAgLy8gY29uc3Qgc3RhcnRBbmdsZVkgPSB0aGlzLm1hdGVyaWFsLmdldFByb3BlcnR5KCd5X3JvdCcsIDApO1xyXG5cclxuICAgICAgICAvLyBjYy50d2Vlbih7IGFuZ2xlVmVjMjogY2MudjIoc3RhcnRBbmdsZVgsIHN0YXJ0QW5nbGVZKSB9KVxyXG4gICAgICAgIC8vIC50bygwLjIsIHsgYW5nbGVWZWMyOiBjYy5WZWMyLlpFUk99LCB7XHJcbiAgICAgICAgLy8gICAgIG9uVXBkYXRlOiAodGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd4X3JvdCcsIHRhcmdldC5hbmdsZVZlYzIueCk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm1hdGVyaWFsLnNldFByb3BlcnR5KCd5X3JvdCcsIHRhcmdldC5hbmdsZVZlYzIueSk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KVxyXG4gICAgICAgIC8vIC5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pig5bCEXHJcbiAgICAgKiBAcGFyYW0gbnVtIOW9k+WJjeWAvFxyXG4gICAgICogQHBhcmFtIHNvdXJjZU1pbiDljp/mnIDlsI/lgLxcclxuICAgICAqIEBwYXJhbSBzb3VyY2VNYXgg5Y6f5pyA5aSn5YC8XHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0TWluIOebruagh+acgOWwj+WAvFxyXG4gICAgICogQHBhcmFtIHRhcmdldE1heCDnm67moIfmnIDlpKflgLxcclxuICAgICAqIEByZXR1cm5zIOaYoOWwhOWQjueahOebruagh+WAvFxyXG4gICAgICovXHJcbiAgICByZW1hcChudW0sIHNvdXJjZU1pbiwgc291cmNlTWF4LCB0YXJnZXRNaW4gPSAwLCB0YXJnZXRNYXggPSAxKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBzb3VyY2VSYW5nZSA9IHNvdXJjZU1heCAtIHNvdXJjZU1pbjtcclxuICAgICAgICBjb25zdCB0YXJnZXRSYW5nZSA9IHRhcmdldE1heCAtIHRhcmdldE1pbjtcclxuICAgICAgICByZXR1cm4gbnVtIC8gc291cmNlUmFuZ2UgKiB0YXJnZXRSYW5nZTtcclxuICAgIH1cclxufSJdfQ==