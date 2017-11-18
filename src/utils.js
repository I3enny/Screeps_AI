class Utils {
    static remove(array, elt) {
        var index = array.indexOf(elt);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    
    static creeps_get_all(room) {
        return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name));
    }
    
    static creeps_get(room, job) {
        return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name) &&
            creep.memory.role == job);
    }
    
    static isEnergyContainer(structure) {
        return structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION;
    }
    
    static isEnergyContainerNotFull(structure) {
        return this.isEnergyContainer(structure) &&
            structure.energy < structure.energyCapacity;
    }
    
    static isContainer(structure) {
        return structure.structureType == STRUCTURE_STORAGE ||
            structure.structureType == STRUCTURE_CONTAINER;
    }
    
    static isContainerNotFull(structure) {
        return this.isContainer(structure) &&
            structure.store['energy'] < structure.storeCapacity;
    }
    
    static isContainerNotEmpty(structure) {
        return this.isContainer(structure) &&
            structure.store['energy'] > 0;
    }
}

module.exports = Utils;