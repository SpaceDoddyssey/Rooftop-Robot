class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        this.load.path = 'assets/';
        this.load.image('player',     'player.png')
        this.load.image('coin',       'cookie.png')
        this.load.image('background', 'background.png')
        this.load.image('building',   'building.png')
    }
    
    create() {
        if (game.settings.audioPlaying == false) {
            // let backgroundMusic = this.sound.add('sfx_lobby');
            // backgroundMusic.loop = true;
            // //backgroundMusic.play();
            // game.settings.audioPlaying = true;
        }
        keyJump   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyDown   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyR      = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // white borders
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

        // Text configs
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
        const restartConfig  = Object.assign({}, scoreConfig, { align: 'center', fixedWidth: 380 });

        //Initialize score
        this.gameOver = false;
        this.score = 0;
        this.totalScore = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, 'Score: ' + this.score, scoreConfig);

        //Spawn the background
        this.background = this.add.tileSprite(0, 0, game.config.width * 2, 0, 'background').setOrigin(0, 0);
        this.background.tileScale = 0.5;
        this.background.setDepth(-100);

        this.coins = [];
        this.coinTimer = 50;
        this.buildings = [];
        this.buildingTimer = 0

        this.buildingGroup = this.physics.add.group();
        this.startBuilding = this.physics.add.sprite(600, game.config.height + 200, 'building').setOrigin(0.5, 0.5);
        this.startBuilding.scale = 1.5;
        this.startBuilding.setPushable(false);
        this.buildingGroup.add(this.startBuilding);
        this.buildings.push(this.startBuilding);

        //Spawn the player
        this.player = this.physics.add.sprite(80, game.config.height/2, 'player').setOrigin(0.5);
        this.player.scale = 0.12;
        this.player.body.gravity.y = 1000;
        this.player.setPushable(true);
        this.physics.add.collider(this.player, this.buildingGroup);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyEscape)) {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        }

        if(!this.gameOver){
            if(this.player.y >= game.config.height + 100){
                this.GameOver();
            } 

            this.background.tilePositionX += runSpeed / 2;

            this.coins.forEach(coin => {
                coin.x -= runSpeed;
                if(coin.x <= -coin.width) { coin.destroy(); }
                this.physics.overlap(this.player, coin, (player, collided) => {
                    coin.destroy();
                    collided.destroy();
                    this.addScore(1);
                }, null, this);
            });
            this.buildings.forEach(building => {
                building.x -= runSpeed;
                if(building.x <= -building.width) { building.destroy(); }
            });
            if (keyJump.isDown && this.player.body.onFloor()) {
                this.player.body.velocity.y = -jumpForce;
            }

            this.coinTimer--;
            if(this.coinTimer <= 0){
                this.spawnCoin();
            }
            
            this.buildingTimer--;        
            if(this.buildingTimer <= 0){
                this.spawnBuilding();
            }
        }
    }

    GameOver(){
        this.gameOver = true;
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
        let gameOverText = this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 4 - borderPadding, 'GAME OVER', menuConfig).setOrigin(0.5);
        let gameOverTutText = this.add.text(game.config.width/2, game.config.height/2 - borderPadding, 'Press R to restart,\nor Esc to return to menu', menuConfig).setOrigin(0.5);
    }

    addScore(amount){
        this.score += amount;
        this.totalScore.text = 'Score: ' + this.score;
    }

    spawnCoin(){
        var yPos = Phaser.Math.Between(game.config.height / 2 - 100, game.config.height / 2 + 50);
        var coin = this.physics.add.sprite(game.config.width + 5, yPos, 'coin');
        coin.scale = 0.08;
        //coin.body.gravity.y = 0;
        this.coins.push(coin);
        this.coinTimer = Phaser.Math.Between(100, 300);
    }

    spawnBuilding(){
        var yPos = Phaser.Math.Between(game.config.height + 50, game.config.height + 100);
        var building = this.physics.add.sprite(game.config.width + 700, yPos, 'building').setOrigin(0.5, 0.5);
        building.scale = 0.7;
        building.setPushable(false);
        this.buildings.push(building);
        this.physics.collide(this.player, building);
        this.buildingTimer = Phaser.Math.Between(200, 200);
        this.buildingGroup.add(building);
    }
}