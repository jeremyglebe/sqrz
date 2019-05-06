// This state represents the actual gameplay
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sqrz = /** @class */ (function (_super) {
    __extends(Sqrz, _super);
    function Sqrz() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sqrz.prototype.preload = function () {
    };
    // Function to create the initial game layout and world
    Sqrz.prototype.create = function () {
        var _this = this;
        // Log that we've entered the state
        console.log("State: Sqrz");
        // Connection to the server
        // IGNORE THIS ERROR AND EVERYTHING WILL WORK
        // ITS JUST A TYPESCRIPT TYPINGS ERROR IDK
        this.server = io();
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
        for (var r = 0; r < 11; r++) {
            for (var c = 0; c < 11; c++) {
                this.game.add.graphics(c * 30 + 240, r * 30 + 60, this.dots);
            }
        }
        this.init_grid();
        // Call handler when receiving message from server
        this.server.on('line_drawn', function (coords1, coords2) {
            _this.serverLineDrawn(_this.game, coords1, coords2);
        });
    };
    Sqrz.prototype.update = function () {
        this.draw_line();
    };
    // Draw the game grid
    Sqrz.prototype.init_grid = function () {
        var _this = this;
        // Draw the circles
        this.dots.forEach(function (dot) {
            // Set the fill color
            dot.beginFill(0xFFFFFF);
            // Draw the circle
            dot.drawCircle(0, 0, 20);
            // End the filling
            dot.endFill();
        }, this, true);
        // Handle clicking on dots (should start a line)
        this.dots.onChildInputDown.add(function (sprite, cursor) {
            _this.line_origin = sprite;
        }, this);
        // Handle releasing a click on a dot (tries to make a new permanent line)
        this.dots.onChildInputUp.add(function (sprite, cursor) {
            _this.line_origin = null;
            // Draw a new permanent line between dots (through the server)
            if (cursor.targetObject && _this.dots.contains(cursor.targetObject.sprite)) {
                console.log("Connected two dots");
                var sprite1 = sprite;
                var sprite2 = cursor.targetObject.sprite;
                // Send a message to the server
                _this.server.emit('draw_line', {
                    x: sprite1.x,
                    y: sprite1.y
                }, {
                    x: sprite2.x,
                    y: sprite2.y
                });
            }
        }, this);
    };
    Sqrz.prototype.draw_grid = function () {
        // Draw the circles
        this.dots.forEach(function (dot) {
            // Set the fill color
            dot.beginFill(0xFFFFFF);
            // Draw the circle
            dot.drawCircle(0, 0, 20);
            // End the filling
            dot.endFill();
        }, this, true);
    };
    Sqrz.prototype.draw_line = function () {
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
        }
    };
    Sqrz.prototype.serverLineDrawn = function (game, coords1, coords2) {
        var new_line = game.add.graphics(0, 0);
        // Line style for the line
        new_line.lineStyle(2, 0x00FF00);
        new_line.moveTo(coords1.x, coords1.y);
        new_line.lineTo(coords2.x, coords2.y);
        // Draw the grid back over the lines
        this.draw_grid();
    };
    return Sqrz;
}(Phaser.State));
//# sourceMappingURL=Sqrz.js.map