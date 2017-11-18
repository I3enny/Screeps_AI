class StorageUtils {
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

module.exports = StorageUtils;