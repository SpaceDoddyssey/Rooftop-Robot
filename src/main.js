let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth - 100,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let PlayButton, Ready;

let runSpeed = 5;
let jumpForce = 700;

let keyJump, keyAttack, keyDown, keyEscape, keyR;