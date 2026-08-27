"use strict";
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