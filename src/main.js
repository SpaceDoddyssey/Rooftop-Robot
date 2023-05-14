/*
Name: Cameron Dodd
Game Title: Rooftop Robot
Approx hours: 15-20
Creative tilt: Unfortunately I did not have time to add anything sufficiently interesting to qualify for this, 
as my mental health mysteriously nosedived at the start of the week at the same time that work for other classes became more difficult.
I'm a bit disappointed in my work this week and hope to put in a more exciting showing for the film adaptation project.
*/

let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI
let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let PlayButton, Ready;

// globals
let runSpeed = 5;
let jumpForce = 700;
let pointsRate = 10;
let highScore = 0;

let keyJump, keyEscape, keyR;