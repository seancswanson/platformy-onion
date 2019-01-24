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

      // ----------  
      function preload() {
        console.log('preload');
        this.load.image('sky', '../src/assets/sky.png');
        this.load.image('ground', '../src/assets/platform.png');
        this.load.image('star', '../src/assets/star.png');
        this.load.image('bomb', '../src/assets/bomb.png');
        this.load.spritesheet('dude', '../src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      }

      // ----------  
      function create() {
        console.log('create');

        // ----------
        // Sky
        this.add.image(400, 300, 'sky');

        // ----------
        // Platforms Group
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // ----------
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

        // Set Player Gravity
        this.player.body.setGravityY(300);

        // Player/Platform Collide Behavior
        this.physics.add.collider(this.player, this.platforms);

        // ----------
        // Keyboard Input Init
        this.cursors = this.input.keyboard.createCursorKeys();
      }
    
      // ----------  
      function update() {
        console.log('update');
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);
          this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);
          this.player.anims.play('right', true);
        } else {
          this.player.setVelocityX(0);
          this.player.anims.play('turn');
        } 

        if (this.cursors.space.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-330);
        }
      }
    }

  }

  const OnionGame = new Onion();
})();
