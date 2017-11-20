let CreepUtils = require('creepUtils');
let StorageUtils = require('storageUtils');

const MAX_BUILDER = 1;
const MAX_CONTROLLER_UPGRADER = 2;
const MAX_CREEPS = 20;
const MIN_HARVESTER = 6;
const MAX_HARVESTER_PER_SOURCE = 3;
const MAX_MAINTAINER = 1;
const MAX_SPAWN_REFILLER = 1;
const MIN_ENERGY_TO_SPAWN = 100;

class Spawner {
    constructor(spawnName) {
        this.spawn = Game.spawns[spawnName];
        this.room = this.spawn.room;
        this.builders = CreepUtils.creeps_get(this.room, 'Builder');
        this.controllerUpgraders = CreepUtils.creeps_get(this.room, 'ControllerUpgrader');
        this.creeps = CreepUtils.creeps_get(this.room);
        this.harvesters = CreepUtils.creeps_get(this.room, 'Harvester');
        this.maintainers = CreepUtils.creeps_get(this.room, 'Maintainer');
        this.spawnRefiller = CreepUtils.creeps_get(this.room, 'SpawnRefiller');
        this.energyContainers = StorageUtils.storages_get(this.room, 'Energy', 'NotEmpty');
        this.energyAvailable = 0;
        this.energyContainers.forEach(function (container) {
            this.energyAvailable += container.energy;
        }, this);
    }

    run() {
        if (!this.spawn.spawning && this.creeps.length < MAX_CREEPS && this.energyAvailable > MIN_ENERGY_TO_SPAWN) {
            let toBuild = this.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (this.maintainers.length < MAX_MAINTAINER) {
                return this.spawnCreep('Maintainer');
            } else if (this.harvesters.length >= MIN_HARVESTER) {
                let containers = StorageUtils.storages_get(this.room, 'Container');
                if (this.spawnRefiller.length < MAX_SPAWN_REFILLER && containers && containers.length) {
                    return this.spawnCreep('SpawnRefiller');
                } else if (this.builders.length < MAX_BUILDER && toBuild.length) {
                    return this.spawnCreep('Builder');
                } else if (this.controllerUpgraders.length < MAX_CONTROLLER_UPGRADER) {
                    return this.spawnCreep('ControllerUpgrader');
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
        let components = CreepUtils.generateComponents(job, this.energyAvailable);
        let data = {};
        switch (job) {
            case ('Builder'):
            case ('ControllerUpgrader'):
            case ('Maintainer'):
            case ('SpawnRefiller'):
                data = {role: job, working: true};
                break;
            case ('Harvester'):
                let source = Game.getObjectById(arg1.ID);
                data = {role: job, sourceID : source.id, working: true};
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