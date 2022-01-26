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
        this.value = 1;
        this.tr = null;
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

    /**
     */
    toHtml() {
        this.tr = document.createElement("tr");
        {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.value = this.slot;
            input.min = 1;
            input.max = 8;
            td.append(input);
            this.tr.append(td);
        }
        this.update();
        return this.tr;
    }

    /**
     */
    update() {
        const elements = [ this.tr.firstChild ];
        let cost = 0;
        for(let item of this.items) {
            let td = document.createElement("td");
            td.setAttribute("class", item.skill.getClass());
            if(item.skill.cost > 1) {
                td.setAttribute("colSpan", item.skill.cost);
            }
            td.append(document.createTextNode(item.skill.toIndex()));
            elements.push(td);
            cost += item.skill.cost;
        }
        for(let i = cost; i < SLOT_MAX; i++) {
            let td = document.createElement("td");
            if(i >= this.slot) {
                td.setAttribute("class", "invalidSlot");
            }
            elements.push(td);
        }
        {
            let td = document.createElement("td");
            td.append(document.createTextNode(this.value.toFixed(3)));
            elements.push(td);
        }
        this.tr.replaceChildren(...elements);
    }
}
