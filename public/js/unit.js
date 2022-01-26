/**
 * ユニット
 */
class Unit {
    /**
     */
    constructor() {
        this.characters = Array(9).fill().map(value => new Character(this));
        this.conditions = new Map();
        for(let condition in Conditions) {
            this.conditions.set(condition, true);
        }
        this.value = 1;
    }

    /**
     * ベストなスキルを装備する
     */
    equipSkill() {
        let items = Skills.
              map((skill) => {
                  const value = this.getSkillValue(skill);
                  const count = localStorage.getItem(skill.toIndex()) || 0;
                  return new SkillItem(skill, value, count);
              }).
              filter((item) => item.count > 0 && item.value > 1);
        items.sort((lhs, rhs) => rhs.vps - lhs.vps);
        console.log(items);
        this.value = 1;
        for(let character of this.characters) {
            character.value = 1;
            character.items = [];
            let best = character.equipSkill(items);
            if(best) {
                console.log(best);
                this.value *= best.value;
                character.value = best.value;
                character.items = best.items;
                for(let item of best.items) {
                    item.count--;
                }
                items = items.filter((item) => item.count > 0);
            }
            character.update();
        }
    }

    /**
     * スキルの効果を計算する
     */
    getSkillValue(skill) {
        let value = 1 + skill.min * 0.01;
        if(this.conditions.get(skill.cond)) {
            value *= 1 + skill.max * 0.01;
        }
        return value;
    }

    /**
     */
    toHtml() {
        const div = document.createElement("div");
        {
            div.append(...Array.from(this.conditions).map((entry) => {
                const label = document.createElement("label");
                label.setAttribute("class", entry[0]);
                const input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", entry[0]);
                input.checked = entry[1];
                input.addEventListener("change", (event) => {
                    this.conditions.set(entry[0], input.checked);
                    console.log(this.conditions);
                });
                label.append(input);
                label.append(document.createTextNode(Conditions[entry[0]]));
                return label;
            }));
        }
        {
            const input = document.createElement("input");
            input.setAttribute("type", "button");
            input.setAttribute("value", "装備");
            input.addEventListener("click", () => { this.equipSkill() });
            div.append(input);
        }
        {
            const table = document.createElement("table");
            table.setAttribute("class", "unitSkills");
            {
                const thead = document.createElement("thead");
                const tr = document.createElement("tr");
                {
                    const th = document.createElement("th");
                    th.append(document.createTextNode("スロット"));
                    tr.append(th);
                }
                {
                    const th = document.createElement("th");
                    th.colSpan = SLOT_MAX;
                    th.append(document.createTextNode("スキル"));
                    tr.append(th);
                }
                {
                    const th = document.createElement("th");
                    th.append(document.createTextNode("効果"));
                    tr.append(th);
                }
                thead.append(tr);
                table.append(thead);
            }
            {
                const tbody = document.createElement("tbody");
                tbody.append(...this.characters.map((character) => character.toHtml()));
                table.append(tbody);
            }
            div.append(table);
        }
        return div;
    }
}
