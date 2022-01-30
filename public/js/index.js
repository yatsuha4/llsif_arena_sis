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
              createElement("th", "ランク"), 
              createElement("th", "効果"), 
              createElement("th", "所持数"));
    thead.append(tr);
    table.append(thead);

    const tbody = createElement("tbody");
    for(let skill of Skills) {
        tbody.append(skill.toHtml());
    }
    table.append(tbody);
    skills.appendChild(table);
}

/**
 * ユニット要素を構成する
 */
function setupUnits() {
    document.getElementById("units").
        replaceChildren(...preference.units.map((unit) => createUnit(unit)));
}

/**
 */
function appendUnit(src) {
    const unit = preference.appendUnit(src.preference);
    preference.save();
    src.element.insertAdjacentElement("afterend", createUnit(unit));
}

/**
 */
function removeUnit(unit) {
    if(confirm("ユニットを削除しますか？")) {
        preference.removeUnit(unit.preference);
        unit.element.remove();
        if(preference.units.length == 0) {
            document.getElementById("units").append(createUnit(preference.appendUnit()));
        }
        preference.save();
    }
}

/**
 * ユニット要素を生成する
 * @param {object} unit ユニット設定
 * @returns {Element} ユニット要素
 */
function createUnit(unit) {
    return new Unit(unit).toHtml();
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

/**
 */
function createButton(text, onClick) {
    const button = createElement("button");
    button.addEventListener("click", onClick);
    button.append(document.createTextNode(text));
    return button;
}

/**
 */
function exportPreference() {
    const json = JSON.stringify(preference, null, 4);
    const blob = new Blob([ json ], { type: "text/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "llsif-arena-sis.json";
    link.click();
}

/**
 */
function importPreference() {
}
