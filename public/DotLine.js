var DotLine = function () { }
DotLine.prototype = {
    
    preload: function () {

    },

    create: function () {

        // Creating the dot
        this.theDot = game.add.graphics(100,100);
        this.theDot.beginFill(0xff0000);
        this.theDot.drawCircle(50, 50, 100);
        this.theDot.endFill();

        // Creating the line
        this.theLine = game.add.graphics(0,0);
        this.theLine.lineStyle(1, 0x0088FF, 1);

    },

    update: function () {
        this.theLine.clear();
        this.theLine.lineTo(this.theDot.x,this.theDot.y);
        this.theLine.moveTo(game.input.activePointer.x,game.input.activePointer.y);
    }

}