const CARRY_COST = 50;
const MOVE_COST = 50;
const WORK_COST = 100;

const baseComponents = [
    ['Builder', [WORK, CARRY, CARRY, MOVE]],
    ['ControllerUpgrader', [WORK, CARRY, CARRY, MOVE]],
    ['Harvester', [WORK, CARRY, MOVE, MOVE]],
    ['Maintainer', [WORK, CARRY, CARRY, MOVE]],
    ['SpawnRefiller', [WORK, CARRY, CARRY, MOVE]]
];

const bonusComponents = [
    ['Builder', [WORK, CARRY]],
    ['ControllerUpgrader', [WORK, WORK, CARRY]],
    ['Harvester', [WORK, WORK, WORK, CARRY]],
    ['Maintainer', [WORK, CARRY, CARRY]],
    ['SpawnRefiller', [WORK, CARRY, CARRY, MOVE]]
];

const baseComponentsMap = new Map(baseComponents);
const bonusComponentsMap = new Map(bonusComponents);

class CreepUtils {
    static creeps_get(room, job) {
        if (job) {
            return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name) &&
                creep.memory.role === job);
        }
        return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name));
    }

    static generateComponents(job, energy) {
        let bonusBody = bonusComponentsMap.get(job);
        let energyTmp = this.cost(bonusBody);
        let body = baseComponentsMap.get(job);
        do {
            bonusBody.some(function (part) {
                let partCost = this.cost([part]);
                energyTmp += partCost;
                if (energyTmp >= energy)
                    return true;
                body.push(part);
                return false;
            }, this);
        } while (energyTmp < energy);
        //console.log(body);
        //console.log(energy, energyTmp);
        return body;
    }

    static cost(body) {
        let cost = 0;
        body.forEach(function (part) {
            switch (part) {
                case (CARRY):
                    cost += CARRY_COST;
                    break;
                case (MOVE):
                    cost += MOVE_COST;
                    break;
                case (WORK):
                    cost += WORK_COST;
                    break;
            }
        });
        return cost;
    }
}

module.exports = CreepUtils;