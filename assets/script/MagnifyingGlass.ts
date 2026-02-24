const { ccclass, property } = cc._decorator;

@ccclass
export default class MagnifyingGlass extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '放大图' })
    private picture: cc.Sprite = null;

    @property({ type: cc.Slider, tooltip: CC_DEV && '半径控制' })
    private radiusSlider: cc.Slider = null;

    onLoad() {
        this.picture.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.picture.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchStart, this);
    }
    touchStart(e: cc.Event.EventTouch) {
        const size = this.picture.node.getContentSize();
        const touch_position = e.getLocation();
        const _inSprteWorldVec2 = this.picture.node.convertToNodeSpaceAR(touch_position);
        const convert_uv_x = (_inSprteWorldVec2.x + size.width / 2) / size.width;
        const convert_uv_y = Math.abs((_inSprteWorldVec2.y - size.height / 2) / size.height);
        // console.log(convert_uv_x.toFixed(2), convert_uv_y.toFixed(2));
        this.picture.getMaterial(0).setProperty('magnifierPos', cc.v2(convert_uv_x, convert_uv_y));
    }

    //#region 事件监听
    private onRadiusSlider(silder: cc.Slider): void {
        const value = silder.progress;
        this.picture.getMaterial(0).setProperty('magnifierRadius', value);
    }
    private onScaleSlider(silder: cc.Slider): void {
        const value = silder.progress;
        this.picture.getMaterial(0).setProperty('magnifierScale', value * 2);
    }
    //#endregion 事件监听
}
