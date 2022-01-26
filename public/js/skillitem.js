/**
 * 装備スキル
 */
class SkillItem {
    /**
     * @param {Skill} skill スキルデータ
     * @param {number} value 価値
     * @param {number} count 所持数
     */
    constructor(skill, value, count) {
        this.skill = skill;
        this.value = value;
        this.count = count;
        this.vps = (value - 1) / skill.cost + 1;
    }
}
