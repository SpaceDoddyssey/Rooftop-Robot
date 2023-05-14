class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        this.load.path = 'assets/';
        this.load.image('player',     'player.png')
        this.load.image('coin',       'coin.png')
        this.load.image('background', 'background.png')
        this.load.image('building',   'building.png')
        this.load.image('spikeball',  'spikeball.png')
        this.load.image('heart',      'heart.png')
        this.load.atlas('playerSpritesheet', 'playerSpritesheet.png', 'playerSpritesheet.json');
    }
    
    create() {
        if(game.settings.audioPlaying == false){
            this.bgm = this.sound.add('sfx_music', {volume: 0.2});
            this.bgm.loop = true;
            this.bgm.play();
            game.settings = {
                audioPlaying: true
            }
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
        let scoreConfig = {
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
            fixedWidth: 175,
            setDepth: 0
        }
        const gameOverConfig = Object.assign({}, scoreConfig, { fontSize: '56px', align: 'center', fixedWidth: 375 });
        const restartConfig  = Object.assign({}, scoreConfig, { align: 'center', fixedWidth: 380 });
        const highScoreConfig= Object.assign({}, scoreConfig, { fixedWidth: 260 });

        //Initialize score
        this.gameOver = false;
        this.score = 0;
        this.totalScore = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, 'Score: ' + this.score, scoreConfig);
        this.highScoreText = this.add.text(game.config.width-borderPadding-borderUISize-highScoreConfig.fixedWidth, borderUISize + borderPadding*2, "High Score:"+highScore, highScoreConfig);

        //Spawn the background
        this.background = this.add.tileSprite(0, 0, game.config.width * 2, 0, 'background').setOrigin(0, 0);
        this.background.tileScale = 0.5;
        this.background.setDepth(-100);

        //arrays and timers 
        this.coins = [];
        this.coinTimer = 50;
        this.buildings = [];
        this.buildingTimer = 0
        this.spikes = [];
        this.spikeTimer = 25;

        this.buildingGroup = this.physics.add.group();
        this.startBuilding = this.physics.add.sprite(600, game.config.height + 200, 'building').setOrigin(0.5, 0.5);
        this.startBuilding.scale = 1;
        this.startBuilding.setPushable(false);
        this.buildingGroup.add(this.startBuilding);
        this.buildings.push(this.startBuilding);

        //Spawn the player
        this.player = this.physics.add.sprite(80, game.config.height/2, 'playerSpritesheet').setOrigin(0.5);
        this.player.scale = 0.18;
        this.player.body.gravity.y = 1000;
        this.player.setPushable(true);
        this.physics.add.collider(this.player, this.buildingGroup);
        this.anims.create({
            key: 'rolling',
            frames: this.anims.generateFrameNames('playerSpritesheet', {
                prefix: 'player',
                start: 0,
                end: 7,
            }),
            defaultTextureKey: 'player',
            frameRate: 15,
            repeat: -1
        });
        this.player.anims.play('rolling');

        this.hearts = [];
        for(let i = 0; i < 3; i++){
            let heart = this.add.sprite(borderUISize * (3 + (i * 6)), 80, 'heart').setOrigin(0.5, 0.5);
            heart.scale = 0.1;
            this.hearts.push (heart);
        }

        this.physicsTimer = 0;
        this.pointsTimer = 0;
        this.difficultyScalar = 0;
        this.difficultyTimer = 0;
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.game.sound.stopAll();
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyEscape)) {
            this.game.sound.stopAll();
            game.settings = {
                audioPlaying: false
            }
            this.scene.start("menuScene");
        }

        if(!this.gameOver){
            if(this.player.y >= game.config.height + 100){
                this.GameOver();
                this.sound.play('sfx_fall');
            } 

            this.pointsTimer++;
            if(this.pointsTimer >= pointsRate){
                this.addScore(1);
                this.pointsTimer = 0;
            }

            this.background.tilePositionX += runSpeed / 2;

            this.coins.forEach(coin => {
                coin.x -= runSpeed;
                if(coin.x <= -coin.width) { coin.destroy(); }
                this.physics.overlap(this.player, coin, (player, collided) => {
                    coin.destroy();
                    collided.destroy();
                    this.addScore(20);
                    this.sound.play('sfx_coin');
                }, null, this);
            });
            this.spikes.forEach(spike => {
                spike.x -= runSpeed;
                if(spike.x <= -spike.width) { spike.destroy(); }
                this.physics.overlap(this.player, spike, (player, collided) => {
                    collided.destroy();
                    this.takeDamage();
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
            if(this.coinTimer <= 0){ this.spawnCoin(); }
            this.buildingTimer--;        
            if(this.buildingTimer <= 0){ this.spawnBuilding();}
            this.spikeTimer--;        
            if(this.spikeTimer <= 0){ this.spawnSpike();}
            this.difficultyTimer--;
            if(this.difficultyTimer <= 0){
                if(this.difficultyScalar < 120){
                    this.difficultyScalar++;
                }
                this.difficultyTimer = 40; 
            }
        }
    }

    takeDamage(){
        this.sound.play('sfx_hurt');
        console.log(this.hearts.length);
        let heart = this.hearts.pop();
        heart.destroy();
        if(this.hearts.length === 0){
            this.GameOver();    
        }
    }

    GameOver(){
        this.gameOver = true;
        this.hearts.forEach(element => { element.destroy(); });
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
        if(this.score > highScore){
            highScore = this.score;
            this.highScoreText.text = 'High Score: ' + highScore;
        }
    }

    spawnCoin(){
        var yPos = Phaser.Math.Between(game.config.height / 2 - 100, game.config.height / 2 + 50);
        var coin = this.physics.add.sprite(game.config.width + 5, yPos, 'coin').setOrigin(0.5, 0.5);
        coin.scale = 0.3;
        this.coins.push(coin);
        this.coinTimer = Phaser.Math.Between(100, 300);
    }
    spawnSpike(){
        var yPos = Phaser.Math.Between(game.config.height / 2 - 100, game.config.height / 2 + 50);
        var spike = this.physics.add.sprite(game.config.width + 5, yPos, 'spikeball').setOrigin(0.5, 0.5);
        spike.body.setCircle(150);
        //spike.body.setSize(spike.width, spike.height).
        spike.scale = 0.1;
        this.spikes.push(spike);
        this.spikeTimer = Phaser.Math.Between(200 - this.difficultyScalar, 300 - this.difficultyScalar * 2);
    }

    spawnBuilding(){
        var yPos = Phaser.Math.Between(game.config.height + 50, game.config.height + 100);
        var building = this.physics.add.sprite(game.config.width + 700, yPos, 'building').setOrigin(0.5, 0.5);
        building.scale = 0.7;
        building.setPushable(false);
        this.buildings.push(building);
        this.physics.collide(this.player, building);
        this.buildingTimer = 200;
        this.buildingGroup.add(building);
    }
}