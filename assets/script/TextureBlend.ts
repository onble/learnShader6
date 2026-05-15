/**
 * 将两张 cc.Texture2D（含 cc.RenderTexture）按「上层盖在下层上」做 Alpha 合成，
 * 得到一张新的 cc.RenderTexture（同样继承 Texture2D，可当普通贴图用）。
 *
 * 实现：离屏 Camera + 两个 Sprite（底 / 顶），一次渲染写入目标 RT。
 * 注意：若贴图参与动态合图，请先对资源设 packable=false 或使用独立整图，避免 UV 错位。
 */

export interface BlendTwoTexturesOptions {
    /** 输出宽度；默认 max(底宽, 顶宽) */
    width?: number;
    /** 输出高度；默认 max(底高, 顶高) */
    height?: number;
}

/**
 * @param bottom 底层纹理
 * @param top 上层纹理（按 Sprite 默认混合：支持半透明叠在底层上）
 * @param opts 可选输出尺寸；若小于某张输入，会按比例拉伸铺满输出区域
 * @returns 新的 RenderTexture；失败时返回 null（参数非法或引擎未就绪）
 */
export function blendTwoTexturesToRenderTexture(
    bottom: cc.Texture2D,
    top: cc.Texture2D,
    opts?: BlendTwoTexturesOptions
): cc.RenderTexture | null {
    if (!bottom || !top || !bottom.width || !bottom.height || !top.width || !top.height) {
        return null;
    }

    const w = Math.max(1, Math.floor(opts?.width ?? Math.max(bottom.width, top.width)));
    const h = Math.max(1, Math.floor(opts?.height ?? Math.max(bottom.height, top.height)));

    const out = new cc.RenderTexture();
    out.initWithSize(w, h);

    const scene = cc.director.getScene();
    if (!scene) return null;

    const root = new cc.Node('_BlendTexRoot');
    root.parent = scene;
    root.setPosition(10000, 10000);
    root.group = 'default';

    const camNode = new cc.Node('_BlendTexCam');
    camNode.parent = scene;
    camNode.setPosition(10000, 10000);
    camNode.group = root.group;

    const cam = camNode.addComponent(cc.Camera);
    cam.enabled = false;
    cam.clearFlags = cc.Camera.ClearFlags.COLOR as any;
    cam.backgroundColor = new cc.Color(0, 0, 0, 0);
    cam.alignWithScreen = false;
    cam.ortho = true;
    cam.nearClip = -1024;
    cam.farClip = 1024;
    cam.orthoSize = h / 2;
    cam.zoomRatio = 1;
    cam.cullingMask = 1 << root.groupIndex;

    const addLayer = (tex: cc.Texture2D, z: number) => {
        const n = new cc.Node();
        n.parent = root;
        n.group = root.group;
        n.zIndex = z;
        n.setContentSize(w, h);
        n.setPosition(0, 0);
        n.anchorX = 0.5;
        n.anchorY = 0.5;
        const sp = n.addComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        const sf = new cc.SpriteFrame();
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

/**
 * 与 {@link blendTwoTexturesToRenderTexture} 相同，仅返回类型写为 Texture2D 便于接属性类型。
 */
export function blendTwoTexturesToTexture2D(
    bottom: cc.Texture2D,
    top: cc.Texture2D,
    opts?: BlendTwoTexturesOptions
): cc.Texture2D | null {
    return blendTwoTexturesToRenderTexture(bottom, top, opts);
}
