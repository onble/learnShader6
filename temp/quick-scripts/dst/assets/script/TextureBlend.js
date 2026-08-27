
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/TextureBlend.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'bb40fu51/JPU7vI57pqi/5n', 'TextureBlend');
// script/TextureBlend.ts

"use strict";
/**
 * 将两张 cc.Texture2D（含 cc.RenderTexture）按「上层盖在下层上」做 Alpha 合成，
 * 得到一张新的 cc.RenderTexture（同样继承 Texture2D，可当普通贴图用）。
 *
 * 实现：离屏 Camera + 两个 Sprite（底 / 顶），一次渲染写入目标 RT。
 * 注意：若贴图参与动态合图，请先对资源设 packable=false 或使用独立整图，避免 UV 错位。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.blendTwoTexturesToTexture2D = exports.blendTwoTexturesToRenderTexture = void 0;
/**
 * @param bottom 底层纹理
 * @param top 上层纹理（按 Sprite 默认混合：支持半透明叠在底层上）
 * @param opts 可选输出尺寸；若小于某张输入，会按比例拉伸铺满输出区域
 * @returns 新的 RenderTexture；失败时返回 null（参数非法或引擎未就绪）
 */
function blendTwoTexturesToRenderTexture(bottom, top, opts) {
    var _a, _b;
    if (!bottom || !top || !bottom.width || !bottom.height || !top.width || !top.height) {
        return null;
    }
    var w = Math.max(1, Math.floor((_a = opts === null || opts === void 0 ? void 0 : opts.width) !== null && _a !== void 0 ? _a : Math.max(bottom.width, top.width)));
    var h = Math.max(1, Math.floor((_b = opts === null || opts === void 0 ? void 0 : opts.height) !== null && _b !== void 0 ? _b : Math.max(bottom.height, top.height)));
    var out = new cc.RenderTexture();
    out.initWithSize(w, h);
    var scene = cc.director.getScene();
    if (!scene)
        return null;
    var root = new cc.Node('_BlendTexRoot');
    root.parent = scene;
    root.setPosition(10000, 10000);
    root.group = 'default';
    var camNode = new cc.Node('_BlendTexCam');
    camNode.parent = scene;
    camNode.setPosition(10000, 10000);
    camNode.group = root.group;
    var cam = camNode.addComponent(cc.Camera);
    cam.enabled = false;
    cam.clearFlags = cc.Camera.ClearFlags.COLOR;
    cam.backgroundColor = new cc.Color(0, 0, 0, 0);
    cam.alignWithScreen = false;
    cam.ortho = true;
    cam.nearClip = -1024;
    cam.farClip = 1024;
    cam.orthoSize = h / 2;
    cam.zoomRatio = 1;
    cam.cullingMask = 1 << root.groupIndex;
    var addLayer = function (tex, z) {
        var n = new cc.Node();
        n.parent = root;
        n.group = root.group;
        n.zIndex = z;
        n.setContentSize(w, h);
        n.setPosition(0, 0);
        n.anchorX = 0.5;
        n.anchorY = 0.5;
        var sp = n.addComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var sf = new cc.SpriteFrame();
        sf.setTexture(tex, new cc.Rect(0, 0, tex.width, tex.height));
        sp.spriteFrame = sf;
    };
    addLayer(bottom, 0);
    addLayer(top, 1);
    cam.targetTexture = out;
    cam.render(root);
    cam.targetTexture = null;
    root.destroy();
    camNode.destroy();
    return out;
}
exports.blendTwoTexturesToRenderTexture = blendTwoTexturesToRenderTexture;
/**
 * 与 {@link blendTwoTexturesToRenderTexture} 相同，仅返回类型写为 Texture2D 便于接属性类型。
 */
function blendTwoTexturesToTexture2D(bottom, top, opts) {
    return blendTwoTexturesToRenderTexture(bottom, top, opts);
}
exports.blendTwoTexturesToTexture2D = blendTwoTexturesToTexture2D;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxUZXh0dXJlQmxlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRzs7O0FBU0g7Ozs7O0dBS0c7QUFDSCxTQUFnQiwrQkFBK0IsQ0FDM0MsTUFBb0IsRUFDcEIsR0FBaUIsRUFDakIsSUFBOEI7O0lBRTlCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2pGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxPQUFDLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLE9BQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsSUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbkMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkIsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQyxJQUFJLENBQUMs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LGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUV6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFbEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBbkVELDBFQW1FQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsMkJBQTJCLENBQ3ZDLE1BQW9CLEVBQ3BCLEdBQWlCLEVBQ2pCLElBQThCO0lBRTlCLE9BQU8sK0JBQStCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBTkQsa0VBTUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5bCG5Lik5bygIGNjLlRleHR1cmUyRO+8iOWQqyBjYy5SZW5kZXJUZXh0dXJl77yJ5oyJ44CM5LiK5bGC55uW5Zyo5LiL5bGC5LiK44CN5YGaIEFscGhhIOWQiOaIkO+8jFxyXG4gKiDlvpfliLDkuIDlvKDmlrDnmoQgY2MuUmVuZGVyVGV4dHVyZe+8iOWQjOagt+e7p+aJvyBUZXh0dXJlMkTvvIzlj6/lvZPmma7pgJrotLTlm77nlKjvvInjgIJcclxuICpcclxuICog5a6e546w77ya56a75bGPIENhbWVyYSArIOS4pOS4qiBTcHJpdGXvvIjlupUgLyDpobbvvInvvIzkuIDmrKHmuLLmn5PlhpnlhaXnm67moIcgUlTjgIJcclxuICog5rOo5oSP77ya6Iul6LS05Zu+5Y+C5LiO5Yqo5oCB5ZCI5Zu+77yM6K+35YWI5a+56LWE5rqQ6K6+IHBhY2thYmxlPWZhbHNlIOaIluS9v+eUqOeLrOeri+aVtOWbvu+8jOmBv+WFjSBVViDplJnkvY3jgIJcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJsZW5kVHdvVGV4dHVyZXNPcHRpb25zIHtcclxuICAgIC8qKiDovpPlh7rlrr3luqbvvJvpu5jorqQgbWF4KOW6leWuvSwg6aG25a69KSAqL1xyXG4gICAgd2lkdGg/OiBudW1iZXI7XHJcbiAgICAvKiog6L6T5Ye66auY5bqm77yb6buY6K6kIG1heCjlupXpq5gsIOmhtumrmCkgKi9cclxuICAgIGhlaWdodD86IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBib3R0b20g5bqV5bGC57q555CGXHJcbiAqIEBwYXJhbSB0b3Ag5LiK5bGC57q555CG77yI5oyJIFNwcml0ZSDpu5jorqTmt7flkIjvvJrmlK/mjIHljYrpgI/mmI7lj6DlnKjlupXlsYLkuIrvvIlcclxuICogQHBhcmFtIG9wdHMg5Y+v6YCJ6L6T5Ye65bC65a+477yb6Iul5bCP5LqO5p+Q5byg6L6T5YWl77yM5Lya5oyJ5q+U5L6L5ouJ5Ly46ZO65ruh6L6T5Ye65Yy65Z+fXHJcbiAqIEByZXR1cm5zIOaWsOeahCBSZW5kZXJUZXh0dXJl77yb5aSx6LSl5pe26L+U5ZueIG51bGzvvIjlj4LmlbDpnZ7ms5XmiJblvJXmk47mnKrlsLHnu6rvvIlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBibGVuZFR3b1RleHR1cmVzVG9SZW5kZXJUZXh0dXJlKFxyXG4gICAgYm90dG9tOiBjYy5UZXh0dXJlMkQsXHJcbiAgICB0b3A6IGNjLlRleHR1cmUyRCxcclxuICAgIG9wdHM/OiBCbGVuZFR3b1RleHR1cmVzT3B0aW9uc1xyXG4pOiBjYy5SZW5kZXJUZXh0dXJlIHwgbnVsbCB7XHJcbiAgICBpZiAoIWJvdHRvbSB8fCAhdG9wIHx8ICFib3R0b20ud2lkdGggfHwgIWJvdHRvbS5oZWlnaHQgfHwgIXRvcC53aWR0aCB8fCAhdG9wLmhlaWdodCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKG9wdHM/LndpZHRoID8/IE1hdGgubWF4KGJvdHRvbS53aWR0aCwgdG9wLndpZHRoKSkpO1xyXG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3Iob3B0cz8uaGVpZ2h0ID8/IE1hdGgubWF4KGJvdHRvbS5oZWlnaHQsIHRvcC5oZWlnaHQpKSk7XHJcblxyXG4gICAgY29uc3Qgb3V0ID0gbmV3IGNjLlJlbmRlclRleHR1cmUoKTtcclxuICAgIG91dC5pbml0V2l0aFNpemUodywgaCk7XHJcblxyXG4gICAgY29uc3Qgc2NlbmUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpO1xyXG4gICAgaWYgKCFzY2VuZSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBjYy5Ob2RlKCdfQmxlbmRUZXhSb290Jyk7XHJcbiAgICByb290LnBhcmVudCA9IHNjZW5lO1xyXG4gICAgcm9vdC5zZXRQb3NpdGlvbigxMDAwMCwgMTAwMDApO1xyXG4gICAgcm9vdC5ncm91cCA9ICdkZWZhdWx0JztcclxuXHJcbiAgICBjb25zdCBjYW1Ob2RlID0gbmV3IGNjLk5vZGUoJ19CbGVuZFRleENhbScpO1xyXG4gICAgY2FtTm9kZS5wYXJlbnQgPSBzY2VuZTtcclxuICAgIGNhbU5vZGUuc2V0UG9zaXRpb24oMTAwMDAsIDEwMDAwKTtcclxuICAgIGNhbU5vZGUuZ3JvdXAgPSByb290Lmdyb3VwO1xyXG5cclxuICAgIGNvbnN0IGNhbSA9IGNhbU5vZGUuYWRkQ29tcG9uZW50KGNjLkNhbWVyYSk7XHJcbiAgICBjYW0uZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY2FtLmNsZWFyRmxhZ3MgPSBjYy5DYW1lcmEuQ2xlYXJGbGFncy5DT0xPUiBhcyBhbnk7XHJcbiAgICBjYW0uYmFja2dyb3VuZENvbG9yID0gbmV3IGNjLkNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgY2FtLmFsaWduV2l0aFNjcmVlbiA9IGZhbHNlO1xyXG4gICAgY2FtLm9ydGhvID0gdHJ1ZTtcclxuICAgIGNhbS5uZWFyQ2xpcCA9IC0xMDI0O1xyXG4gICAgY2FtLmZhckNsaXAgPSAxMDI0O1xyXG4gICAgY2FtLm9ydGhvU2l6ZSA9IGggLyAyO1xyXG4gICAgY2FtLnpvb21SYXRpbyA9IDE7XHJcbiAgICBjYW0uY3VsbGluZ01hc2sgPSAxIDw8IHJvb3QuZ3JvdXBJbmRleDtcclxuXHJcbiAgICBjb25zdCBhZGRMYXllciA9ICh0ZXg6IGNjLlRleHR1cmUyRCwgejogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbiA9IG5ldyBjYy5Ob2RlKCk7XHJcbiAgICAgICAgbi5wYXJlbnQgPSByb290O1xyXG4gICAgICAgIG4uZ3JvdXAgPSByb290Lmdyb3VwO1xyXG4gICAgICAgIG4uekluZGV4ID0gejtcclxuICAgICAgICBuLnNldENvbnRlbnRTaXplKHcsIGgpO1xyXG4gICAgICAgIG4uc2V0UG9zaXRpb24oMCwgMCk7XHJcbiAgICAgICAgbi5hbmNob3JYID0gMC41O1xyXG4gICAgICAgIG4uYW5jaG9yWSA9IDAuNTtcclxuICAgICAgICBjb25zdCBzcCA9IG4uYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XHJcbiAgICAgICAgc3Auc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuQ1VTVE9NO1xyXG4gICAgICAgIGNvbnN0IHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKCk7XHJcbiAgICAgICAgc2Yuc2V0VGV4dHVyZSh0ZXgsIG5ldyBjYy5SZWN0KDAsIDAsIHRleC53aWR0aCwgdGV4LmhlaWdodCkpO1xyXG4gICAgICAgIHNwLnNwcml0ZUZyYW1lID0gc2Y7XHJcbiAgICB9O1xyXG5cclxuICAgIGFkZExheWVyKGJvdHRvbSwgMCk7XHJcbiAgICBhZGRMYXllcih0b3AsIDEpO1xyXG5cclxuICAgIGNhbS50YXJnZXRUZXh0dXJlID0gb3V0O1xyXG4gICAgY2FtLnJlbmRlcihyb290KTtcclxuICAgIGNhbS50YXJnZXRUZXh0dXJlID0gbnVsbDtcclxuXHJcbiAgICByb290LmRlc3Ryb3koKTtcclxuICAgIGNhbU5vZGUuZGVzdHJveSgpO1xyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuI4ge0BsaW5rIGJsZW5kVHdvVGV4dHVyZXNUb1JlbmRlclRleHR1cmV9IOebuOWQjO+8jOS7hei/lOWbnuexu+Wei+WGmeS4uiBUZXh0dXJlMkQg5L6/5LqO5o6l5bGe5oCn57G75Z6L44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYmxlbmRUd29UZXh0dXJlc1RvVGV4dHVyZTJEKFxyXG4gICAgYm90dG9tOiBjYy5UZXh0dXJlMkQsXHJcbiAgICB0b3A6IGNjLlRleHR1cmUyRCxcclxuICAgIG9wdHM/OiBCbGVuZFR3b1RleHR1cmVzT3B0aW9uc1xyXG4pOiBjYy5UZXh0dXJlMkQgfCBudWxsIHtcclxuICAgIHJldHVybiBibGVuZFR3b1RleHR1cmVzVG9SZW5kZXJUZXh0dXJlKGJvdHRvbSwgdG9wLCBvcHRzKTtcclxufVxyXG4iXX0=