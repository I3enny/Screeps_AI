let MemoryCleaner = require('memoryCleaner');
let RoomHandler = require('roomHandler');
let Spawner = require('spawner');

module.exports.loop = function () {
    for (let room in Game.rooms) {
        if (Game.rooms.hasOwnProperty(room)) {
            let roomHandler = new RoomHandler(room);
            roomHandler.run();
        }
    }
    for (let spawn in Game.spawns) {
        if (Game.spawns.hasOwnProperty(spawn)) {
            let spawner = new Spawner(spawn);
            spawner.run();
        }
    }

    let memoryCleaner = new MemoryCleaner();
    memoryCleaner.run();
};