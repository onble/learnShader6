const { ccclass, property } = cc._decorator;
// 参考:https://forum.cocos.org/t/topic/169788/2

@ccclass
export class SpineCtrl extends cc.Component {

    @property(sp.Skeleton) targetSpine: sp.Skeleton = null;

    private spine: sp.Skeleton = null;

    protected start(): void {
        this.spine = this.node.getComponent(sp.Skeleton);
    }

    /** 从指定时间开始播放Spine动画 */
    public playSpineFromTime(spine: sp.Skeleton, animName: string, loop: boolean, time: number): void {
        const trackEntry = spine.setAnimation(0, animName, loop);
        const duration = trackEntry.animation.duration;
        // 限制播放时间范围
        time = time % duration;
        // 设置Spine动画开始时间
        trackEntry.trackTime = time;
    }

    onBtn() {
        const FrameRate = 60;
        const SecondsPerFrame = 1 / FrameRate;

        const time = this.getSpineCurrentTime(this.targetSpine);

        // 在下一帧同步
        this.playSpineFromTime(this.spine, "jump", true, time + SecondsPerFrame);
        this.playSpineFromTime(this.targetSpine, "jump", true, time + SecondsPerFrame);
    }

    private onClickButtonTest(): void {
        const time = this.getSpineCurrentTime(this.targetSpine);
        console.log("time", time);
    }

    /**
     * 获取 Spine 动画当前播放时间
     * @param {sp.Skeleton} spine - Spine 骨骼实例
     * @returns {number} 当前动画的播放时间（秒）
     */
    private getSpineCurrentTime(spine: sp.Skeleton): number {
        return spine.getCurrent(0).animationTime
    }
}