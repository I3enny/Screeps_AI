var Utils = require('utils');

const HARVESTER_COUNT_PER_SOURCE = 3;
const MAX_BUILD_COUNT = 1;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = Utils.creeps_get(this.room, 'builder');
        this.harvesters = Utils.creeps_get(this.room, 'harvester');
    }

    run() {
        if (!this.spawn.spawning) {
            if (this.harvesters.length >= 4 && this.builders.length < MAX_BUILD_COUNT) {
                this.spawnCreepBuilder();
            } else {
                let sourcesData = this.room.memory.sources;
                sourcesData.some(function (sourceData) {
                    if (sourceData.minerCount < HARVESTER_COUNT_PER_SOURCE) {
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
}

module.exports = Spawner;