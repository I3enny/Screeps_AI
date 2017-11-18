class StorageUtils {

    static storages_get(room, type, state) {
        let structures = room.find(FIND_MY_STRUCTURES);
        let storages = [];
        structures.forEach(function (structure) {
            if (('Any' === type || 'Energy' === type) &&
                (STRUCTURE_SPAWN === structure.structureType ||
                    STRUCTURE_EXTENSION === structure.structureType)) {
                if ('Empty' === state && 0 === structure.energy)
                    storages.push(structure);
                else if ('NotEmpty' === state && structure.energy > 0)
                    storages.push(structure);
                else if ('Full' === state && structure.energy === structure.energyCapacity)
                    storages.push(structure);
                else if ('NotFull' === state && structure.energy < structure.energyCapacity)
                    storages.push(structure);
            } else if (('Any' === type || 'Container' === type) &&
                (STRUCTURE_STORAGE === structure.structureType ||
                    STRUCTURE_CONTAINER === structure.structureType)) {
                const total = _.sum(structure.store);
                console.log(total);
                if ('Empty' === state && 0 === total)
                    storages.push(structure);
                else if ('NotEmpty' === state && total > 0)
                    storages.push(structure);
                else if ('Full' === state && total === structure.storeCapacity)
                    storages.push(structure);
                else if ('NotFull' === state && total < structure.storeCapacity)
                    storages.push(structure);
            }
        });
        //console.log("Call : storages_get(" + room + ", '" + type + "', '" + state + "')");
        return storages;
    }
}

module.exports = StorageUtils;