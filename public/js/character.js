/**
 * キャラクター
 */
class Character {
    /**
     * @param {Unit} ユニット
     */
    constructor(unit) {
        this.unit = unit;
        this.slot = 8;
        this.items = [];
    }

    /**
     * ベストな装備を求める
     * @param {Array<SkillItem>} items 装備スキルの配列
     * @returns {number, Array<SkillItem>} ベストな装備
     */
    equipSkill(items) {
        items = items.slice();
        const slot = this.items.reduce((sum, item) => sum + item.skill.cost, 0);
        let best = null;
        let item;
        while(item = items.shift()) {
            if(slot + item.skill.cost <= this.slot) {
                this.items.push(item);
                const value = this.getValue();
                if(!best || value > best.value) {
                    best = {
                        value: value, 
                        items: this.items.slice()
                    };
                }
                const better = this.equipSkill(items);
                this.items.pop();
                if(better) {
                    if(better.value > best.value) {
                        best = better;
                    }
                    else if(better.value < best.value - 0.001) {
                        // 足切り
                        break;
                    }
                }
            }
        }
        return best;
    }

    /**
     * 装備スキルの価値を求める
     * @returns {number} 装備スキルの価値
     */
    getValue() {
        return this.items.reduce((value, item) => value * item.value, 1);
    }
}
