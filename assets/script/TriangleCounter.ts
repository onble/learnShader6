const { ccclass, property } = cc._decorator;

type TriangleGL = WebGLRenderingContext & {
    drawElements: (mode: number, count: number, type: number, offset: number) => void;
    drawArrays: (mode: number, first: number, count: number) => void;
};

/**
 * Cocos Creator 2.4 WebGL triangle counter.
 *
 * Add this component to a persistent node. It counts the primitives submitted
 * through WebGL drawElements/drawArrays, so batching, Graphics, Spine and
 * MeshRenderer are included in the result.
 */
@ccclass
export default class TriangleCounter extends cc.Component {

    /** Number of triangles submitted in the most recently completed frame. */
    public static triangles = 0;

    /** Number of non-empty draw calls observed in that frame. */
    public static drawCalls = 0;

    @property({ type: cc.Label, tooltip: CC_DEV && '用于显示统计结果；不设置时仍可从静态属性读取' })
    public output: cc.Label = null;

    @property({ tooltip: CC_DEV && '界面刷新间隔，单位为秒' })
    public refreshInterval = 0.25;

    @property({ tooltip: CC_DEV && '同时显示引擎记录的 DrawCall 数量' })
    public showDrawCalls = true;

    private _gl: TriangleGL = null;
    private _originalDrawElements: (mode: number, count: number, type: number, offset: number) => void = null;
    private _originalDrawArrays: (mode: number, first: number, count: number) => void = null;
    private _wrappedDrawElements: (mode: number, count: number, type: number, offset: number) => void = null;
    private _wrappedDrawArrays: (mode: number, first: number, count: number) => void = null;
    private _frameTriangles = 0;
    private _frameDrawCalls = 0;
    private _refreshElapsed = 0;
    private _installed = false;
    private _unsupportedReason = '';

    protected onEnable() {
        this._install();
        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
    }

    protected onDisable() {
        cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._afterDraw, this);
        this._uninstall();
    }

    protected update(dt: number) {
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
            this.output.string = `Triangles: N/A\n${this._unsupportedReason || 'Waiting for WebGL...'}`;
            return;
        }

        const drawInfo = this.showDrawCalls ? `\nDraw Calls: ${TriangleCounter.drawCalls}` : '';
        this.output.string = `Triangles: ${TriangleCounter.triangles}${drawInfo}`;
    }

    private _install() {
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

        const renderer = (cc as any).renderer;
        const device = renderer && renderer.device;
        const gl = device && device._gl as TriangleGL;
        if (!gl || typeof gl.drawElements !== 'function' || typeof gl.drawArrays !== 'function') {
            return;
        }

        this._gl = gl;
        this._originalDrawElements = gl.drawElements;
        this._originalDrawArrays = gl.drawArrays;

        const self = this;
        this._wrappedDrawElements = function (mode: number, count: number, type: number, offset: number) {
            if (count > 0) {
                self._frameTriangles += self._getTriangleCount(mode, count);
                self._frameDrawCalls++;
            }
            return self._originalDrawElements.call(this, mode, count, type, offset);
        };
        this._wrappedDrawArrays = function (mode: number, first: number, count: number) {
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
    }

    private _uninstall() {
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
    }

    private _beforeDraw() {
        this._frameTriangles = 0;
        this._frameDrawCalls = 0;
    }

    private _afterDraw() {
        TriangleCounter.triangles = this._frameTriangles;
        TriangleCounter.drawCalls = this._frameDrawCalls;
    }

    private _getTriangleCount(primitiveType: number, vertexOrIndexCount: number) {
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
    }
}
