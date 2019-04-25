class Sqrz extends Phaser.State{

    // We are going to draw a dot with this.
    canvas: Phaser.Graphics;

    // Function to create the initial game layout and world
    create(){
        // Log that we've entered the state
        console.log("State: Sqrz")
        // Create a graphics object for the dot and line
        this.canvas = this.game.add.graphics(0, 0);
        // Set the fill color
        this.canvas.beginFill(0xFFFFFF);
        // Draw the circle
        this.canvas.drawCircle(this.game.width / 2, this.game.height / 2, 100);
        // End the filling
        this.canvas.endFill();
    }

    update(){
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
    }
}