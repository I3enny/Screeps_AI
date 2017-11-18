var Utils = require('utils');

class MemoryCleaner {
    constructor() {
    }
    
    run() {
        for (let roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            var creeps = room.memory.creeps;
            creeps.forEach(function (creepName) {
                var creep = Game.creeps[creepName];
                if (!creep) {
                    var role = Memory.creeps[creepName].role
                    switch (role) {
                        case 'harvester':
                            var sourceID = Memory.creeps[creepName].sourceID;
                            var sources = room.memory.sources;
                            sources.some(function (source) {
                                if (source.ID == sourceID) {
                                    source.minerCount--;
                                    return true;
                                }
                                return false;
                            });
                            break;
                    }
                    console.log(creepName + " died.");
                    Utils.remove(creeps, creepName);
                    delete Memory.creeps[creepName];
                }
            });
        }
    }
}

module.exports = MemoryCleaner;