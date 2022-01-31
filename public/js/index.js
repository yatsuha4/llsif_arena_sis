preference = Preference.load();
console.log(preference);
window.onload = setup;

/**
 */
function setup() {
    document.getElementById("skills").
        replaceChildren(Skill.toHtml());
    document.getElementById("units").
        replaceChildren(...preference.units.map((unit) => new Unit(unit).toHtml()));
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
function appendUnit(src) {
    const unit = preference.appendUnit(src.preference);
    preference.save();
    src.element.insertAdjacentElement("afterend", createUnit(unit));
}

/**
 */
function removeUnit(unit) {
    if(confirm(`${unit.preference.name} を削除しますか？`)) {
        preference.removeUnit(unit.preference);
        unit.element.remove();
        if(preference.units.length == 0) {
            document.getElementById("units").append(createUnit(preference.appendUnit()));
        }
        preference.save();
    }
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
    const button = createElement("input", "", {
        type: "button", 
        class: "button", 
        value: text
    });
    button.addEventListener("click", onClick);
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
    const input = createElement("input", null, {
        type: "file", 
        accept: ".json"
    });
    input.addEventListener("change", (event) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            preference.load(reader.result);
            preference.save();
            setup();
        });
        reader.readAsText(event.path[0].files[0]);
    });
    input.click();
}
