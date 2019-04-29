// Create instance of a phaser game, with scaled size
var game = new Phaser.Game(320, 320, Phaser.AUTO, 'game');

// Add all the game states
game.state.add('Boot', Boot);
game.state.add('Sqrz', Sqrz);

// Start the game
game.state.start('Boot');