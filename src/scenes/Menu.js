class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_lobby', './assets/lobbymusic.wav');
        this.load.audio('sfx_fail', './assets/fail.wav');
        this.load.audio('sfx_success', './assets/positivebeep.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 4 - borderPadding, 'DOOM PATROL', menuConfig).setOrigin(0.5);
        let tutorialText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize, 'RUN FOR YOUR LIFE!\nSpace to jump\nEsc to return to menu', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        const PlayButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 6, 'PLAY', menuConfig).setOrigin(0.5).setInteractive();
        Ready = false;
        PlayButton.on('pointerdown', function (pointer)
        {
          this.setTint(0xff0000);
          Ready = true;
        });
        // define keys
    }

    update() {
      if (Ready == true) {
        game.settings = {
          audioPlaying: false
        }
        this.scene.start('playScene');
      }
    }
}