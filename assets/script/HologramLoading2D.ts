const { ccclass, property } = cc._decorator;

/**
 * 驱动 hologramLoading2D 材质的 progress 属性。
 * 将脚本与使用该材质的 Sprite 挂在同一个节点即可。
 */
@ccclass
export default class HologramLoading2D extends cc.Component {

    @property({ tooltip: '自动播放一次加载动画' })
    autoPlay: boolean = true;

    @property({ tooltip: '是否循环播放' })
    loop: boolean = false;

    @property({ tooltip: '开始播放前的等待时间（秒）' })
    delay: number = 0;

    @property({ tooltip: '一次加载动画的持续时间（秒）' })
    duration: number = 1.8;

    private _sprite: cc.Sprite = null;
    private _material: cc.MaterialVariant = null;
    private _elapsed: number = 0;
    private _playing: boolean = false;

    onLoad() {
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) {
            cc.warn('[HologramLoading2D] 当前节点上没有 cc.Sprite。');
            this.enabled = false;
            return;
        }

        // getMaterial 会返回属于当前 RenderComponent 的 MaterialVariant，
        // 修改 progress 不会影响使用同一材质资源的其他 Sprite。
        this._material = this._sprite.getMaterial(0);
        if (!this._material || this._material.getProperty('progress', 0) === undefined) {
            cc.warn('[HologramLoading2D] 请先给 Sprite 指定 hologramLoading2D 材质。');
            this.enabled = false;
            return;
        }

        this.setProgress(0);
        this.refreshUVRect();

        // 动态图集通常在首帧渲染时完成插入；首帧后再读取一次最终 UV。
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.refreshUVRect, this);
    }

    start() {
        if (this.autoPlay) {
            this.play();
        }
    }

    update(dt: number) {
        if (!this._playing || !this._material) {
            return;
        }

        this._elapsed += dt;
        if (this._elapsed < Math.max(0, this.delay)) {
            return;
        }

        const safeDuration = Math.max(0.001, this.duration);
        const linearProgress = Math.min(
            1,
            (this._elapsed - Math.max(0, this.delay)) / safeDuration
        );

        // smoothstep 缓动：起止阶段更柔和，中段仍保持明确的扫描速度。
        const easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress);
        this.setProgress(easedProgress);

        if (linearProgress >= 1) {
            if (this.loop) {
                this._elapsed = 0;
                this.setProgress(0);
            } else {
                this._playing = false;
            }
        }
    }

    /** 从头播放，亦可绑定到 Button 的 Click Events。 */
    play() {
        if (!this._material) {
            return;
        }

        this._elapsed = 0;
        this._playing = true;
        this.setProgress(0);
    }

    /** 暂停在当前进度。 */
    pause() {
        this._playing = false;
    }

    /** 外部加载器也可以直接用该方法同步真实加载进度。 */
    setProgress(value: number) {
        if (!this._material) {
            return;
        }

        const clampedValue = Math.max(0, Math.min(1, value));
        this._material.setProperty('progress', clampedValue);
    }

    private refreshUVRect() {
        if (!this._sprite || !this._sprite.spriteFrame || !this._material) {
            return;
        }

        // Cocos 2.4 会在运行时把可合图的 SpriteFrame 放入动态大图集。
        // v_uv0 此时不再是 0~1，因此必须把实际图集区域传给 Shader 归一化。
        const frameUV = this._sprite.spriteFrame['uv'] as number[];
        if (!frameUV || frameUV.length < 8) {
            return;
        }

        let minU = frameUV[0];
        let maxU = frameUV[0];
        let minV = frameUV[1];
        let maxV = frameUV[1];

        for (let index = 2; index < frameUV.length; index += 2) {
            minU = Math.min(minU, frameUV[index]);
            maxU = Math.max(maxU, frameUV[index]);
            minV = Math.min(minV, frameUV[index + 1]);
            maxV = Math.max(maxV, frameUV[index + 1]);
        }

        this._material.setProperty('uvRect', new cc.Vec4(
            minU,
            minV,
            Math.max(0.000001, maxU - minU),
            Math.max(0.000001, maxV - minV)
        ));
    }

    onDestroy() {
        cc.director.targetOff(this);
    }
}
