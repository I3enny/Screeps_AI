let Utils = require('utils');

const MIN_HARVESTER_COUNT = 4;
const MAX_HARVESTER_COUNT_PER_SOURCE = 3;
const MAX_BUILDER_COUNT = 2;
const MAX_ROOM_MAINTAINER = 2;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = Utils.creeps_get(this.room, 'builder');
        this.harvesters = Utils.creeps_get(this.room, 'harvester');
        this.roomMaintainers = Utils.creeps_get(this.room, 'roomMaintainer');
    }

    run() {
        if (!this.spawn.spawning) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (this.harvesters.length >= MIN_HARVESTER_COUNT) {
                if (this.roomMaintainers.length < MAX_ROOM_MAINTAINER) {
                    this.spawnCreepRoomMaintainer();
                } else if (this.roomMaintainers.length >= 1 &&
                    this.builders.length < MAX_BUILDER_COUNT && toBuild.length) {
                    this.spawnCreepBuilder();
                }
            } else {
                let sourcesData = this.room.memory.sources;
                sourcesData.some(function (sourceData) {
                    if (sourceData.minerCount < MAX_HARVESTER_COUNT_PER_SOURCE) {
                        this.spawnCreepHarvester(sourceData);
                        return true;
                    }
                    return false;
                }, this);
            }
        }
    }

    spawnCreepBuilder() {
        let job = 'builder';
        let creepName = 'Builder' + Game.time;
        if (OK === this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], creepName,
                {memory: {role: job, working: false}})) {
            this.room.memory.creeps.push(creepName);
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }

    spawnCreepHarvester(sourceData) {
        let job = 'harvester';
        let creepName = 'Harvester' + Game.time;
        let source = Game.getObjectById(sourceData.ID);
        if (OK === this.spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName,
                {memory: {role: job, sourceID: source.id}})) {
            this.room.memory.creeps.push(creepName);
            sourceData.minerCount++;
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }

    spawnCreepRoomMaintainer() {
        let job = 'roomMaintainer';
        let creepName = 'RoomMaintainer' + Game.time;
        if (OK === this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], creepName,
                {memory: {role: job}})) {
            this.room.memory.creeps.push(creepName);
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }
}

module.exports = Spawner;