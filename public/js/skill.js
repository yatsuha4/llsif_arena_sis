/**
 * スキル
 */
class Skill {
    constructor(rarity, name, cond, cost, rank, max, min) {
        this.rarity = rarity;
        this.name = name;
        this.cond = cond;
        this.cost = cost;
        this.rank = rank;
        this.max = max;
        this.min = min;
        this.element = null;
        this.input = null;
    }

    get index() {
        return `${this.rarity}${this.name}-${this.cond}-${this.rank}`;
    }

    /**
     */
    toString() {
        return `${this.rarity}${this.name}${this.rank}`;
    }

    get class() {
        return this.min ? `${this.cond}_Plus` : this.cond;
    }

    /**
     */
    static toHtml() {
        const table = createElement("table", "", { id: "skills-table" });
        const thead = createElement("thead");
        const tr = createElement("tr");
        tr.append(createElement("th", "レア"), 
                  createElement("th", "スキル"), 
                  createElement("th", "R"), 
                  createElement("th", "効果"), 
                  createElement("th", "所持数"));
        thead.append(tr);
        table.append(thead);
        const tbody = createElement("tbody");
        for(let skill of Skills) {
            tbody.append(skill.toHtml());
        }
        table.append(tbody);
        return table;
    }

    /**
     */
    toHtml() {
        const tr = this.element = createElement("tr");
        tr.append(createElement("td", this.rarity), 
                  createElement("td", this.name), 
                  createElement("td", this.rank), 
                  createElement("td", 
                                this.min
                                ? `${this.max}+${this.min}`
                                : `${this.max}`));
        const td = createElement("td");
        this.input = createInputNumber(this.count);
        this.input.setAttribute("class", "inputSkillCount");
        this.input.addEventListener("change", (event) => {
            this.count = parseInt(event.target.value);
        });
        td.append(this.input, 
                  createButton("+", () => {
                      ++this.count;
                  }), 
                  createButton("-", () => {
                      if(this.count > 0) {
                          --this.count;
                      }
                  }), 
                  createButton("0", () => {
                      this.count = 0;
                  }), 
                  createButton("99", () => {
                      this.count = 99;
                  }));
        tr.append(td);
        this.update();
        return tr;
    }

    /**
     */
    set count(count) {
        if(count > 0) {
            preference.skills[this.index] = count;
        }
        else {
            delete preference.skills[this.index];
        }
        preference.save();
        this.update();
    }

    /**
     */
    get count() {
        return preference.skills[this.index] ?? 0;
    }

    /**
     */
    update() {
        const count = this.count;
        this.input.value = count;
        const classes = [ this.class ];
        if(count <= 0) {
            classes.push("empty");
        }
        this.element.setAttribute("class", classes.join(" "));
    }
}
