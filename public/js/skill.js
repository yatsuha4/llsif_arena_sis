class Skill {
    constructor(rarity, name, cond, cost, rank, max, min) {
        this.rarity = rarity;
        this.name = name;
        this.cond = cond;
        this.cost = cost;
        this.rank = rank;
        this.max = max;
        this.min = min;
    }

    toIndex() {
        return `${this.rarity}${this.name}-${this.cond}-${this.rank}`;
    }

    getClass() {
        return this.min ? `${this.cond}_Plus` : this.cond;
    }
}
