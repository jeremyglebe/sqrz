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
// Player turn queue
var queue = [];
// Current player turn id
var plyid = null;
// Current player turn username
var plyname = null;
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
        console.log(players[user.id].username + " joined successfully!");
        // Update the leaderboard for all players
        update_leaderboard();
        // Make sure there is an active player
        if (!plyid) {
            next_turn();
        }
        // Make sure that they get the first user turn
        io.emit('next_turn', plyname);
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
    // Push the player to the turn order queue
    queue.push(user.id);
    // User message handlers
    user.on("disconnect", () => { user_disconnect(user) });
    user.on("draw_line", (c1, c2) => { user_draw_line(user, c1, c2) });
});

function next_turn() {
    queue.push(queue.shift());
    plyid = queue[0];
    plyname = players[plyid].username;
    console.log(plyname, plyid);
    // Inform clients who is playing next
    io.emit("next_turn", plyname);
    // Check if the game should restart
    restart = true;
    for (r = 0; r < 10; r++) {
        for (c = 0; c < 10; c++) {
            if (!squares[r][c]) {
                restart = false;
            }
        }
    }
    if (restart) {
        process.exit(0);
    }
}

function user_disconnect(user) {
    console.log("User has disconnected...");
    delete players[user.id];
    queue = queue.filter((val, ind, arr) => {
        return val != user.id;
    });
    if (plyid == user.id) {
        plyid = null;
        plyname = null;
        if (queue.length > 0) {
            next_turn();
        }
    }
    update_leaderboard();
}

function user_draw_line(user, coords1, coords2) {
    close = _closest_coord(coords1, coords2);
    far = _furthest_coord(coords1, coords2);
    close_string = close.x.toString() + '_' + close.y.toString();
    far_string = far.x.toString() + '_' + far.y.toString();
    full_string = close_string + '_' + far_string;
    if (valid_line(coords1, coords2) && !grid[full_string] && user.id == plyid) {
        io.emit("draw_line", coords1, coords2, players[user.id].color);
        grid[full_string] = true;
        if (!try_score(user, close, far)) {
            next_turn();
        }
    }
}

function try_score(user, close, far) {
    result = false;
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
            update_leaderboard();
            result = true;
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
            update_leaderboard();
            result = true;
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
            update_leaderboard();
            result = true;
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
            update_leaderboard();
            result = true;
        }
    }
    return result;
}

function update_leaderboard() {
    leaderboard = Object.keys(players).map(function (key) {
        return players[key];
    }).sort(function (a, b) {
        return a.score < b.score;
    });
    io.emit("update_leaderboard", leaderboard);
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
