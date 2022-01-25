class Character {
    /**
     */
    constructor(unit) {
        this.unit = unit;
        this.slot = 8;
        this.skills = [];
    }

    /**
     */
    equipSkill(skills, best = null) {
        skills = skills.slice();
        const slot = this.skills.reduce((sum, skill) => sum + skill.cost, 0);
        let skill;
        while(skill = skills.shift()) {
            if(slot + skill.cost <= this.slot) {
                if(!best) {
                    this.skills = [];
                }
                this.skills.push(skill);
                const value = this.unit.getSkillValue(this.skills);
                if(!best || value > best.value) {
                    best = {
                        value: value, 
                        skills: this.skills.slice()
                    };
                }
                best = this.equipSkill(skills, best);
                this.skills.pop(skill);
            }
        }
        return best;
    }
}
