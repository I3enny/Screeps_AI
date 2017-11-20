class StorageUtils {
    static isState(structure, type, state) {
        if (('Any' === type || 'Energy' === type) &&
            STRUCTURE_SPAWN === structure.structureType ||
            STRUCTURE_EXTENSION === structure.structureType) {
            if (!state)
                return true;
            if ('Empty' === state && 0 === structure.energy)
                return true;
            else if ('NotEmpty' === state && structure.energy > 0)
                return true;
            else if ('Full' === state && structure.energy === structure.energyCapacity)
                return true;
            else if ('NotFull' === state && structure.energy < structure.energyCapacity)
                return true;
        } else if (('Any' === type || 'Container' === type) &&
            (STRUCTURE_STORAGE === structure.structureType ||
                STRUCTURE_CONTAINER === structure.structureType)) {
            const total = _.sum(structure.store);
            if (!state)
                return true;
            else if ('Empty' === state && 0 === total)
                return true;
            else if ('NotEmpty' === state && total > 0)
                return true;
            else if ('Full' === state && total === structure.storeCapacity)
                return true;
            else if ('NotFull' === state && total < structure.storeCapacity)
                return true;
        }
        return false;
    }

    static storages_get(room, type, state) {
        let structures = room.find(FIND_STRUCTURES);
        let storages = [];
        structures.forEach(function (structure) {
            if (this.isState(structure, type, state))
                storages.push(structure);
        });
        //console.log("Call : storages_get(" + room + ", '" + type + "', '" + state + "')");
        return storages;
    }
}

module.exports = StorageUtils;