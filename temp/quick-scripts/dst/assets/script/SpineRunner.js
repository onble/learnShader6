
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/SpineRunner.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0XFxTcGluZVJ1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZ0I7QUFDaEIsSUFBSSxTQUFTLEVBQUU7SUFDWCxnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxFQUFFO1FBQzFDLElBQUksU0FBUyxFQUFFO1lBQ1gsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQzVCLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUd2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QixPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN6RCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNsQyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQ3RDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDOUM7Z0JBQ0QsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNwRDtZQUNELElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtnQkFDekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUM7Q0FDTCIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIOe8lui+keWZqOaooeW8j+S4i+i/kOihjHNwaW5lXHJcbmlmIChDQ19FRElUT1IpIHtcclxuICAgIC8vIOmHjeWGmXVwZGF0ZeaWueazlSDovr7liLDlnKjnvJbovpHmqKHlvI/kuIsg6Ieq5Yqo5pKt5pS+5Yqo55S755qE5Yqf6IO9XHJcbiAgICBzcC5Ta2VsZXRvbi5wcm90b3R5cGVbJ3VwZGF0ZSddID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xyXG4gICAgICAgICAgICBjY1snZW5naW5lJ10uX2FuaW1hdGluZ0luRWRpdE1vZGUgPSAxO1xyXG4gICAgICAgICAgICBjY1snZW5naW5lJ10uYW5pbWF0aW5nSW5FZGl0TW9kZSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgZHQgKj0gdGhpcy50aW1lU2NhbGUgKiBzcFsndGltZVNjYWxlJ107XHJcblxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSZWFsdGltZShkdCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0FuaUNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbmltYXRpb25RdWV1ZS5sZW5ndGggPT09IDAgJiYgIXRoaXMuX2hlYWRBbmlJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJhbWVDYWNoZSA9IHRoaXMuX2ZyYW1lQ2FjaGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWVDYWNoZSAmJiBmcmFtZUNhY2hlLmlzSW52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lcyA9IGZyYW1lQ2FjaGUuZnJhbWVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRBbmlJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkQW5pSW5mbyA9IHRoaXMuX2FuaW1hdGlvblF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSArPSBkdDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPiB0aGlzLl9oZWFkQW5pSW5mby5kZWxheSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuaUluZm8gPSB0aGlzLl9oZWFkQW5pSW5mbztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRBbmlJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIGFuaUluZm8uYW5pbWF0aW9uTmFtZSwgYW5pSW5mby5sb29wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVDYWNoZShkdCk7XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==