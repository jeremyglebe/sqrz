// Create instance of a phaser game, with scaled size
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
// Add all the game states
game.state.add('Boot', Boot);
game.state.add('Sqrz', Sqrz);
// Start the game
game.state.start('Boot');
//# sourceMappingURL=app.js.map