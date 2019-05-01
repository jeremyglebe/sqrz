

// This state represents the actual gameplay

class Sqrz extends Phaser.State {

    // Group of dots for the grid
    dots: Phaser.Group;
    // Main pointer of the game
    ptr: Phaser.Pointer;
    // Graphical representation of the user's line
    line: Phaser.Graphics;
    // Sprite that the user is drawing a line from
    line_origin: Phaser.Sprite;
    // Server connection object
    server: SocketIO.Server;

    preload() {
    }

    // Function to create the initial game layout and world
    create() {
        // Log that we've entered the state
        console.log("State: Sqrz")

        // Connection to the server
        this.server = SocketIO();

        //Initialize the game pointer
        this.ptr = this.game.input.activePointer;
        // Initialize the line origin (no origin until a dot is clicked)
        this.line_origin = null;
        // Initialize the dots group
        this.dots = this.game.add.group();
        // Enabled input on the dots
        this.dots.inputEnableChildren = true;
        // Create a graphics object to draw lines
        this.line = this.game.add.graphics(0, 0);

        // Draw all the dots
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 11; c++) {
                this.game.add.graphics(c * 20 + 10, r * 20 + 10, this.dots);
            }
        }
        this.draw_grid();

        // Call handler when receiving message from server
        this.server.on('line_drawn', this.serverLineDrawn);
    }

    update() {
        this.draw_line();
    }

    // Draw the game grid
    draw_grid() {
        // Draw the circles
        this.dots.forEach((dot: Phaser.Graphics) => {
            // Set the fill color
            dot.beginFill(0xFFFFFF);
            // Draw the circle
            dot.drawCircle(0, 0, 10);
            // End the filling
            dot.endFill();
        }, this, true);

        // Handle clicking on dots (should start a line)
        this.dots.onChildInputDown.add((sprite: Phaser.Sprite, cursor: Phaser.Pointer) => {
            this.line_origin = sprite;
        }, this)

        // Handle releasing a click on a dot (tries to make a new permanent line)
        this.dots.onChildInputUp.add((sprite: Phaser.Sprite, cursor: Phaser.Pointer) => {
            this.line_origin = null;
            // Draw a new permanent line between dots
            if (cursor.targetObject && this.dots.contains(cursor.targetObject.sprite)) {
                console.log("Connected two dots");
                let sprite1 = sprite;
                let sprite2 = cursor.targetObject.sprite;
                let new_line = this.game.add.graphics(0, 0);
                // Line style for the line
                new_line.lineStyle(2, 0x00FF00);
                // Draw from the mouse
                new_line.moveTo(sprite1.x, sprite1.y);
                // Draw to the center (the dot)
                new_line.lineTo(sprite2.x, sprite2.y);
            }
        }, this)
    }

    draw_line() {
        // Clear the line
        this.line.clear();
        // Check if we should be drawing a line
        if (this.line_origin) {
            // Line style for the line
            this.line.lineStyle(2, 0xFF0000);
            // Draw from the mouse
            this.line.moveTo(this.ptr.x, this.ptr.y);
            // Draw to the center (the dot)
            this.line.lineTo(this.line_origin.x, this.line_origin.y);
            // Send a message to the server
            this.server.emit('draw_line',
                {
                    x: this.ptr.x,
                    y: this.ptr.y
                },
                {
                    x: this.line_origin.x,
                    y: this.line_origin.y
                }
            );
        }
    }

    serverLineDrawn(coords1, coords2) {
        let new_line = this.game.add.graphics(0, 0);
        // Line style for the line
        new_line.lineStyle(2, 0x00FF00);
        new_line.moveTo(coords1.x, coords1.y);
        new_line.lineTo(coords2.x, coords2.y);
    }

}