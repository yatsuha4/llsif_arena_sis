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
        this.tr = [ document.createElement("tr"), document.createElement("tr") ];
        {
            const td = document.createElement("td");
            td.setAttribute("rowSpan", 2);
            const input = document.createElement("input");
            input.type = "number";
            input.value = this.slot;
            input.min = 1;
            input.max = 8;
            input.addEventListener("change", (event) => {
                this.slot = input.value;
            });
            td.append(input);
            this.tr[0].append(td);
        }
        this.update();
        return this.tr;
    }

    /**
     */
    update() {
        const elements = [ this.tr[0].firstChild ];
        const values = [];
        let cost = 0;
        for(let item of this.items) {
            let td = [ document.createElement("td"), document.createElement("td") ];
            td[0].setAttribute("class", [ item.skill.getClass(), "slotSkill" ].join(" "));
            td[1].setAttribute("class", [ item.skill.getClass(), "slotValue" ].join(" "));
            if(item.skill.cost > 1) {
                td[0].setAttribute("colSpan", item.skill.cost);
                td[1].setAttribute("colSpan", item.skill.cost);
            }
            td[0].append(document.createTextNode(item.skill.toString()));
            let value = (item.skill.max / 100 + 1).toFixed(3);
            td[1].append(document.createTextNode(value)); 
            elements.push(td[0]);
            values.push(td[1]);
            cost += item.skill.cost;
        }
        for(let i = cost; i < SLOT_MAX; i++) {
            let td = document.createElement("td");
            td.setAttribute("rowSpan", 2);
            if(i >= this.slot) {
                td.setAttribute("class", "invalidSlot");
            }
            elements.push(td);
        }
        {
            let td = document.createElement("td");
            td.setAttribute("rowSpan", 2);
            td.append(document.createTextNode(this.value.toFixed(3)));
            elements.push(td);
        }
        this.tr[0].replaceChildren(...elements);
        this.tr[1].replaceChildren(...values);
    }
}
