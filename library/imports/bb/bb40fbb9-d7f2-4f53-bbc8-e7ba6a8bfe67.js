"use strict";
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