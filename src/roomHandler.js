var Utils = require('utils');

class RoomHandler {
    constructor(roomName) {
        this.room = Game.rooms[roomName];
        this.builders = Utils.creeps_get(this.room, 'builder');
        this.harvesters = Utils.creeps_get(this.room, 'harvester');
        this.miners = Utils.creeps_get(this.room, 'miner');
        this.creeps = Utils.creeps_get_all(this.room);


        if (!this.room.memory.creeps) {
            this.room.memory.creeps = [];
        }

        // Adding sources in room memory
        if (!this.room.memory.sources) {
            let sources = this.room.find(FIND_SOURCES);
            this.room.memory.sources = [];
            sources.forEach(function (source) {
                this.room.memory.sources.push({ID: source.id, minerCount: 0});
            }, this);
        }
    }

    run() {
        this.harvesters.forEach(function (creep) {
            this.runHarvester(creep);
        }, this);
        this.builders.forEach(function (creep) {
            this.runBuilder(creep);
        }, this);
    }

    runBuilder(creep) {
        if (creep.memory.working && creep.carry.energy > 0) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            // FIXME: Build order as a stack.
            let building = toBuild[0];
            if (creep.build(building) === ERR_NOT_IN_RANGE) {
                creep.moveTo(building);
            }
        } else if (creep.memory.working) {
            creep.memory.working = false;
        } else if (creep.carry.energy < creep.carryCapacity) {
            let supplySites = this.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return Utils.isContainerNotFull(structure) ||
                        Utils.isEnergyContainerNotFull(structure);
                }
            });
            // FIXME: Better supply analysis + save supply in memory.
            let supplySite = supplySites[0];
            if (ERR_NOT_IN_RANGE === creep.withdraw(supplySite, RESOURCE_ENERGY)) {
                creep.moveTo(supplySite);
            }
        } else {
            creep.memory.working = true;
        }
    }

    runHarvester(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            let source = Game.getObjectById(creep.memory.sourceID);
            if (ERR_NOT_IN_RANGE === creep.harvest(source)) {
                creep.moveTo(source, {visualizePathStyle: {}});
            }
        } else {
            let storages = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return Utils.isContainerNotFull(structure) ||
                        Utils.isEnergyContainerNotFull(structure);
                }
            });
            if (storages.length > 0) {
                let storage = creep.pos.findClosestByPath(storages);
                if (ERR_NOT_IN_RANGE === creep.transfer(storage, RESOURCE_ENERGY)) {
                    creep.moveTo(storage, {visualizePathStyle: {}});
                }
            }
        }
    }
}

module.exports = RoomHandler;