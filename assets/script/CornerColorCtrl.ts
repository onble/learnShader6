const {ccclass, property} = cc._decorator;
// 参考:https://forum.cocos.org/t/topic/159733

@ccclass
export default class CornerColorCtrl extends cc.Component {

    @property(cc.Color)
    leftBottom: cc.Color = cc.Color.WHITE;
    @property(cc.Color)
    rightBottom: cc.Color = cc.Color.WHITE;
    @property(cc.Color)
    leftTop: cc.Color = cc.Color.WHITE;
    @property(cc.Color)
    rightTop: cc.Color = cc.Color.WHITE;

    start () {
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, ()=>{
            this.renderColor();
        }, this);
    }

    renderColor() {
        // 获取 renderComponent 
        const renderComponent = this.node.getComponent(cc.RenderComponent);

        const assembler = renderComponent['_assembler'];
        const renderData = assembler['_renderData'];
        const uintVDatas = renderData['uintVDatas'][0];

        uintVDatas[4] = this.leftBottom['_val'];
        uintVDatas[9] = this.rightBottom['_val'];
        uintVDatas[14] = this.leftTop['_val'];
        uintVDatas[19] = this.rightTop['_val'];
    }
}