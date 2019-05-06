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

// Tracking the squares that have been filled
var squares = [][10];
// Tracking the lines that have been connected
var grid = {};

// Handler for user connections
io.on('connection', function (user) {
    console.log("User has connected...");
    // Draw each of the lines in the collection
    for (key of Object.keys(grid)) {
        console.log(key);
        coords = key.split('_');
        user.emit("draw_line", {
            x: parseInt(coords[0]),
            y: parseInt(coords[1])
        },
            {
                x: parseInt(coords[2]),
                y: parseInt(coords[3])
            }
        );
    }
    // User message handlers
    user.on("disconnect", user_disconnect);
    user.on("draw_line", user_draw_line);
});

function user_disconnect() {
    console.log("User has disconnected...");
}

function user_draw_line(coords1, coords2) {
    if (valid_line(coords1, coords2)) {
        // console.log(coords1);
        // console.log(coords2);
        io.emit("draw_line", coords1, coords2);
        close = _closest_coord(coords1, coords2);
        far = _furthest_coord(coords1, coords2);
        close_string = close.x.toString() + '_' + close.y.toString();
        far_string = far.x.toString() + '_' + far.y.toString();
        grid[close_string + '_' + far_string] = true;
        // for (key of Object.keys(grid)) {
        //     console.log(key, grid[key]);
        // }
        try_score(close, far);
    }
}

function try_score(close, far) {
    // If it is a vertical line, check a possible left or right square
    if (_vertical(close, far)) {
        // Check the left square
        top_l = grid[(close.x - 1).toString() + '_' + close.y.toString() + '_' + close.x.toString() + '_' + close.y.toString()]
        bottom_l = grid[(far.x - 1).toString() + '_' + far.y.toString() + '_' + far.x.toString() + '_' + far.y.toString()]
        across_l = grid[(close.x - 1).toString() + '_' + close.y.toString() + '_' + (far.x - 1).toString() + '_' + far.y.toString()];
        if (top_l && bottom_l && across_l){
            console.log("Scored on left square!");
        }
    }
    // else {
    //     // else if horizontal, check a possible top or bottom square

    // }
}

function valid_line(coords1, coords2) {
    return _valid_distance(coords1, coords2);
}

function _closest_coord(coords1, coords2) {
    if (coords1.x < coords2.x || coords1.y < coords2.y)
        return coords1;
    else
        return coords2;
}

function _furthest_coord(coords1, coords2) {
    if (coords1.x > coords2.x || coords1.y > coords2.y)
        return coords1;
    else
        return coords2;
}

function _valid_distance(coords1, coords2) {
    return (Math.abs(coords1.x - coords2.x) == 1 || Math.abs(coords1.y - coords2.y) == 1)
        && (Math.abs(coords1.x - coords2.x) == 0 || Math.abs(coords1.y - coords2.y) == 0);
}

function _vertical(coords1, coords2) {
    return Math.abs(coords1.y - coords2.y) == 1;
}

// Start the server
server.listen(8081, function () {
    //This will just output what port we're listening on.
    console.log(`Listening on ${server.address().port}`);
});
