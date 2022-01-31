/**
 * キャラクター
 */
class Character {
    /**
     * @param {Unit} unit ユニット
     * @param {number} index インデックス番号
     */
    constructor(unit, index) {
        this.unit = unit;
        this.index = index;
        this.slot = unit.preference.slots[index];
        this.items = [];
        this.value = 1;
        this.tr = null;
    }

    /**
     */
    clear() {
        this.items = [];
        this.value = 1;
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
                this.slot = this.unit.preference.slots[this.index] = input.value;
                this.clear();
                this.update();
                preference.save();
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
        const classes = [ "slotSkill", "slotValue" ];
        const elements = [ [ this.tr[0].firstChild ], [] ];
        let cost = 0;
        for(let item of this.items) {
            let tds = Array(2).fill().map(td => document.createElement("td"));
            tds.forEach((td, i) => {
                td.setAttribute("class", [ classes[i], item.skill.class ].join(" "));
                if(item.skill.cost > 1) {
                    td.setAttribute("colSpan", item.skill.cost);
                }
            });
            tds[0].append(document.createTextNode(item.skill.toString()));
            let value = (item.skill.max / 100 + 1).toFixed(3);
            tds[1].append(document.createTextNode(value)); 
            tds.forEach((td, i) => {
                elements[i].push(td);
            });
            cost += item.skill.cost;
        }
        for(let i = cost; i < SLOT_MAX; i++) {
            let tds = Array(2).fill().map(td => document.createElement("td"));
            tds.forEach((td, j) => {
                td.setAttribute("class", [
                    classes[j], 
                    (i < this.slot) ? "slotEmpty" : "slotInvalid"
                ].join(" "));
            });
            tds[0].append(document.createTextNode("-"));
            tds[1].append(document.createTextNode("1.000"));
            tds.forEach((td, j) => {
                elements[j].push(td);
            });
        }
        this.tr.forEach((tr, i) => {
            tr.replaceChildren(...elements[i]);
        });
    }
}
