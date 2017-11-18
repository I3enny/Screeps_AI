var Utils = require('utils');

class RoomHandler {
    constructor(roomName) {
        this.room = Game.rooms[roomName];
        this.creeps = Utils.creeps_get(this.room);


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
                case ('builder'):
                    this.runBuilder(creep);
                    break;
                case ('harvester'):
                    this.runHarvester(creep);
                    break;
                case ('roomMaintainer'):
                    this.runRoomMaintainer(creep);
                    break;
                default:
                    console.log(creep + " has no job");
            }
        }, this);
    }

    runBuilder(creep) {
        if (creep.memory.working && creep.carry.energy > 0) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            let building = toBuild[0];
            if (ERR_NOT_IN_RANGE === creep.build(building)) {
                creep.moveTo(building);
            }
        } else if (creep.memory.working) {
            creep.memory.working = false;
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storages = Utils.storagesNotEmpty_get(this.room);
            let storage = creep.pos.findClosestByPath(storages);
            if (ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
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
            let storages = Utils.storagesNotFull_get(this.room);
            if (storages.length > 0) {
                let storage = creep.pos.findClosestByPath(storages);
                if (ERR_NOT_IN_RANGE === creep.transfer(storage, RESOURCE_ENERGY)) {
                    creep.moveTo(storage, {visualizePathStyle: {}});
                }
            }
        }
    }

    runRoomMaintainer(creep) {

        if (creep.memory.working && creep.carry.energy > 0) {
            let roomController = this.room.controller;
            if (ERR_NOT_IN_RANGE === creep.upgradeController(roomController)) {
                creep.moveTo(roomController);
            }
        } else if (creep.memory.working) {
            creep.memory.working = false;
        } else if (creep.carry.energy < creep.carryCapacity) {
            let storages = Utils.storagesNotEmpty_get(this.room);
            let storage = creep.pos.findClosestByPath(storages);
            if (ERR_NOT_IN_RANGE === creep.withdraw(storage, RESOURCE_ENERGY)) {
                creep.moveTo(storage);
            }
        } else {
            creep.memory.working = true;
        }
    }
}

module.exports = RoomHandler;