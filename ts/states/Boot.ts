// Handles initial setup for the game

class Boot extends Phaser.State {

    device: DeviceService;

    constructor() {
        super();
        this.device = DeviceService.Instance;
    }

    create() {
        // Log that we've entered the state
        console.log("State: Boot");

        // Get the length of the shortest side of the screen
        var device_size = this.device.width < this.device.height ? this.device.width : this.device.height;
        console.log("device_size = ", device_size);

        // Set the scale mode to stay proportional
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Set the maximum scaling
        if (device_size > 320) {
            this.game.scale.setMinMax(320, 320, device_size, device_size);
        } else {
            this.game.scale.setMinMax(320, 320, 320, 320);
        }

        // Start the next state
        this.game.state.start('Sqrz');

    }

}