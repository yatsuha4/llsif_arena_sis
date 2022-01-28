preference = Preference.load();
console.log(preference);
window.onload = setup;

/**
 */
function setup() {
    createSkillsTable();
    setupUnits();
}

/**
 */
function equipSkill() {
    const unit = new Unit();
    unit.equipSkill();
    console.log(`value = ${unit.value}`);
}

/**
 */
function createSkillsTable() {
    const skills = document.getElementById("skills");
    const table = createElement("table", "", { id: "skills-table" });
    const thead = createElement("thead");
    const tr = createElement("tr");
    tr.append(createElement("th", "レアリティ"), 
              createElement("th", "スキル"), 
              createElement("th", "条件"), 
              createElement("th", "コスト"), 
              createElement("th", "ランク"), 
              createElement("th", "効果"), 
              createElement("th", "所持数"));
    thead.append(tr);
    table.append(thead);

    const tbody = createElement("tbody");
    for(let skill of Skills) {
        tbody.append(createSkill(skill));
    }
    table.append(tbody);
    skills.appendChild(table);
}

/**
 */
function setupUnits() {
    document.getElementById("units").
        replaceChildren(...preference.units.map(unit => (new Unit(unit)).toHtml()));
}

/**
 *
 */
function createSkill(skill) {
    const tr = createElement("tr", "", { class: getSkillClass(skill) });
    tr.appendChild(createTableData(skill.rarity));
    tr.appendChild(createTableData(skill.name));
    tr.appendChild(createTableData(Conditions[skill.cond]));
    tr.appendChild(createTableData(skill.cost));
    tr.appendChild(createTableData(skill.rank));
    tr.appendChild(createTableData(skill.min ? `${skill.max}%+${skill.min}%` : `${skill.max}%`));
    const td = document.createElement("td");
    const input = createInputNumber(localStorage.getItem(skill.toIndex()) || 0);
    input.addEventListener("change", (event) => {
        const value = parseInt(event.target.value);
        localStorage.setItem(skill.toIndex(), value);
        tr.setAttribute("class", getSkillClass(skill));
    });
    td.appendChild(input);
    tr.appendChild(td);
    return tr;
}

/**
 */
function getSkillClass(skill) {
    const value = localStorage.getItem(skill.toIndex()) || 0;
    return (value > 0)
        ? skill.getClass()
        : [ skill.getClass(), "empty" ].join(" ");
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
