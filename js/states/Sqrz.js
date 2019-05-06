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
        // Draw all the dots
        for (var r = 0; r < 11; r++) {
            for (var c = 0; c < 11; c++) {
                this.game.add.graphics(this._x(c), this._y(r), this.nodes);
            }
        }
        this.create_nodes();
        // Call handler when receiving message from server
        this.server.on('draw_line', function (coords1, coords2) {
            // console.log("Server says draw a line");
            _this.server_draw_line(_this.game, coords1, coords2);
        });
    };
    Sqrz.prototype.update = function () {
        this.update_cursor_line();
    };
    // Draw the game grid
    Sqrz.prototype.create_nodes = function () {
        var _this = this;
        // Draw the circles
        this.nodes.forEach(function (dot) {
            // Set the fill color
            dot.beginFill(0xFFFFFF);
            // Draw the circle
            dot.drawCircle(0, 0, 20);
            // End the filling
            dot.endFill();
        }, this, true);
        // Handle clicking on dots (should start a line)
        this.nodes.onChildInputDown.add(function (sprite, cursor) {
            _this.line_origin = sprite;
        }, this);
        // Handle releasing a click on a dot (tries to make a new permanent line)
        this.nodes.onChildInputUp.add(this.handle_node_click, this);
    };
    Sqrz.prototype.handle_node_click = function (sprite, cursor) {
        // Remove the click origin point (as the click is over)
        this.line_origin = null;
        // console.log("Connected two dots");
        var sprite1 = sprite;
        var sprite2 = cursor.targetObject.sprite;
        // Send a message to the server
        this.server.emit('draw_line', {
            x: this._column(sprite1.x),
            y: this._row(sprite1.y)
        }, {
            x: this._column(sprite2.x),
            y: this._row(sprite2.y)
        });
    };
    Sqrz.prototype.server_draw_line = function (game, coords1, coords2) {
        // console.log("Drawing line");
        var new_line = game.add.graphics(0, 0);
        // Line style for the line
        new_line.lineStyle(4, 0x00FF00);
        new_line.moveTo(this._x(coords1.x), this._y(coords1.y));
        new_line.lineTo(this._x(coords2.x), this._y(coords2.y));
    };
    Sqrz.prototype.update_cursor_line = function () {
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
    };
    Sqrz.prototype._column = function (x) {
        return (x - 240) / 30;
    };
    Sqrz.prototype._row = function (y) {
        return (y - 50) / 30;
    };
    Sqrz.prototype._x = function (column) {
        return column * 30 + 240;
    };
    Sqrz.prototype._y = function (row) {
        return row * 30 + 50;
    };
    return Sqrz;
}(Phaser.State));
//# sourceMappingURL=Sqrz.js.map