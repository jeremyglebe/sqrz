

// This state represents the actual gameplay

class Sqrz extends Phaser.State {

    // Group of dots for the grid
    nodes: Phaser.Group;
    // Main pointer of the game
    ptr: Phaser.Pointer;
    // Graphical representation of the user's line
    line: Phaser.Graphics;
    // Sprite that the user is drawing a line from
    line_origin: Phaser.Sprite;
    // Server connection object
    server: SocketIOClient.Socket;
    // Player's score text
    score_text: Phaser.Text;
    // Player's username
    username: string;
    // Text displays for the scores of the top players
    board_display: Phaser.Text[];

    init(name: string) {
        this.username = name;
    }

    // Function to create the initial game layout and world
    create() {
        // Log that we've entered the state
        console.log("State: Sqrz")

        // Connection to the server
        this.server = io();

        //Initialize the game pointer
        this.ptr = this.game.input.activePointer;
        // Initialize the line origin (no origin until a dot is clicked)
        this.line_origin = null;
        // Initialize the dots group
        this.nodes = this.game.add.group();
        // Enabled input on the dots
        this.nodes.inputEnableChildren = true;
        // Create a graphics object to draw lines
        this.line = this.game.add.graphics(0, 0);
        // Player's score text
        this.score_text = this.game.add.text(15, 15, "Score: 0", { fill: 'white' });
        // leaderboard
        this.board_display = [];

        // Draw all the dots
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 11; c++) {
                this.game.add.graphics(this._x(c), this._y(r), this.nodes);
            }
        }
        this.create_nodes();

        // Call handler when receiving message from server
        this.server.on('draw_line', (coords1, coords2, color) => {
            // console.log("Server says draw a line");
            this.server_draw_line(this.game, coords1, coords2, color);
        });

        // Handle request from server for username
        this.server.on("request_username", () => {
            this.server.emit("username", this.username);
        });

        // Handle updating score
        this.server.on("update_score", (myscore) => {
            this.score_text.text = "Score: " + myscore.toString();
        });

        // Handle updating the leaderboard
        this.server.on("update_leaderboard", (leaderboard) => {
            this.server_update_leaderboard(this.game, leaderboard);
        });
    }

    update() {
        this.update_cursor_line();
    }

    // Draw the game grid
    create_nodes() {
        // Draw the circles
        this.nodes.forEach((dot: Phaser.Graphics) => {
            // Set the fill color
            dot.beginFill(0xFFFFFF);
            // Draw the circle
            dot.drawCircle(0, 0, 20);
            // End the filling
            dot.endFill();
        }, this, true);

        // Handle clicking on dots (should start a line)
        this.nodes.onChildInputDown.add((sprite: Phaser.Sprite, cursor: Phaser.Pointer) => {
            this.line_origin = sprite;
        }, this)

        // Handle releasing a click on a dot (tries to make a new permanent line)
        this.nodes.onChildInputUp.add(this.handle_node_click, this);
    }

    handle_node_click(sprite: Phaser.Sprite, cursor: Phaser.Pointer) {
        // Remove the click origin point (as the click is over)
        this.line_origin = null;
        // console.log("Connected two dots");
        let sprite1 = sprite;
        let sprite2 = cursor.targetObject.sprite;
        // Send a message to the server
        this.server.emit('draw_line',
            {
                x: this._column(sprite1.x),
                y: this._row(sprite1.y)
            },
            {
                x: this._column(sprite2.x),
                y: this._row(sprite2.y)
            }
        );
    }

    server_draw_line(game, coords1, coords2, color: number) {
        // console.log("Drawing line");
        let new_line: Phaser.Graphics = game.add.graphics(0, 0);
        // Line style for the line
        new_line.lineStyle(4, color);
        new_line.moveTo(this._x(coords1.x), this._y(coords1.y));
        new_line.lineTo(this._x(coords2.x), this._y(coords2.y));
    }

    server_update_leaderboard(game: Phaser.Game, leaderboard) {
        console.log("Update leaderboard called");
        // Delete everything else
        this.board_display.forEach((text) => {
            text.destroy();
        });
        this.board_display = [];
        // Add all the texts for the leaders
        for (let i = 0; i < 5; i++) {
            if (leaderboard[i]) {
                this.board_display.push(game.add.text(700, 20 * i + 20,
                    leaderboard[i].username + ': ' + leaderboard[i].score,
                    {
                        fill: '#' + leaderboard[i].color.toString(16),
                        font: '10pt Arial'
                    }));
            }
        }
    }

    update_cursor_line() {
        // Clear the line
        this.line.clear();
        // Check if we should be drawing a line
        if (this.line_origin) {
            // Line style for the line
            this.line.lineStyle(4, 0xFF0000);
            // Draw from the mouse
            this.line.moveTo(this.ptr.x, this.ptr.y);
            // Draw to the center (the dot)
            this.line.lineTo(this.line_origin.x, this.line_origin.y);
        }
    }

    _column(x: number) {
        return (x - 240) / 30;
    }

    _row(y: number) {
        return (y - 50) / 30;
    }

    _x(column: number) {
        return column * 30 + 240
    }

    _y(row: number) {
        return row * 30 + 50
    }

}