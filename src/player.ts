// eslint-disable-next-line node/no-unpublished-import
import dudeN from '../assets/generated/dude/walk-n.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeE from '../assets/generated/dude/walk-e.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeS from '../assets/generated/dude/walk-s.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeW from '../assets/generated/dude/walk-w.png';

class Player {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet('dudeN', dudeN, {
      frameWidth: 64,
      frameHeight: 64,
    });
    scene.load.spritesheet('dudeE', dudeE, {
      frameWidth: 64,
      frameHeight: 64,
    });
    scene.load.spritesheet('dudeS', dudeS, {
      frameWidth: 64,
      frameHeight: 64,
    });
    scene.load.spritesheet('dudeW', dudeW, {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  sprite: Phaser.Physics.Arcade.Sprite;
  // activePointer: Phaser.Input.Pointer;
  scaleManager: Phaser.Scale.ScaleManager;
  movingN = false;
  movingE = false;
  movingS = false;
  movingW = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scaleManager = scene.sys.game.scale;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    // this.activePointer = scene.input.activePointer;
    this.sprite = scene.physics.add
      .sprite(x, y, 'dudeS', 0)
      .setSize(40, 54)
      .setOffset(10, 10);
    scene.anims.create({
      key: 'dudeN',
      frames: scene.anims.generateFrameNumbers('dudeN', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'dudeE',
      frames: scene.anims.generateFrameNumbers('dudeE', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'dudeS',
      frames: scene.anims.generateFrameNumbers('dudeS', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'dudeW',
      frames: scene.anims.generateFrameNumbers('dudeW', {start: 0, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const previousVelocity = this.sprite.body.velocity.clone();
    this.movingE = this.movingN = this.movingS = this.movingW = false;
    if (
      this.cursorKeys.left?.isDown //||
      // (this.activePointer.isDown && this.activePointer.x < 100)
    ) {
      this.movingW = true;
    } else if (
      this.cursorKeys.right?.isDown // ||
      // (this.activePointer.isDown &&
      //   this.scaleManager.gameSize.width - this.activePointer.x < 100)
    ) {
      this.movingE = true;
    }
    if (
      this.cursorKeys.up?.isDown // ||
      // (this.activePointer.isDown && this.activePointer.y < 100)
    ) {
      this.movingN = true;
    } else if (
      this.cursorKeys.down?.isDown // ||
      // (this.activePointer.isDown &&
      //   this.scaleManager.gameSize.height - this.activePointer.y < 100)
    ) {
      this.movingS = true;
    }
    this.updateVelocity();
    this.updateAnims(previousVelocity);
  }

  updateVelocity() {
    const speed = 150;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    // Horizontal movement
    if (this.movingW) {
      body.setVelocityX(-speed);
    } else if (this.movingE) {
      body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.movingN) {
      body.setVelocityY(-speed);
    } else if (this.movingS) {
      body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.sprite.body.velocity.normalize().scale(speed);
  }

  updateAnims(previousVelocity: Phaser.Math.Vector2) {
    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.movingW) {
      this.sprite.anims.play('dudeW', true);
    } else if (this.movingE) {
      this.sprite.anims.play('dudeE', true);
    } else if (this.movingN) {
      this.sprite.anims.play('dudeN', true);
    } else if (this.movingS) {
      this.sprite.anims.play('dudeS', true);
    } else {
      this.sprite.anims.stop();
      // If we were moving, pick and idle frame to use
      if (previousVelocity.x < 0) {
        this.sprite.setTexture('dudeW', 0);
      } else if (previousVelocity.x > 0) {
        this.sprite.setTexture('dudeE', 0);
      } else if (previousVelocity.y < 0) {
        this.sprite.setTexture('dudeN', 0);
      } else if (previousVelocity.y > 0) {
        this.sprite.setTexture('dudeS', 0);
      }
    }
  }
}

export default Player;
