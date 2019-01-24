"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowScale = windowWidth / windowHeight; // ----------  

  var Onion = // ----------  
  function Onion() {
    _classCallCheck(this, Onion);

    var config = {
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
        preload: preload,
        create: create,
        update: update
      }
    };
    var game = new Phaser.Game(config); // ----------  

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
    } // ----------  


    function create() {
      console.log('create'); // ----------
      // Sky

      this.add.image(400, 300, 'sky'); // ----------
      // Platforms Group

      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      this.platforms.create(600, 400, 'ground');
      this.platforms.create(50, 250, 'ground');
      this.platforms.create(750, 220, 'ground'); // ----------
      // Stars

      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {
          x: 12,
          y: 0,
          stepX: 70
        }
      });
      this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.8));
        child.body.setGravityY(300);
        child.setCollideWorldBounds(true);
      }); // ----------
      // Player

      this.player = this.physics.add.sprite(100, 450, 'dude');
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
          start: 0,
          end: 3
        }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'turn',
        frames: [{
          key: 'dude',
          frame: 4
        }],
        frameRate: 20
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
          start: 5,
          end: 8
        }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'jump-right',
        frames: this.anims.generateFrameNumbers('dude', {
          start: 6,
          end: 6
        }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'jump-left',
        frames: this.anims.generateFrameNumbers('dude', {
          start: 3,
          end: 3
        }),
        frameRate: 10,
        repeat: -1
      }); // Set Player Gravity

      this.player.body.setGravityY(300); // Player/Platform Collide Behavior

      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.stars.children, this.platforms); // ----------
      // Keyboard Input Init

      this.cursors = this.input.keyboard.createCursorKeys();
    } // ----------  


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

      if (this.cursors.space.isDown && this.cursors.left.isDown) {
        this.player.anims.play('jump-left', true);
        this.player.anims.stop('left', true);
      } else if (this.cursors.space.isDown && this.cursors.right.isDown) {
        this.player.anims.play('jump-right', true);
        this.player.anims.stop('right', true);
      }
    }
  };

  var OnionGame = new Onion();
})();
