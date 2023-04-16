const express = require('express');
const app = express();
const http = require('http');
const { platform } = require('os');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
 
app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/resorces/index.html');
});

var Socket_list={};

var Player_list={};
var Player = function (id){
    var self = {
        x:0,
        y:0,
        id:id,
        number: ""+Math.floor(10*Math.random())
    }
    return self
}



// Player.onConnect = function(socket){
// 	var player = Player(socket.id);
// 	socket.on('keyPress',function(data){
// 	});
// }

// Player.onDisconnect = function(socket){
// 	delete Player.list[socket.id];
// }

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.id = Math.random();
  Socket_list[socket.id] = socket;
  var player = Player(socket.id);
  Player_list[socket.id] = player;

  // Player.onConnect(socket);

  socket.on('disconnect', function(){
    //  delete Socket_list[socket.id];
    //  Player.onDisconnect(socket);
     delete Socket_list[socket.id];
		 delete Player_list[socket.id];

  });

  socket.on('sendMsgToServer', function(data){
      var playerName = ("" + socket.id).slice(2,7);
      for(var i in Socket_list){
        Socket_list[i].emit('addToChat', playerName + ': ' + data);
      }
  });


});

// setInterval (function (){
//     var pack=[];
//     for(var i in Player_list){
//         var player = Player_list[i];
//         player.x++;
//         player.y++;
//         pack.push({
//             x:player.x++,
//             y:player.y++,
//             number:player.number
//         });
//     }
//     for(var i in Socket_list){
//     var socket = Socket_list[i];
//     socket.emit('newPositions',pack);
// }
// },1000/25);

server.listen(3000, () => {
  console.log('listening on *:3000');
});