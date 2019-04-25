// Create instance of a phaser game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
// Add all the game states
game.state.add('Sqrz', Sqrz);
// Start the game
game.state.start('Sqrz', true, false, game);
//# sourceMappingURL=app.js.map