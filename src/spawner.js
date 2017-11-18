var Utils = require('utils');

const HARVESTER_COUNT_PER_SOURCE = 3;
const MAX_BUILD_COUNT = 2;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = Utils.creeps_get(this.room, 'builder');
        this.harvesters = Utils.creeps_get(this.room, 'harvester');
        this.miners = Utils.creeps_get(this.room, 'miner');
    }
    
    run() {
        if (!this.spawn.spawning) {
            if (this.harvesters.length >= 4 && this.builders.length < MAX_BUILD_COUNT) {
                this.spawnCreepBuilder();
            } else {
                var sourcesData = this.room.memory.sources;
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
        var job = 'builder';
        var creepName = 'Builder' + Game.time;
        if (this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], creepName,
            {memory: {role: job, working: false}}) == OK) {
            this.room.memory.creeps.push(creepName);
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }
    
    spawnCreepHarvester(sourceData) {
        var job = 'harvester';
        var creepName = 'Harvester' + Game.time;
        var source = Game.getObjectById(sourceData.ID);
        if (this.spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName,
            {memory: {role: job, sourceID: source.id}}) == OK) {
            this.room.memory.creeps.push(creepName);
            sourceData.minerCount++;
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }
    
    logCreepCount() {
        console.log("Harvesters: " + this.harvesters.length);
        console.log("Miners: " + this.miners.length);
    }
    
}

module.exports = Spawner;