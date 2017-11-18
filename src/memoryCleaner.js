var Utils = require('utils');

class MemoryCleaner {
    constructor() {
    }

    run() {
        for (let roomName in Game.rooms) {
            if (Game.rooms.hasOwnProperty(roomName)) {
                let room = Game.rooms[roomName];
                let creeps = room.memory.creeps;
                creeps.forEach(function (creepName) {
                    let creep = Game.creeps[creepName];
                    if (!creep) {
                        let role = Memory.creeps[creepName].role;
                        switch (role) {
                            case 'harvester':
                                let sourceID = Memory.creeps[creepName].sourceID;
                                let sources = room.memory.sources;
                                sources.some(function (source) {
                                    if (sourceID === source.ID) {
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
}

module.exports = MemoryCleaner;