var Express = require('express');

// Create hte express app
var app = Express();
// Create the http server
var server = require('http').Server(app);
// Use socket.io for input and output
var io = require('socket.io').listen(server);

// Set the client root directory
app.use(Express.static(__dirname));
// Send the client the index file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Handler for user connections
io.on('connection', function (user) {
    console.log("Anonymous user has connected...");

    user.on("disconnect", function () {
        console.log("Anonymous user has disconnected...");
    })

});

// Start the server
server.listen(8081, function () {
    //This will just output what port we're listening on.
    console.log(`Listening on ${server.address().port}`);
});