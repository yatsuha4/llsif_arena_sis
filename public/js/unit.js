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
            this.conditions[condition] = true;
        }
        this.value = 1;
    }

    /**
     * ベストなスキルを装備する
     */
    equipSkill() {
        let items = Skills.
              map((skill) => {
                  const value = this.getSkillValue(skill);
                  const count = localStorage.getItem(skill.toString()) || 0;
                  return new SkillItem(skill, value, count);
              }).
              filter((item) => item.count > 0 && item.value > 0);
        items.sort((lhs, rhs) => rhs.vps - lhs.vps);
        console.log(items);
        this.value = 1;
        for(let character of this.characters) {
            let best = character.equipSkill(items);
            if(best) {
                console.log(best);
                this.value *= best.value;
                character.items = best.items;
                for(let item of best.items) {
                    item.count--;
                }
                items = items.filter((item) => item.count > 0);
            }
        }
    }

    /**
     * スキルの効果を計算する
     */
    getSkillValue(skill) {
        let value = 1 + skill.min * 0.01;
        if(this.conditions[skill.cond]) {
            value *= 1 + skill.max * 0.01;
        }
        return value;
    }
}
