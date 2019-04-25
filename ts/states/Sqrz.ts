class Sqrz extends Phaser.State{

    // We are going to draw a dot with this.
    dot: Phaser.Graphics;

    // Function to create the initial game layout and world
    create(){
        this.dot = new Phaser.Graphics(this.game, 0, 0);
    }

    update(){

    }
}