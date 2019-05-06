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

// List of players
var players = {}
// Tracking the squares that have been filled
var squares = [[], [], [], [], [], [], [], [], [], []]
// Tracking the lines that have been connected
var grid = {};

// Handler for user connections
io.on('connection', function (user) {
    console.log("User has connected...");
    // Get the username of the player
    user.emit("request_username");
    // Create the new player object
    user.on("username", (name) => {
        color = Math.floor(Math.random() * 16777215)
        players[user.id] = {
            username: name,
            color: Math.floor(Math.random() * 16777215),
            score: 0
        }
    });
    // Draw each of the lines in the collection
    for (key of Object.keys(grid)) {
        // console.log(key);
        coords = key.split('_');
        user.emit("draw_line",
            {
                x: parseInt(coords[0]),
                y: parseInt(coords[1])
            },
            {
                x: parseInt(coords[2]),
                y: parseInt(coords[3])
            },
            0xFFFFFF
        );
    }
    // User message handlers
    user.on("disconnect", user_disconnect);
    user.on("draw_line", (c1, c2) => { user_draw_line(user, c1, c2) });
});

function user_disconnect() {
    console.log("User has disconnected...");
}

function user_draw_line(user, coords1, coords2) {
    close = _closest_coord(coords1, coords2);
    far = _furthest_coord(coords1, coords2);
    close_string = close.x.toString() + '_' + close.y.toString();
    far_string = far.x.toString() + '_' + far.y.toString();
    full_string = close_string + '_' + far_string;
    if (valid_line(coords1, coords2) && !grid[full_string]) {
        io.emit("draw_line", coords1, coords2, players[user.id].color);
        grid[full_string] = true;
        try_score(user, close, far);
    }
}

function try_score(user, close, far) {
    // If it is a vertical line, check a possible left or right square
    if (_vertical(close, far)) {
        // Check the left square
        top_l = grid[(close.x - 1).toString() + '_' + close.y.toString() + '_' + close.x.toString() + '_' + close.y.toString()]
        bottom_l = grid[(far.x - 1).toString() + '_' + far.y.toString() + '_' + far.x.toString() + '_' + far.y.toString()]
        across_l = grid[(close.x - 1).toString() + '_' + close.y.toString() + '_' + (far.x - 1).toString() + '_' + far.y.toString()];
        if (top_l && bottom_l && across_l && !squares[close.y][close.x - 1]) {
            // Mark the square as filled
            squares[close.y][close.x - 1] = true;
            // Increase the player's score
            players[user.id].score++;
            user.emit("update_score", players[user.id].score);
        }
        // Check the right square
        top_r = grid[close.x.toString() + '_' + close.y.toString() + '_' + (close.x + 1).toString() + '_' + close.y.toString()]
        bottom_r = grid[far.x.toString() + '_' + far.y.toString() + '_' + (far.x + 1).toString() + '_' + far.y.toString()]
        across_r = grid[(close.x + 1).toString() + '_' + close.y.toString() + '_' + (far.x + 1).toString() + '_' + far.y.toString()];
        if (top_r && bottom_r && across_r && !squares[close.y][close.x]) {
            // Mark the square as filled
            squares[close.y][close.x] = true;
            // Increase the player's score
            players[user.id].score++;
            user.emit("update_score", players[user.id].score);
        }
    } else {
        // else if horizontal, check a possible top or bottom square
        // Check the top square
        top_l = grid[close.x.toString() + '_' + (close.y - 1).toString() + '_' + close.x.toString() + '_' + close.y.toString()];
        top_r = grid[far.x.toString() + '_' + (far.y - 1).toString() + '_' + far.x.toString() + '_' + far.y.toString()];
        top = grid[close.x.toString() + '_' + (close.y - 1).toString() + '_' + far.x.toString() + '_' + (far.y - 1).toString()];
        if (top && top_l && top_r && !squares[close.y - 1][close.x]) {
            // Mark the square as filled
            squares[close.y - 1][close.x] = true;
            // Increase the player's score
            players[user.id].score++;
            user.emit("update_score", players[user.id].score);
        }
        // Check the bottom square
        bottom_l = grid[close.x.toString() + '_' + close.y.toString() + '_' + close.x.toString() + '_' + (close.y + 1).toString()];
        bottom_r = grid[far.x.toString() + '_' + far.y.toString() + '_' + far.x.toString() + '_' + (far.y + 1).toString()];
        bottom = grid[close.x.toString() + '_' + (close.y + 1).toString() + '_' + far.x.toString() + '_' + (far.y + 1).toString()];
        if (bottom_l && bottom_r && bottom && !squares[close.y][close.x]) {
            // Mark the square as filled
            squares[close.y][close.x] = true;
            // Increase the player's score
            players[user.id].score++;
            user.emit("update_score", players[user.id].score);
        }
    }
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
