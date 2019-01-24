(function() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowScale = windowWidth / windowHeight;

  // ----------
  class Onion {
    // ----------
    constructor() {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          gravity: {
            y: 300
          },
          debug: false
        },
        scene: {
          preload,
          create,
          update
        }
      };

      const game = new Phaser.Game(config);

      let gameOver = false;
      let score = 0;
      let scoreText, highScoreText, gameOverText;
      let highScore = localStorage.getItem('highscore') ?
        localStorage.getItem('highscore') :
        0;

      // ----------
      function preload() {
        console.log('preload');
        this.load.image('sky', '../src/assets/sky.png');
        this.load.image('ground', '../src/assets/platform.png');
        this.load.image('star', '../src/assets/star.png');
        this.load.image('bomb', '../src/assets/bomb.png');
        this.load.spritesheet('dude', '../src/assets/dude.png', {
          frameWidth: 32,
          frameHeight: 48
        });
      }

      // ----------
      function create() {
        console.log('create');

        // Sky
        this.add.image(400, 300, 'sky');

        // Score
        scoreText = this.add.text(16, 38, 'score: 0', {
          fontSize: '25px',
          fill: '#000'
        });
        highScoreText = this.add.text(16, 16, 'high score: ' + highScore, {
          fontSize: '25px',
          fill: '#000'
        });
        gameOverText = this.add.text(520, 10, '', {
          fontSize: '16px',
          fill: '#000'
        });

        // Platforms Group
        this.platforms = this.physics.add.staticGroup();
        this.platforms
          .create(400, 568, 'ground')
          .setScale(2)
          .refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // Stars
        this.stars = this.physics.add.group({
          key: 'star',
          repeat: 1,
          setXY: { x: 0, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function(child) {
          child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.8));
          child.body.setGravityY(300);
          child.setCollideWorldBounds(true);
        });

        // Player
        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'turn',
          frames: [{ key: 'dude', frame: 4 }],
          frameRate: 20
        });

        this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'jump-right',
          frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 6 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'jump-left',
          frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        // Baddie
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

        // Set Player Gravity
        this.player.body.setGravityY(300);

        // Player/Platform Collide Behavior
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        // Player/Star Overlap Behavior
        this.physics.add.overlap(
          this.player,
          this.stars,
          collectStar,
          null,
          this
        );

        // Keyboard Input Init
        this.cursors = this.input.keyboard.createCursorKeys();
      }

      // ----------
      function update() {
        console.log('update');

        // Left, Right handler
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-250);
          this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(250);
          this.player.anims.play('right', true);
        } else {
          this.player.setVelocityX(0);
          this.player.anims.play('turn');
        }

        // Space handler
        if (this.cursors.space.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-330);
        }

        if (this.cursors.space.isDown && this.cursors.left.isDown) {
          this.player.anims.play('jump-left', true);
          this.player.anims.stop('left', true);
        } else if (this.cursors.space.isDown && this.cursors.right.isDown) {
          this.player.anims.play('jump-right', true);
          this.player.anims.stop('right', true);
        }

        if (gameOver) {
          if (this.cursors.space.isDown) {
            gameOver = false;
            this.scene.restart();
          }
        }
      }

      function collectStar(player, star) {
        star.disableBody(true, true);

        let bombVelocityY = 0;

        score += 10;
        scoreText.setText('Score: ' + score);
        setHighScore();

        if (this.stars.countActive(true) === 0) {
          bombVelocityY += 50;
          this.stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
          });

          let x =
            player.x < 400 ?
              Phaser.Math.Between(400, 800) :
              Phaser.Math.Between(0, 400);

          let bomb = this.bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(0, 200), bombVelocityY);
        }
      }

      function hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        setGameOverText();
      }

      function setHighScore() {
        if (score > highScore) {
          highScore = score;
          highScoreText.setText('high score: ' + highScore);
          localStorage.setItem('highscore', JSON.stringify(highScore));
        }
      }

      function setGameOverText() {
        let smackTalk;
        if (score <= 130) {
          smackTalk = 'Git gud, n00b.';
        } else if (score <= 180) {
          smackTalk = 'I mean... you\'re not completely terrible';
        } else if (score <= 300) {
          smackTalk =
            'Wow! You\'ve managed to beat my 4 year old cousin\'s score!';
        } else if (score <= 500) {
          smackTalk = 'Getting better, grasshopper.';
        } else if (score <= 650) {
          smackTalk = 'You are gettin\' SPICY! Keep it up!';
        }

        if (gameOver) {
          gameOverText.setText(smackTalk + '\n' + 'Press [space] to try again.');
        }
      }
    }
  }

  const OnionGame = new Onion();
})();
