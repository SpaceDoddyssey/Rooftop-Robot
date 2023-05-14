class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_music', './assets/sfx_music.mp3');
        this.load.audio('sfx_hurt',  './assets/sfx_hurt.wav');
        this.load.audio('sfx_coin',  './assets/sfx_coin.wav');
        this.load.audio('sfx_fall',  './assets/sfx_fall.mp3');
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

        game.settings = {
          audioPlaying: false
        }
        Ready = false;

        // show menu text
        let titleText = this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 6 - borderPadding, 'DOOM PATROL', menuConfig).setOrigin(0.5);
        let tutorialText = this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'RUN FOR YOUR LIFE!\nSpace to jump\nEsc to return to menu', menuConfig).setOrigin(0.5);
        let creditsText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 14, 'All art and coding by Cameron Dodd\nSound effects generated with https://sfxr.me/\nMusic courtesy of Youtube Audio Library', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        const PlayButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 6, 'PLAY', menuConfig).setOrigin(0.5).setInteractive();
        
        PlayButton.on('pointerdown', function (pointer)
        {
          this.setTint(0xff0000);
          Ready = true;
        });

    }

    update() {
      if (Ready == true) {
        this.scene.start('playScene');
      }
    }
}