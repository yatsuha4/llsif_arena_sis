/**
 * 設定
 */
class Preference {
    /**
     */
    constructor() {
        this.skills = {};
        this.units = [];
    }

    /**
     */
    static load() {
        const preference = new Preference();
        const json = localStorage.getItem(STORAGE_KEY);
        if(json) {
            preference.load(json);
        }
        else {
            preference.appendUnit();
        }
        return preference;
    }

    /**
     */
    load(json) {
        Object.assign(this, JSON.parse(json));
    }

    /**
     */
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
    }

    /**
     */
    appendUnit(src = null) {
        const unit = {
            name: "ユニット", 
            conditions: {
                Absolute: true
            }, 
            slots: Array(CHARACTER_MAX).fill(SLOT_MAX), 
            target: TARGET_SCORE
        }
        let index = 0;
        if(src) {
            index = this.units.findIndex((unit) => unit == src) + 1;
            Object.assign(unit, JSON.parse(JSON.stringify(src)));
        }
        unit.id = Date.now();
        this.units.splice(index, 0, unit);
        return unit;
    }

    /**
     */
    removeUnit(unit) {
        this.units = this.units.filter((x) => x != unit);
    }
}
