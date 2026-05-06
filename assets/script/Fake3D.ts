const { ccclass, property } = cc._decorator;

@ccclass
export default class Fake3D extends cc.Component {
    @property minAngle: number = -15;
    @property maxAngle: number = 15;

    private material: cc.Material = null;

    start(): void {
        // 材质 初始化
        const sprite = this.node.getComponent(cc.Sprite);
        this.material = sprite.getMaterial(0);
        this.material.setProperty('textureSize', cc.v2(this.node.width, this.node.height));

        // 监听鼠标移动
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    onMouseEnter() {
        cc.tween(this.node)
            .to(0.1, { scale: 1.5 })
            .start();
    }

    onMouseMove(event: cc.Event.EventMouse) {
        const worldPos = event.getLocation();
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);

        const angleX = this.remap(nodePos.x, -this.node.width / 2, this.node.width / 2, this.minAngle, this.maxAngle);
        const angleY = this.remap(nodePos.y, -this.node.height / 2, this.node.height / 2, this.minAngle, this.maxAngle);

        this.material.setProperty('y_rot', angleX);
        this.material.setProperty('x_rot', angleY);
    }

    onMouseLeave() {
        cc.tween(this.node)
            .to(0.2, { scale: 1 },)
            .start();

        // 缓慢改变材质属性 方法一

        cc.tween(this.material['effect']._passes[0]._properties.x_rot)
            .to(0.2, { value: 0 })
            .start();

        cc.tween(this.material['effect']._passes[0]._properties.y_rot)
            .to(0.2, { value: 0 })
            .start();

        // 缓慢改变材质属性 方法二

        // const startAngleX = this.material.getProperty('x_rot', 0);
        // const startAngleY = this.material.getProperty('y_rot', 0);

        // cc.tween({ angleVec2: cc.v2(startAngleX, startAngleY) })
        // .to(0.2, { angleVec2: cc.Vec2.ZERO}, {
        //     onUpdate: (target) => {
        //         this.material.setProperty('x_rot', target.angleVec2.x);
        //         this.material.setProperty('y_rot', target.angleVec2.y);
        //     }
        // })
        // .start();
    }

    /**
     * 映射
     * @param num 当前值
     * @param sourceMin 原最小值
     * @param sourceMax 原最大值
     * @param targetMin 目标最小值
     * @param targetMax 目标最大值
     * @returns 映射后的目标值
     */
    remap(num, sourceMin, sourceMax, targetMin = 0, targetMax = 1): number {
        const sourceRange = sourceMax - sourceMin;
        const targetRange = targetMax - targetMin;
        return num / sourceRange * targetRange;
    }
}