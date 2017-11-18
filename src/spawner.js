let CreepUtils = require('creepUtils');
let StorageUtils = require('storageUtils');

const MIN_HARVESTER = 4;
const MAX_HARVESTER_PER_SOURCE = 3;
const MAX_BUILDER = 2;
const MAX_CONTROLLER_UPGRADER = 1;
const MAX_SPAWN_REFILLER = 1;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = CreepUtils.creeps_get(this.room, 'Builder');
        this.controllerUpgraders = CreepUtils.creeps_get(this.room, 'ControllerUpgrader');
        this.harvesters = CreepUtils.creeps_get(this.room, 'Harvester');
        this.spawnRefiller = CreepUtils.creeps_get(this.room, 'SpawnRefiller');
    }

    run() {
        if (!this.spawn.spawning) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (this.harvesters.length >= MIN_HARVESTER) {
                let containers = StorageUtils.storages_get(this.room, 'Container');
                if (this.spawnRefiller.length < MAX_SPAWN_REFILLER && containers && containers.length) {
                    return this.spawnCreep('spawnRefiller');
                } else if (this.controllerUpgraders.length < MAX_CONTROLLER_UPGRADER) {
                    return this.spawnCreep('ControllerUpgrader');
                } else if (this.controllerUpgraders.length >= 1 &&
                    this.builders.length < MAX_BUILDER && toBuild.length) {
                    return this.spawnCreep('Builder');
                }
            }
            let sourcesData = this.room.memory.sources;
            sourcesData.some(function (sourceData) {
                if (sourceData.minerCount < MAX_HARVESTER_PER_SOURCE) {
                    return this.spawnCreep('Harvester', sourceData);
                }
                return false;
            }, this);
        }
    }

    spawnCreep(job, arg1) {
        let creepName = job + Game.time;
        let components = [];
        let data = {};
        switch (job) {
            case ('Builder'):
                components = [WORK, CARRY, CARRY, MOVE];
                break;
            case ('ControllerUpgrader'):
                components = [WORK, CARRY, CARRY, MOVE];
                break;
            case ('Harvester'):
                components = [WORK, CARRY, MOVE, MOVE];
                break;
            case('Maintainer'):
                components = [WORK, CARRY, CARRY, MOVE];
                break;
        }
        switch (job) {
            case ('Builder'):
            case ('ControllerUpgrader'):
            case('Maintainer'):
                data = {role: job};
                break;
            case ('Harvester'):
                let source = Game.getObjectById(arg1.ID);
                data = {role: job, sourceID : source.id};
        }
        if (OK === this.spawn.spawnCreep(components, creepName, {memory: data})) {
            this.room.memory.creeps.push(creepName);
            if ('Harvester' === job)
                arg1.minerCount++;
            console.log("Spawning: " + Game.creeps[creepName]);
            return true;
        }
        return false;
    }
}

module.exports = Spawner;