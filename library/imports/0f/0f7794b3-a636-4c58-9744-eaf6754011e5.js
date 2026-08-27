"use strict";
cc._RF.push(module, '0f779SzpjZMWJdE6vZ1QBHl', 'SpineRunner');
// script/SpineRunner.ts

// 编辑器模式下运行spine
if (CC_EDITOR) {
    // 重写update方法 达到在编辑模式下 自动播放动画的功能
    sp.Skeleton.prototype['update'] = function (dt) {
        if (CC_EDITOR) {
            cc['engine']._animatingInEditMode = 1;
            cc['engine'].animatingInEditMode = 1;
        }
        if (this.paused) {
            return;
        }
        dt *= this.timeScale * sp['timeScale'];
        if (!this.isAnimationCached()) {
            this._updateRealtime(dt);
            return;
        }
        if (this._isAniComplete) {
            if (this._animationQueue.length === 0 && !this._headAniInfo) {
                var frameCache = this._frameCache;
                if (frameCache && frameCache.isInvalid()) {
                    frameCache.updateToFrame();
                    var frames = frameCache.frames;
                    this._curFrame = frames[frames.length - 1];
                }
                return;
            }
            if (!this._headAniInfo) {
                this._headAniInfo = this._animationQueue.shift();
            }
            this._accTime += dt;
            if (this._accTime > this._headAniInfo.delay) {
                var aniInfo = this._headAniInfo;
                this._headAniInfo = null;
                this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
            }
            return;
        }
        this._updateCache(dt);
    };
}

cc._RF.pop();