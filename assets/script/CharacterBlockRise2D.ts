const { ccclass, property } = cc._decorator;

/**
 * 驱动角色背后的程序化上升方块特效。
 * 将脚本与使用 characterBlockRise2D 材质的 Sprite 挂在同一个节点即可。
 */
@ccclass
export default class CharacterBlockRise2D extends cc.Component {

    @property({ tooltip: '进入场景后自动播放' })
    autoPlay: boolean = true;

    @property({ tooltip: '整体播放速度倍率' })
    playbackSpeed: number = 1.0;

    @property({ tooltip: '单次循环时长（秒）' })
    cycleDuration: number = 1.0;

    @property({ tooltip: '完成单次循环后是否继续播放' })
    loopAnimation: boolean = true;

    @property({ tooltip: '初始时间偏移；多个实例可填不同值以避免完全同步' })
    startOffset: number = 0;

    private _sprite: cc.Sprite = null;
    private _material: cc.MaterialVariant = null;
    // 传给 Shader 的是 0~1 的归一化循环时间，便于制作无缝的一秒动画。
    private _time: number = 0;
    // 宽度呼吸不跟随一秒循环重置，避免快速上升的碎片出现拍动感。
    private _widthTime: number = 0;
    private _playing: boolean = false;

    onLoad() {
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) {
            cc.warn('[CharacterBlockRise2D] 当前节点上没有 cc.Sprite。');
            this.enabled = false;
            return;
        }

        // 每个 Sprite 都持有独立 MaterialVariant，避免多个角色共享时间属性。
        this._material = this._sprite.getMaterial(0);
        if (!this._material || this._material.getProperty('time', 0) === undefined) {
            cc.warn('[CharacterBlockRise2D] 请先给 Sprite 指定 characterBlockRise2D 材质。');
            this.enabled = false;
            return;
        }

        this._time = this.toCycleTime(this.startOffset);
        this._widthTime = Math.max(0, this.startOffset);
        this.applyTime();
        this.refreshLayout();

        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshLayout, this);
        // 动态图集通常在首帧绘制时完成插入，因此首帧后再读取一次最终 UV。
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this.refreshLayout, this);
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

        this._time += dt * Math.max(0, this.playbackSpeed) / this.safeCycleDuration();
        this._widthTime += dt * Math.max(0, this.playbackSpeed);
        if (this._widthTime > 4096) {
            this._widthTime %= 4096;
        }
        if (this._time >= 1.0) {
            if (this.loopAnimation) {
                this._time %= 1.0;
            } else {
                this._time = 0.0;
                this._playing = false;
            }
        }
        this.applyTime();
    }

    /** 继续播放，亦可绑定到 Button 的 Click Events。 */
    play() {
        if (this._material) {
            this._playing = true;
        }
    }

    /** 暂停在当前画面。 */
    pause() {
        this._playing = false;
    }

    /** 回到 startOffset 并开始播放；角色切换时可调用此方法。 */
    restart() {
        if (!this._material) {
            return;
        }

        this._time = this.toCycleTime(this.startOffset);
        this._widthTime = Math.max(0, this.startOffset);
        this.applyTime();
        this._playing = true;
    }

    /** 外部逻辑可以按秒同步时间，例如技能时间轴。 */
    setTime(value: number) {
        if (!this._material) {
            return;
        }

        this._time = this.toCycleTime(value);
        this._widthTime = Math.max(0, value);
        this.applyTime();
    }

    private applyTime() {
        if (this._material) {
            this._material.setProperty('time', this._time);
            this._material.setProperty('widthTime', this._widthTime);
        }
    }

    private safeCycleDuration(): number {
        return Math.max(0.01, this.cycleDuration);
    }

    private toCycleTime(timeInSeconds: number): number {
        const cycleTime = Math.max(0, timeInSeconds) / this.safeCycleDuration();
        return this.loopAnimation ? cycleTime % 1.0 : Math.min(cycleTime, 1.0);
    }

    private refreshLayout() {
        if (!this._sprite || !this._sprite.spriteFrame || !this._material) {
            return;
        }

        const safeHeight = Math.max(0.000001, Math.abs(this.node.height));
        this._material.setProperty(
            'aspectRatio',
            Math.abs(this.node.width) / safeHeight
        );

        // Cocos 2.4 动态合图后 v_uv0 不再是 0~1，需要传入真实图集区域。
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
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.refreshLayout, this);
        cc.director.targetOff(this);
    }
}
