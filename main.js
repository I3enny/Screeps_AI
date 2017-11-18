var MemoryCleaner = require('memoryCleaner');
var RoomHandler = require('roomHandler');
var Spawner = require('spawner');

module.exports.loop = function () {
    for (let room in Game.rooms) {
        var roomHandler = new RoomHandler(room);
        roomHandler.run();
    }
    for (let spawn in Game.spawns) {
        var spawner = new Spawner(spawn);
        spawner.run();
    }
    var memoryCleaner = new MemoryCleaner();
    memoryCleaner.run();
}