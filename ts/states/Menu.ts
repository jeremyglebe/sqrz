class Menu extends Phaser.State {

    name_input: PhaserInput.InputField;
    button: Phaser.Graphics;
    username: string;

    create() {
        this.game.plugins.add(PhaserInput.Plugin);

        this.name_input = this.game.add.inputField(300, 350,
            {
                font: '18px Arial',
                fill: '#212121',
                fontWeight: 'bold',
                width: 200,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: 'Username',
                type: PhaserInput.InputType.text
            }
        );

        // Create a connect button
        this.button = this.game.add.graphics(307, 400);
        // Draw the button
        this.button.beginFill(0xFFFFFF);
        this.button.drawRoundedRect(0, 0, 200, 50, 4);
        this.button.endFill();
        // Enable button input
        this.button.inputEnabled = true;
        // Create a listener
        this.button.events.onInputDown.add(() => {
            this.username = this.name_input.value;
            this.game.state.start('Sqrz', true, false, this.username);
        });
        // Add text to the button
        this.game.add.text(330, 410, "Join Game!", {
            fill: 'black'
        });
    }

}