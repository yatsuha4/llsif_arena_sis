class Unit {
    /**
     */
    constructor() {
        this.characters = Array(9).fill().map(value => new Character(this));
        this.conditions = new Map();
        for(let condition in Conditions) {
            this.conditions[condition] = true;
        }
        this.value = 1;
    }

    /**
     */
    equipSkill(skillMaps) {
        console.log(skillMaps);
        this.value = 1;
        for(let character of this.characters) {
            const skills = Array.from(skillMaps.values()).
                  filter(map => map.count > 0).
                  map(map => map.skill);
            console.log(skills);
            let best = character.equipSkill(skills);
            if(best) {
                console.log(best);
                this.value *= best.value;
                character.skills = best.skills;
                for(let skill of best.skills) {
                    skillMaps.get(skill.toString()).count--;
                }
            }
        }
    }

    /**
     * スキルの効果を計算する
     */
    getSkillValue(skills) {
        return skills.reduce((value, skill) => {
            value *= 1 + skill.min * 0.01;
            if(this.conditions[skill.cond]) {
                value *= 1 + skill.max * 0.01;
            }
            return value;
        }, 1);
    }
}
