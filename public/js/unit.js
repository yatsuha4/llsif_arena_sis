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
        this.target = 10000000;
        this.scoreText = null;
        this.valueText = null;
        this.targetText = null;
        this.conditionInputs = new Map();
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
        this.update();
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
        div.append(this.createConditionInputs());
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
                for(let character of this.characters) {
                    tbody.append(...character.toHtml());
                }
                table.append(tbody);
            }
            div.append(table);
        }
        {
            this.scoreText = document.createTextNode("");
            this.valueText = document.createTextNode("");
            this.targetText = document.createTextNode("");
            const scoreDiv = document.createElement("div");
            scoreDiv.append(this.scoreText, 
                            document.createTextNode(" x "), 
                            this.valueText, 
                            document.createTextNode(" = "), 
                            this.targetText);
            div.append(scoreDiv);
        }
        this.update();
        return div;
    }

    /**
     * 条件入力要素を生成する
     * @returns {Element} 条件入力要素
     */
    createConditionInputs() {
        const conditionLists = [
            [ "Life50", "Life100", "Heart8" ], 
            [ "Muse", "Aqours" ], 
            [ "FullCombo" ], 
            [ "Smile", "Pure", "Cool" ], 
            [ "Perfect50" ]
        ];
        const div = document.createElement("div");
        for(let conditions of conditionLists) {
            const span = document.createElement("span");
            for(let condition of conditions) {
                const label = document.createElement("label");
                label.setAttribute("class", condition);
                const input = document.createElement("input");
                this.conditionInputs.set(condition, input);
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", condition);
                input.checked = this.conditions.get(condition);
                input.addEventListener("change", (event) => {
                    this.setCondition(condition, input.checked);
                });
                label.append(input);
                label.append(document.createTextNode(Conditions[condition]));
                span.append(label);
            }
            div.append(span);
        }
        return div;
    }

    /**
     * 条件を変更する
     * @param {string} condition 条件
     * @param {bool} value 値
     */
    setCondition(condition, value) {
        this.conditions.set(condition, value);
        this.conditionInputs.get(condition).checked = value;
        switch(condition) {
        case "Life50":
            if(!value) {
                this.setCondition("Life100", false);
            }
            break;
        case "Life100":
            if(value) {
                this.setCondition("Life50", true);
            }
            else {
                this.setCondition("Heart8", false);
            }
            break;
        case "Heart8":
            if(value) {
                this.setCondition("Life100", true);
            }
            break;
        case "Muse":
            if(value) {
                this.setCondition("Aqours", false);
            }
            break;
        case "Aqours":
            if(value) {
                this.setCondition("Muse", false);
            }
            break;
        case "Smile":
            if(value) {
                this.setCondition("Pure", false);
                this.setCondition("Cool", false);
            }
            break;
        case "Pure":
            if(value) {
                this.setCondition("Smile", false);
                this.setCondition("Cool", false);
            }
            break;
        case "Cool":
            if(value) {
                this.setCondition("Smile", false);
                this.setCondition("Pure", false);
            }
            break;
        }
    }

    /**
     */
    update() {
        const score = Math.ceil(this.target / this.value);
        this.scoreText.textContent = score;
        this.valueText.textContent = this.value.toFixed(3);
        this.targetText.textContent = this.target;
    }
}
