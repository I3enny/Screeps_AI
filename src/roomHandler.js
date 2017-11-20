let CreepUtils = require('creepUtils');
let StorageUtils = require('storageUtils');

let REPAIR_THRESHOLD = 100;

class RoomHandler {
    constructor(roomName) {
        this.room = Game.rooms[roomName];
        this.creeps = CreepUtils.creeps_get(this.room);


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
        this.creeps.forEach(function (creep) {
            switch (creep.memory.role) {
                case ('Builder'):
                    this.runBuilder(creep);
                    break;
                case ('ControllerUpgrader'):
                    this.runControllerUpgrader(creep);
                    break;
                case ('Harvester'):
                    this.runHarvester(creep);
                    break;
                case ('Maintainer'):
                    this.runMaintainer(creep);
                    break;
                case ('SpawnRefiller'):
                    this.runSpawnRefiller(creep)
                    break;
                default:
                    console.log(creep + " has no job, suicide ordered");
                    creep.suicide();
            }
        }, this);
    }

    runBuilder(creep) {
        if (creep.memory.working && creep.carry.energy > 0) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (!toBuild ||toBuild.length) {
                let building = toBuild[0];
                if (ERR_NOT_IN_RANGE === creep.build(building)) {
                    creep.moveTo(building);
                }
            }
        } else if (creep.memory.working) {
            let storages = StorageUtils.storages_get(this.room, 'Container', 'NotEmpty');
            if (!storages || !storages.length) {
                storages = StorageUtils.storages_get(this.room, 'Energy', 'NotEmpty');
            }
            if (storages && storages.length) {
                let storage = creep.pos.findClosestByPath(storages);
                if (storage) {
                    creep.memory.storageID = storage.id;
                    creep.memory.working = false;
                }
            }
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storage = Game.getObjectById(creep.memory.storageID);
            if (storage && ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
            }
        } else {
            creep.memory.working = true;
        }
    }

    runControllerUpgrader(creep) {
        if (creep.memory.working && creep.carry.energy > 0) {
            if (ERR_NOT_IN_RANGE === creep.upgradeController(this.room.controller)) {
                creep.moveTo(this.room.controller);
            }
        } else if (creep.memory.working) {
            let storages = StorageUtils.storages_get(this.room, 'Any', 'NotEmpty');
            if (storages && storages.length) {
                let storage = this.room.controller.pos.findClosestByPath(storages);
                if (storage) {
                    creep.memory.storageID = storage.id;
                    creep.memory.working = false;
                }
            }
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storage = Game.getObjectById(creep.memory.storageID);
            let storages = [];
            if (StorageUtils.isState(storage, 'Any', 'NotEmpty')) {
                storages = StorageUtils.storages_get(this.room, 'Any', 'NotEmpty');
                if (storages && storages.length) {
                    storage = this.room.controller.pos.findClosestByPath(storages);
                    if (storage)
                        creep.memory.storageID = storage.id;
                }
            }
            if (storage && ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
            }
        } else {
            creep.memory.working = true;
            delete creep.memory.storageID;
        }
    }

    runHarvester(creep) {
        if (creep.memory.working && creep.carry.energy < creep.carryCapacity) {
            let source = Game.getObjectById(creep.memory.sourceID);
            if (source && ERR_NOT_IN_RANGE === creep.harvest(source)) {
                creep.moveTo(source, {visualizePathStyle: {}});
            }
        } else if (creep.memory.working) {
            creep.memory.working = false;
        } else if (creep.carry.energy > 0) {
            let storages = StorageUtils.storages_get(this.room, 'Any', 'NotFull');
            if (storages && storages.length) {
                let storage = creep.pos.findClosestByPath(storages);
                // TODO Better storage handling (memory); check fullness
                if (storage && ERR_NOT_IN_RANGE === creep.transfer(storage, RESOURCE_ENERGY)) {
                    creep.moveTo(storage, {visualizePathStyle: {}});
                }
            }
        } else {
            creep.memory.working = true;
        }
    }

    runMaintainer(creep) {
        if (creep.memory.working && creep.carry.energy > 0) {
            let target = Game.getObjectById(creep.memory.targetID);
            if (target && ERR_NOT_IN_RANGE === creep.repair(target)) {
                creep.moveTo(target);
            }
        } else if (creep.memory.working) {
            delete creep.memory.targetID;
            creep.memory.working = false;
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storages = StorageUtils.storages_get(this.room, 'Container', 'NotEmpty');
            if (!storages || !storages.length) {
                storages = StorageUtils.storages_get(this.room, 'Energy', 'NotEmpty');
            }
            let storage = creep.pos.findClosestByPath(storages);
            if (storage && ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
            }
        } else {
            let structures = _.filter(this.room.find(FIND_STRUCTURES),
                (structure) => structure.hits < structure.hitsMax - REPAIR_THRESHOLD);
            if (structures && structures.length) {
                let target = structures[0];
                if (target) {
                    creep.memory.targetID = target.id;
                    delete creep.memory.storageID;
                    creep.memory.working = true;
                }
            }
        }
    }

    runSpawnRefiller(creep) {
        let spawns = this.room.find(FIND_MY_SPAWNS);
        if (!spawns || !spawns.length) {
            console.log("No spawn found in room " + this.room);
            return;
        }
        let spawn = spawns[0];
        if (creep.memory.working && creep.carry.energy > 0) {
            if (spawn && ERR_NOT_IN_RANGE === creep.transfer(spawn, RESOURCE_ENERGY)) {
                creep.moveTo(spawn);
            }
        } else if (creep.memory.working) {
            let storages = StorageUtils.storages_get(this.room, 'Container', 'NotEmpty');
            if (storages && storages.length) {
                let storage = spawn.pos.findClosestByPath(storages);
                if (storage) {
                    creep.memory.storageID = storage.id;
                    creep.memory.working = false;
                }
            }
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storage = Game.getObjectById(creep.memory.storageID);
            if (storage && ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
            }
        } else {
            creep.memory.working = true;
        }
    }
}

module.exports = RoomHandler;