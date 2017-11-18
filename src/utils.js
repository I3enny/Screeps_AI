class Utils {
    static remove(array, elt) {
        let index = array.indexOf(elt);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    static creeps_get(room, job) {
        if (job) {
            return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name) &&
                creep.memory.role === job);
        } else {
            return _.filter(Game.creeps, (creep) => room.memory.creeps.includes(creep.name));
        }
    }

    static isEnergyStorage(structure) {
        return STRUCTURE_SPAWN === structure.structureType ||
            STRUCTURE_EXTENSION === structure.structureType;
    }

    static isEnergyStorageNotFull(structure) {
        return this.isEnergyStorage(structure) &&
            structure.energy < structure.energyCapacity;
    }

    static isEnergyStorageNotEmpty(structure) {
        return this.isEnergyStorage(structure) &&
            structure.energy > 0;
    }

    static isStorage(structure) {
        return STRUCTURE_STORAGE === structure.structureType ||
            STRUCTURE_CONTAINER === structure.structureType;
    }

    static isStorageNotFull(structure) {
        return this.isStorage(structure) &&
            structure.store['energy'] < structure.storeCapacity;
    }

    static isStorageNotEmpty(structure) {
        return this.isStorage(structure) &&
            structure.store['energy'] > 0;
    }

    static storagesNotEmpty_get(room) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return this.isStorageNotEmpty(structure) ||
                    this.isEnergyStorageNotEmpty(structure);
            }
        });
    }

    static storagesNotFull_get(room) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return this.isStorageNotFull(structure) ||
                    this.isEnergyStorageNotFull(structure);
            }
        });
    }
}

module.exports = Utils;