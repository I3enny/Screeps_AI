class CreepUtils {
    static creeps_get(room, job) {
        if (job) {
            return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name) &&
                creep.memory.role === job);
        } else {
            return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name));
        }
    }
}

module.exports = CreepUtils;