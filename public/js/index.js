window.onload = createSkillsTable;

/**
 */
function createSkillsTable() {
    const skills = document.getElementById("skills");
    const table = createElement("table", "", { id: "skills-table" });
    const tr = createElement("tr", "", { class: "table-header" });
    tr.appendChild(createElement("th", "レアリティ"));
    tr.appendChild(createElement("th", "スキル"));
    tr.appendChild(createElement("th", "条件"));
    tr.appendChild(createElement("th", "コスト"));
    tr.appendChild(createElement("th", "ランク"));
    tr.appendChild(createElement("th", "効果"));
    tr.appendChild(createElement("th", "所持数"));
    table.appendChild(tr);
    for(let skill of Skills) {
        table.appendChild(createSkill(skill));
    }
    skills.appendChild(table);
}

/**
 *
 */
function createSkill(skill) {
    const tr = document.createElement("tr");
    tr.appendChild(createTableData(skill.rarity));
    tr.appendChild(createTableData(skill.name));
    tr.appendChild(createTableData(Conditions[skill.cond]));
    tr.appendChild(createTableData(skill.cost));
    tr.appendChild(createTableData(skill.rank));
    tr.appendChild(createTableData(skill.min ? `${skill.max}%+${skill.min}%` : `${skill.max}%`));
    const td = document.createElement("td");
    const input = createInputNumber(localStorage.getItem(skill.toString()) || 0);
    input.addEventListener("change", (event) => {
        localStorage.setItem(skill.toString(), event.target.value);
    });
    td.appendChild(input);
    tr.appendChild(td);
    return tr;
}

/**
 *
 */
function createTableData(text = "") {
    return createElement("td", text);
}

/**
 *
 */
function createInputNumber(value = 0, min = 0) {
    const input = createElement("input");
    input.type = "number";
    input.value = value;
    input.min = min;
    return input;
}

/**
 */
function createElement(name, text = "", attributes = null) {
    const element = document.createElement(name);
    element.textContent = text;
    if(attributes) {
        for(const attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
    }
    return element;
}
