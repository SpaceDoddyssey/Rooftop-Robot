class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        this.load.image('player', './assets/player.png')
        this.load.image('coin', './assets/cookie.png');
    }
    
    create() {
        if (game.settings.audioPlaying == false) {
            let backgroundMusic = this.sound.add('sfx_lobby');
            backgroundMusic.loop = true;
            //backgroundMusic.play();
            game.settings.audioPlaying = true;
        }
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // white borders
        this.gameOver = false;
        let rec = this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);

        this.playAreaLeftPad  = 320;
        this.playAreaRightPad = 35;

        // Score text
        const scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 170,
            setDepth: 0
        }

        const gameOverConfig = Object.assign({}, scoreConfig, { fontSize: '56px', align: 'center', fixedWidth: 375 });

        const restartConfig = Object.assign({}, scoreConfig, { align: 'center', fixedWidth: 380 });

        //Initialize score
        this.score = 0;
        this.totalScore = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, 'Score: ' + this.score, scoreConfig);

        //Spawn the background
        this.background = this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
        this.background.scale = 0.4;
        this.background.setDepth(-100);

        this.scrollingElements = [];
        //Spawn the player
        //this.player = this.physics.add.sprite

        //Spawns a pastry every [pastryFrequency] milliseconds
        //this.timer = this.time.addEvent({delay: pastryFrequency, callback: this.spawnPastry, callbackScope: this, loop: true });
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyEscape)) {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        }
        this.scrollingElements.forEach(element => {
            element.x -= runSpeed;
        });
    }
}