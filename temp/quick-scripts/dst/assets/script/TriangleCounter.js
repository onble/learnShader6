
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/TriangleCounter.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0b0e86m2tNNb69G1oirSlTM', 'TriangleCounter');
// script/TriangleCounter.ts

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
/**
 * Cocos Creator 2.4 WebGL triangle counter.
 *
 * Add this component to a persistent node. It counts the primitives submitted
 * through WebGL drawElements/drawArrays, so batching, Graphics, Spine and
 * MeshRenderer are included in the result.
 */
var TriangleCounter = /** @class */ (function (_super) {
    __extends(TriangleCounter, _super);
    function TriangleCounter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.output = null;
        _this.refreshInterval = 0.25;
        _this.showDrawCalls = true;
        _this._gl = null;
        _this._originalDrawElements = null;
        _this._originalDrawArrays = null;
        _this._wrappedDrawElements = null;
        _this._wrappedDrawArrays = null;
        _this._frameTriangles = 0;
        _this._frameDrawCalls = 0;
        _this._refreshElapsed = 0;
        _this._installed = false;
        _this._unsupportedReason = '';
        return _this;
    }
    TriangleCounter_1 = TriangleCounter;
    TriangleCounter.prototype.onEnable = function () {
        this._install();
        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
    };
    TriangleCounter.prototype.onDisable = function () {
        cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
        this._uninstall();
    };
    TriangleCounter.prototype.update = function (dt) {
        if (!this._installed && !this._unsupportedReason) {
            this._install();
        }
        if (!this.output) {
            return;
        }
        this._refreshElapsed += dt;
        if (this._refreshElapsed < Math.max(0.05, this.refreshInterval)) {
            return;
        }
        this._refreshElapsed = 0;
        if (!this._installed) {
            this.output.string = "Triangles: N/A\n" + (this._unsupportedReason || 'Waiting for WebGL...');
            return;
        }
        var drawInfo = this.showDrawCalls ? "\nDraw Calls: " + TriangleCounter_1.drawCalls : '';
        this.output.string = "Triangles: " + TriangleCounter_1.triangles + drawInfo;
    };
    TriangleCounter.prototype._install = function () {
        if (this._installed) {
            return;
        }
        if (CC_JSB || cc.sys.isNative) {
            this._unsupportedReason = 'Native renderer is not exposed to JavaScript';
            cc.warn('[TriangleCounter] Native preview cannot expose exact GPU triangle submissions. Please use Browser Preview.');
            return;
        }
        if (cc.game.renderType !== cc.game.RENDER_TYPE_WEBGL) {
            this._unsupportedReason = 'WebGL only';
            return;
        }
        var renderer = cc.renderer;
        var device = renderer && renderer.device;
        var gl = device && device._gl;
        if (!gl || typeof gl.drawElements !== 'function' || typeof gl.drawArrays !== 'function') {
            return;
        }
        this._gl = gl;
        this._originalDrawElements = gl.drawElements;
        this._originalDrawArrays = gl.drawArrays;
        var self = this;
        this._wrappedDrawElements = function (mode, count, type, offset) {
            if (count > 0) {
                self._frameTriangles += self._getTriangleCount(mode, count);
                self._frameDrawCalls++;
            }
            return self._originalDrawElements.call(this, mode, count, type, offset);
        };
        this._wrappedDrawArrays = function (mode, first, count) {
            if (count > 0) {
                self._frameTriangles += self._getTriangleCount(mode, count);
                self._frameDrawCalls++;
            }
            return self._originalDrawArrays.call(this, mode, first, count);
        };
        gl.drawElements = this._wrappedDrawElements;
        gl.drawArrays = this._wrappedDrawArrays;
        this._installed = true;
        this._unsupportedReason = '';
    };
    TriangleCounter.prototype._uninstall = function () {
        if (this._gl) {
            if (this._gl.drawElements === this._wrappedDrawElements) {
                this._gl.drawElements = this._originalDrawElements;
            }
            if (this._gl.drawArrays === this._wrappedDrawArrays) {
                this._gl.drawArrays = this._originalDrawArrays;
            }
        }
        this._installed = false;
        this._gl = null;
        this._originalDrawElements = null;
        this._originalDrawArrays = null;
        this._wrappedDrawElements = null;
        this._wrappedDrawArrays = null;
    };
    TriangleCounter.prototype._beforeDraw = function () {
        this._frameTriangles = 0;
        this._frameDrawCalls = 0;
    };
    TriangleCounter.prototype._afterDraw = function () {
        TriangleCounter_1.triangles = this._frameTriangles;
        TriangleCounter_1.drawCalls = this._frameDrawCalls;
    };
    TriangleCounter.prototype._getTriangleCount = function (primitiveType, vertexOrIndexCount) {
        // WebGL primitive constants: TRIANGLES=4, TRIANGLE_STRIP=5, TRIANGLE_FAN=6.
        switch (primitiveType) {
            case 4:
                return Math.floor(vertexOrIndexCount / 3);
            case 5:
            case 6:
                return Math.max(0, vertexOrIndexCount - 2);
            default:
                return 0;
        }
    };
    var TriangleCounter_1;
    /** Number of triangles submitted in the most recently completed frame. */
    TriangleCounter.triangles = 0;
    /** Number of non-empty draw calls observed in that frame. */
    TriangleCounter.drawCalls = 0;
    __decorate([
        property({ type: cc.Label, tooltip: CC_DEV && '用于显示统计结果；不设置时仍可从静态属性读取' })
    ], TriangleCounter.prototype, "output", void 0);
    __decorate([
        property({ tooltip: CC_DEV && '界面刷新间隔，单位为秒' })
    ], TriangleCounter.prototype, "refreshInterval", void 0);
    __decorate([
        property({ tooltip: CC_DEV && '同时显示引擎记录的 DrawCall 数量' })
    ], TriangleCounter.prototype, "showDrawCalls", void 0);
    TriangleCounter = TriangleCounter_1 = __decorate([
        ccclass
    ], TriangleCounter);
    return TriangleCounter;
}(cc.Component));
exports.default = TriangleCounter;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxUcmlhbmdsZUNvdW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFPNUM7Ozs7OztHQU1HO0FBRUg7SUFBNkMsbUNBQVk7SUFBekQ7UUFBQSxxRUF5SkM7UUFoSlUsWUFBTSxHQUFhLElBQUksQ0FBQztRQUd4QixxQkFBZSxHQUFHLElBQUksQ0FBQztRQUd2QixtQkFBYSxHQUFHLElBQUksQ0FBQztRQUVwQixTQUFHLEdBQWUsSUFBSSxDQUFDO1FBQ3ZCLDJCQUFxQixHQUF3RSxJQUFJLENBQUM7UUFDbEcseUJBQW1CLEdBQXlELElBQUksQ0FBQztRQUNqRiwwQkFBb0IsR0FBd0UsSUFBSSxDQUFDO1FBQ2pHLHdCQUFrQixHQUF5RCxJQUFJLENBQUM7UUFDaEYscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsZ0JBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsd0JBQWtCLEdBQUcsRUFBRSxDQUFDOztJQStIcEMsQ0FBQzt3QkF6Sm9CLGVBQWU7SUE0QnRCLGtDQUFRLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVTLG1DQUFTLEdBQW5CO1FBQ0ksRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZFLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVTLGdDQUFNLEdBQWhCLFVBQWlCLEVBQVU7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQzdELE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLHNCQUFtQixJQUFJLENBQUMsa0JBQWtCLElBQUksc0JBQXNCLENBQUUsQ0FBQztZQUM1RixPQUFPO1NBQ1Y7UUFFRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxtQkFBaUIsaUJBQWUsQ0FBQyxTQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4RixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxnQkFBYyxpQkFBZSxDQUFDLFNBQVMsR0FBRyxRQUFVLENBQUM7SUFDOUUsQ0FBQztJQUVPLGtDQUFRLEdBQWhCO1FBQ0ksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLE9BQU87U0FDVjtRQUVELElBQUksTUFBTSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyw4Q0FBOEMsQ0FBQztZQUN6RSxFQUFFLENBQUMsSUFBSSxDQUFDLDRHQUE0RyxDQUFDLENBQUM7WUFDdEgsT0FBTztTQUNWO1FBRUQsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ2xELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7WUFDdkMsT0FBTztTQUNWO1FBRUQsSUFBTSxRQUFRLEdBQUksRUFBVSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMzQyxJQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQWlCLENBQUM7UUFDOUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEtBQUssVUFBVSxJQUFJLE9BQU8sRUFBRSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7WUFDckYsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztRQUM3QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztRQUV6QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFVBQVUsSUFBWSxFQUFFLEtBQWEsRUFBRSxJQUFZLEVBQUUsTUFBYztZQUMzRixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDMUI7WUFDRCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLElBQVksRUFBRSxLQUFhLEVBQUUsS0FBYTtZQUMxRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDMUI7WUFDRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDNUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFFeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU8sb0NBQVUsR0FBbEI7UUFDSSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDckQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDO2FBQ3REO1lBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQzthQUNsRDtTQUNKO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU8scUNBQVcsR0FBbkI7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU8sb0NBQVUsR0FBbEI7UUFDSSxpQkFBZSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2pELGlCQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDckQsQ0FBQztJQUVPLDJDQUFpQixHQUF6QixVQUEwQixhQUFxQixFQUFFLGtCQUEwQjtRQUN2RSw0RUFBNEU7UUFDNUUsUUFBUSxhQUFhLEVBQUU7WUFDbkIsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5QyxLQUFLLENBQUMsQ0FBQztZQUNQLEtBQUssQ0FBQztnQkFDRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DO2dCQUNJLE9BQU8sQ0FBQyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQzs7SUF0SkQsMEVBQTBFO0lBQzVELHlCQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRTVCLDZEQUE2RDtJQUMvQyx5QkFBUyxHQUFHLENBQUMsQ0FBQztJQUc1QjtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksd0JBQXdCLEVBQUUsQ0FBQzttREFDM0M7SUFHL0I7UUFEQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLGFBQWEsRUFBRSxDQUFDOzREQUNqQjtJQUc5QjtRQURDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksdUJBQXVCLEVBQUUsQ0FBQzswREFDN0I7SUFmWCxlQUFlO1FBRG5DLE9BQU87T0FDYSxlQUFlLENBeUpuQztJQUFELHNCQUFDO0NBekpELEFBeUpDLENBeko0QyxFQUFFLENBQUMsU0FBUyxHQXlKeEQ7a0JBekpvQixlQUFlIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbnR5cGUgVHJpYW5nbGVHTCA9IFdlYkdMUmVuZGVyaW5nQ29udGV4dCAmIHtcclxuICAgIGRyYXdFbGVtZW50czogKG1vZGU6IG51bWJlciwgY291bnQ6IG51bWJlciwgdHlwZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikgPT4gdm9pZDtcclxuICAgIGRyYXdBcnJheXM6IChtb2RlOiBudW1iZXIsIGZpcnN0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpID0+IHZvaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29jb3MgQ3JlYXRvciAyLjQgV2ViR0wgdHJpYW5nbGUgY291bnRlci5cclxuICpcclxuICogQWRkIHRoaXMgY29tcG9uZW50IHRvIGEgcGVyc2lzdGVudCBub2RlLiBJdCBjb3VudHMgdGhlIHByaW1pdGl2ZXMgc3VibWl0dGVkXHJcbiAqIHRocm91Z2ggV2ViR0wgZHJhd0VsZW1lbnRzL2RyYXdBcnJheXMsIHNvIGJhdGNoaW5nLCBHcmFwaGljcywgU3BpbmUgYW5kXHJcbiAqIE1lc2hSZW5kZXJlciBhcmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdC5cclxuICovXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaWFuZ2xlQ291bnRlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqIE51bWJlciBvZiB0cmlhbmdsZXMgc3VibWl0dGVkIGluIHRoZSBtb3N0IHJlY2VudGx5IGNvbXBsZXRlZCBmcmFtZS4gKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJpYW5nbGVzID0gMDtcclxuXHJcbiAgICAvKiogTnVtYmVyIG9mIG5vbi1lbXB0eSBkcmF3IGNhbGxzIG9ic2VydmVkIGluIHRoYXQgZnJhbWUuICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRyYXdDYWxscyA9IDA7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuTGFiZWwsIHRvb2x0aXA6IENDX0RFViAmJiAn55So5LqO5pi+56S657uf6K6h57uT5p6c77yb5LiN6K6+572u5pe25LuN5Y+v5LuO6Z2Z5oCB5bGe5oCn6K+75Y+WJyB9KVxyXG4gICAgcHVibGljIG91dHB1dDogY2MuTGFiZWwgPSBudWxsO1xyXG5cclxuICAgIEBwcm9wZXJ0eSh7IHRvb2x0aXA6IENDX0RFViAmJiAn55WM6Z2i5Yi35paw6Ze06ZqU77yM5Y2V5L2N5Li656eSJyB9KVxyXG4gICAgcHVibGljIHJlZnJlc2hJbnRlcnZhbCA9IDAuMjU7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgdG9vbHRpcDogQ0NfREVWICYmICflkIzml7bmmL7npLrlvJXmk47orrDlvZXnmoQgRHJhd0NhbGwg5pWw6YePJyB9KVxyXG4gICAgcHVibGljIHNob3dEcmF3Q2FsbHMgPSB0cnVlO1xyXG5cclxuICAgIHByaXZhdGUgX2dsOiBUcmlhbmdsZUdMID0gbnVsbDtcclxuICAgIHByaXZhdGUgX29yaWdpbmFsRHJhd0VsZW1lbnRzOiAobW9kZTogbnVtYmVyLCBjb3VudDogbnVtYmVyLCB0eXBlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX29yaWdpbmFsRHJhd0FycmF5czogKG1vZGU6IG51bWJlciwgZmlyc3Q6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF93cmFwcGVkRHJhd0VsZW1lbnRzOiAobW9kZTogbnVtYmVyLCBjb3VudDogbnVtYmVyLCB0eXBlOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3dyYXBwZWREcmF3QXJyYXlzOiAobW9kZTogbnVtYmVyLCBmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2ZyYW1lVHJpYW5nbGVzID0gMDtcclxuICAgIHByaXZhdGUgX2ZyYW1lRHJhd0NhbGxzID0gMDtcclxuICAgIHByaXZhdGUgX3JlZnJlc2hFbGFwc2VkID0gMDtcclxuICAgIHByaXZhdGUgX2luc3RhbGxlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfdW5zdXBwb3J0ZWRSZWFzb24gPSAnJztcclxuXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbCgpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9iZWZvcmVEcmF3LCB0aGlzKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5vbihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCB0aGlzLl9hZnRlckRyYXcsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGUoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9iZWZvcmVEcmF3LCB0aGlzKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgdGhpcy5fYWZ0ZXJEcmF3LCB0aGlzKTtcclxuICAgICAgICB0aGlzLl91bmluc3RhbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2luc3RhbGxlZCAmJiAhdGhpcy5fdW5zdXBwb3J0ZWRSZWFzb24pIHtcclxuICAgICAgICAgICAgdGhpcy5faW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm91dHB1dCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZWZyZXNoRWxhcHNlZCArPSBkdDtcclxuICAgICAgICBpZiAodGhpcy5fcmVmcmVzaEVsYXBzZWQgPCBNYXRoLm1heCgwLjA1LCB0aGlzLnJlZnJlc2hJbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVmcmVzaEVsYXBzZWQgPSAwO1xyXG4gICAgICAgIGlmICghdGhpcy5faW5zdGFsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LnN0cmluZyA9IGBUcmlhbmdsZXM6IE4vQVxcbiR7dGhpcy5fdW5zdXBwb3J0ZWRSZWFzb24gfHwgJ1dhaXRpbmcgZm9yIFdlYkdMLi4uJ31gO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkcmF3SW5mbyA9IHRoaXMuc2hvd0RyYXdDYWxscyA/IGBcXG5EcmF3IENhbGxzOiAke1RyaWFuZ2xlQ291bnRlci5kcmF3Q2FsbHN9YCA6ICcnO1xyXG4gICAgICAgIHRoaXMub3V0cHV0LnN0cmluZyA9IGBUcmlhbmdsZXM6ICR7VHJpYW5nbGVDb3VudGVyLnRyaWFuZ2xlc30ke2RyYXdJbmZvfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5zdGFsbCgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5zdGFsbGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChDQ19KU0IgfHwgY2Muc3lzLmlzTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJ05hdGl2ZSByZW5kZXJlciBpcyBub3QgZXhwb3NlZCB0byBKYXZhU2NyaXB0JztcclxuICAgICAgICAgICAgY2Mud2FybignW1RyaWFuZ2xlQ291bnRlcl0gTmF0aXZlIHByZXZpZXcgY2Fubm90IGV4cG9zZSBleGFjdCBHUFUgdHJpYW5nbGUgc3VibWlzc2lvbnMuIFBsZWFzZSB1c2UgQnJvd3NlciBQcmV2aWV3LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlICE9PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJ1dlYkdMIG9ubHknO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IChjYyBhcyBhbnkpLnJlbmRlcmVyO1xyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHJlbmRlcmVyICYmIHJlbmRlcmVyLmRldmljZTtcclxuICAgICAgICBjb25zdCBnbCA9IGRldmljZSAmJiBkZXZpY2UuX2dsIGFzIFRyaWFuZ2xlR0w7XHJcbiAgICAgICAgaWYgKCFnbCB8fCB0eXBlb2YgZ2wuZHJhd0VsZW1lbnRzICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBnbC5kcmF3QXJyYXlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dsID0gZ2w7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3RWxlbWVudHMgPSBnbC5kcmF3RWxlbWVudHM7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3QXJyYXlzID0gZ2wuZHJhd0FycmF5cztcclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fd3JhcHBlZERyYXdFbGVtZW50cyA9IGZ1bmN0aW9uIChtb2RlOiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHR5cGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVUcmlhbmdsZXMgKz0gc2VsZi5fZ2V0VHJpYW5nbGVDb3VudChtb2RlLCBjb3VudCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLl9mcmFtZURyYXdDYWxscysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9vcmlnaW5hbERyYXdFbGVtZW50cy5jYWxsKHRoaXMsIG1vZGUsIGNvdW50LCB0eXBlLCBvZmZzZXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fd3JhcHBlZERyYXdBcnJheXMgPSBmdW5jdGlvbiAobW9kZTogbnVtYmVyLCBmaXJzdDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2ZyYW1lVHJpYW5nbGVzICs9IHNlbGYuX2dldFRyaWFuZ2xlQ291bnQobW9kZSwgY291bnQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVEcmF3Q2FsbHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fb3JpZ2luYWxEcmF3QXJyYXlzLmNhbGwodGhpcywgbW9kZSwgZmlyc3QsIGNvdW50KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyA9IHRoaXMuX3dyYXBwZWREcmF3RWxlbWVudHM7XHJcbiAgICAgICAgZ2wuZHJhd0FycmF5cyA9IHRoaXMuX3dyYXBwZWREcmF3QXJyYXlzO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnN0YWxsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3Vuc3VwcG9ydGVkUmVhc29uID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdW5pbnN0YWxsKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9nbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2wuZHJhd0VsZW1lbnRzID09PSB0aGlzLl93cmFwcGVkRHJhd0VsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nbC5kcmF3RWxlbWVudHMgPSB0aGlzLl9vcmlnaW5hbERyYXdFbGVtZW50cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2wuZHJhd0FycmF5cyA9PT0gdGhpcy5fd3JhcHBlZERyYXdBcnJheXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dsLmRyYXdBcnJheXMgPSB0aGlzLl9vcmlnaW5hbERyYXdBcnJheXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2luc3RhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2dsID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vcmlnaW5hbERyYXdFbGVtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEcmF3QXJyYXlzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkRHJhd0VsZW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkRHJhd0FycmF5cyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYmVmb3JlRHJhdygpIHtcclxuICAgICAgICB0aGlzLl9mcmFtZVRyaWFuZ2xlcyA9IDA7XHJcbiAgICAgICAgdGhpcy5fZnJhbWVEcmF3Q2FsbHMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FmdGVyRHJhdygpIHtcclxuICAgICAgICBUcmlhbmdsZUNvdW50ZXIudHJpYW5nbGVzID0gdGhpcy5fZnJhbWVUcmlhbmdsZXM7XHJcbiAgICAgICAgVHJpYW5nbGVDb3VudGVyLmRyYXdDYWxscyA9IHRoaXMuX2ZyYW1lRHJhd0NhbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFRyaWFuZ2xlQ291bnQocHJpbWl0aXZlVHlwZTogbnVtYmVyLCB2ZXJ0ZXhPckluZGV4Q291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFdlYkdMIHByaW1pdGl2ZSBjb25zdGFudHM6IFRSSUFOR0xFUz00LCBUUklBTkdMRV9TVFJJUD01LCBUUklBTkdMRV9GQU49Ni5cclxuICAgICAgICBzd2l0Y2ggKHByaW1pdGl2ZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmVydGV4T3JJbmRleENvdW50IC8gMyk7XHJcbiAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIHZlcnRleE9ySW5kZXhDb3VudCAtIDIpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==