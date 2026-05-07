const { ccclass, property } = cc._decorator;

@ccclass
export default class DissolveEffect extends cc.Component {

    @property
    dissolveInterval: number = 0.01;
    @property
    dissolveStep: number = 0.01;

    start() {
        const material = this.getComponent(cc.Sprite).getMaterial(0);

        material.setProperty('dissolveThreshold', 0);

        this.schedule(() => {

            let dissolveThreshold = material.getProperty('dissolveThreshold', 0);
            dissolveThreshold += this.dissolveStep;
            material.setProperty('dissolveThreshold', dissolveThreshold);

            // console.log(dissolveThreshold);

        }, this.dissolveInterval, 1 / this.dissolveStep);
    }
}