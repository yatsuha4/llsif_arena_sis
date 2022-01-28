const STORAGE_KEY = "preference";
/**
 * 設定
 */
class Preference {
    /**
     */
    constructor() {
        this.skills = {};
        this.units = {};
    }

    /**
     */
    static load() {
        const preference = new Preference();
        const json = localStorage.getItem(STORAGE_KEY);
        if(json) {
            Object.assign(preference, JSON.parse(json));
        }
        else {
            preference.appendUnit();
        }
        return preference;
    }

    /**
     */
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
    }

    /**
     */
    appendUnit() {
        const unit = {
            id: Date.now(), 
            conditions: {
                Absolute: true
            }, 
            slots: Array(CHARACTER_MAX).fill(SLOT_MAX), 
            target: 10000000
        }
        this.units[unit.id] = unit;
        return unit;
    }
}
