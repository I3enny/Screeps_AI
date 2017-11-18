let CreepUtils = require('creepUtils');

const MIN_HARVESTER = 4;
const MAX_HARVESTER_PER_SOURCE = 3;
const MAX_BUILDER = 2;
const MAX_CONTROLLER_UPGRADER = 2;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = CreepUtils.creeps_get(this.room, 'Builder');
        this.harvesters = CreepUtils.creeps_get(this.room, 'Harvester');
        this.roomControllerUpgraders = CreepUtils.creeps_get(this.room, 'ControllerUpgrader');
    }

    run() {
        if (!this.spawn.spawning) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (this.harvesters.length >= MIN_HARVESTER) {
                if (this.roomControllerUpgraders.length < MAX_CONTROLLER_UPGRADER) {
                    this.spawnCreepControllerUpgrader();
                } else if (this.roomControllerUpgraders.length >= 1 &&
                    this.builders.length < MAX_BUILDER && toBuild.length) {
                    this.spawnCreepBuilder();
                }
            } else {
                let sourcesData = this.room.memory.sources;
                sourcesData.some(function (sourceData) {
                    if (sourceData.minerCount < MAX_HARVESTER_PER_SOURCE) {
                        this.spawnCreepHarvester(sourceData);
                        return true;
                    }
                    return false;
                }, this);
            }
        }
    }

    spawnCreepBuilder() {
        let job = 'Builder';
        let creepName = job + Game.time;
        if (OK === this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], creepName,
                {memory: {role: job}})) {
            this.room.memory.creeps.push(creepName);
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }

    spawnCreepHarvester(sourceData) {
        let job = 'Harvester';
        let creepName = job + Game.time;
        let source = Game.getObjectById(sourceData.ID);
        if (OK === this.spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], creepName,
                {memory: {role: job, sourceID: source.id}})) {
            this.room.memory.creeps.push(creepName);
            sourceData.minerCount++;
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }

    spawnCreepControllerUpgrader() {
        let job = 'ControllerUpgrader';
        let creepName = job + Game.time;
        if (OK === this.spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], creepName,
                {memory: {role: job}})) {
            this.room.memory.creeps.push(creepName);
            console.log("Spawning " + job + ": " + Game.creeps[creepName]);
        }
    }
}

module.exports = Spawner;