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
        // Log that we've entered the state
        console.log("State: Sqrz");
        // Create a graphics object for the dot and line
        this.canvas = this.game.add.graphics(0, 0);
        // Set the fill color
        this.canvas.beginFill(0xFFFFFF);
        // Draw the circle
        this.canvas.drawCircle(this.game.width / 2, this.game.height / 2, 100);
        // End the filling
        this.canvas.endFill();
    };
    Sqrz.prototype.update = function () {
        // Clear the graphics
        this.canvas.clear();
        // Set the fill color of the circle
        this.canvas.beginFill(0xFFFFFF);
        // Draw the circle
        this.canvas.drawCircle(this.game.width / 2, this.game.height / 2, 100);
        // End the filling of the circle
        this.canvas.endFill();
        // Line style for the line
        this.canvas.lineStyle(15, 0xFF0000);
        // Draw from the mouse
        this.canvas.moveTo(this.game.input.activePointer.x, this.game.input.activePointer.y);
        // Draw to the center (the dot)
        this.canvas.lineTo(this.game.width / 2, this.game.height / 2);
    };
    return Sqrz;
}(Phaser.State));
//# sourceMappingURL=Sqrz.js.map