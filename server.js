var Express = require('express');
var app = Express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var totalCoins = 0;
var players = {};
app.use(Express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (user) {
    console.log("A new user has connected...");
    players[user.id] = null;
    user.on("I clicked a coin", function(){
        totalCoins++;
        players[user.id]++;
    })
    user.on("How many coins", function(){
        user.emit('Update coins', totalCoins);
    })
    user.on("disconnect", function(){
        totalCoins -= players[user.id];
        players[user.id] = null;
    })
});
server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});