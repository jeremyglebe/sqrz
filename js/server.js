var Express = require('express');
// Create hte express app
var app = Express();
// Create the http server
var server = require('http').Server(app);
// Use socket.io for input and output
var theio = require('socket.io').listen(server);
// Set the client root directory
app.use(Express.static(__dirname));
// Send the client the index file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
// Handler for user connections
theio.on('connection', function (user) {
    console.log("Anonymous user has connected...");
    user.on("draw_line", function (coords1, coords2) {
        if (valid_line(coords1, coords2)) {
            console.log(coords1);
            console.log(coords2);
            theio.emit("line_drawn", coords1, coords2);
        }
    });
    user.on("disconnect", function () {
        console.log("Anonymous user has disconnected...");
    });
});
// Start the server
server.listen(8081, function () {
    //This will just output what port we're listening on.
    console.log("Listening on " + server.address().port);
});
function valid_line(coords1, coords2) {
    // Checking distance
    var good_dist = false;
    // If the distance on one axis (and ONLY one axis) is equal to 30
    if ((Math.abs(coords1.x - coords2.x) == 30 || Math.abs(coords1.y - coords2.y) == 30)
        && !(Math.abs(coords1.x - coords2.x) == 30 && Math.abs(coords1.y - coords2.y) == 30)) {
        good_dist = true;
    }
    // Return results
    return good_dist;
}
//# sourceMappingURL=server.js.map