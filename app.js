var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var world = require('./js/server_world');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/tvr.html');
});
*/

app.get('/vr', function(req, res){
    res.sendFile(__dirname + '/webvr.html');
});

app.get('/xvr', function(req, res){
    res.sendFile(__dirname + '/webxvr.html');
});

app.get('/sky', function(req, res){
    res.sendFile(__dirname + '/webgl_shaders_sky.html');
});

// Add code to adjust public/static folders
app.use(express.static('public'));


app.get('/js/client_world.js', function(req, res){
    res.sendFile(__dirname + '/js/client_world.js');
});

/*
app.get('/js/cw.js', function(req, res){
    res.sendFile(__dirname + '/js/cw.js');
});
*/


io.on('connection', function(socket){
    console.log('a user connected');

    var id = socket.id;
    world.addPlayer(id);

    var player = world.playerForId(id);
    socket.emit('createPlayer', player);

    socket.broadcast.emit('addOtherPlayer', player);

    socket.on('requestOldPlayers', function(){
        for (var i = 0; i < world.players.length; i++){
            if (world.players[i].playerId != id)
                socket.emit('addOtherPlayer', world.players[i]);
        }
    });
    socket.on('updatePosition', function(data){
        var newData = world.updatePlayerData(data);
        socket.broadcast.emit('updatePosition', newData);
    });

    socket.on('lookingAtCube', function(cube_name){
        console.log(socket.id + ' is looking at ' + cube_name);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('removeOtherPlayer', player);
        world.removePlayer( player );
    });

});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
});

/*
http.listen(3000, function(){
   console.log('listening on *: 3000');
});
*/
