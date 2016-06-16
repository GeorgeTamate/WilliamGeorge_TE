var players = [];

function Player(color){

    this.playerId = players.length;
    this.x = 1;
    this.y = 0;
    this.z = 1;
    this.r_x = 0;
    this.r_y = 0;
    this.r_z = 0;
    this.sizeX = 1;
    this.sizeY = 1;
    this.sizeZ = 1;
    this.speed = 0.1;
    this.turnSpeed = 0.03;
    this.color = color;
    this.zoom = 6;

}

function RandomColor()
{

    var color_list = [0xffff00, 0xF22613, 0xDB0A5B, 0x446CB3, 0x03C9A9, 0xF89406, 0xEB9532, 0x00B16A];

    return color_list[Math.floor(Math.random() * color_list.length)];;
}

var addPlayer = function(id){

    var player = new Player(RandomColor());
    player.playerId = id;
    players.push( player );

    return player;
};

var removePlayer = function(player){

    var index = players.indexOf(player);

    if (index > -1) {
        players.splice(index, 1);
    }
};

var updatePlayerData = function(data){
    var player = playerForId(data.playerId);
    player.x = data.x;
    player.y = data.y;
    player.z = data.z;
    player.r_x = data.r_x;
    player.r_y = data.r_y;
    player.r_z = data.r_z;

    return player;
};

var playerForId = function(id){

    var player;
    for (var i = 0; i < players.length; i++){
        if (players[i].playerId === id){

            player = players[i];
            break;

        }
    }

    return player;
};

module.exports.players = players;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;