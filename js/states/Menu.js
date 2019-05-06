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
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Menu.prototype.create = function () {
        var _this = this;
        this.game.plugins.add(PhaserInput.Plugin);
        this.name_input = this.game.add.inputField(300, 350, {
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
        });
        // Create a connect button
        this.button = this.game.add.graphics(307, 400);
        // Draw the button
        this.button.beginFill(0xFFFFFF);
        this.button.drawRoundedRect(0, 0, 200, 50, 4);
        this.button.endFill();
        // Enable button input
        this.button.inputEnabled = true;
        // Create a listener
        this.button.events.onInputDown.add(function () {
            _this.username = _this.name_input.value;
            _this.game.state.start('Sqrz', true, false, _this.username);
        });
        // Add text to the button
        this.game.add.text(330, 410, "Join Game!", {
            fill: 'black'
        });
    };
    return Menu;
}(Phaser.State));
//# sourceMappingURL=Menu.js.map