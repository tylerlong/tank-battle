// eslint-disable-next-line node/no-unpublished-import
import dudeN from '../assets/generated/dude/walk-n.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeE from '../assets/generated/dude/walk-e.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeS from '../assets/generated/dude/walk-s.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeW from '../assets/generated/dude/walk-w.png';

import Map from './map';
import {windowResize} from './events';
import {VirtualJoystick} from './types';

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
  cursorKeys2: Phaser.Types.Input.Keyboard.CursorKeys;
  sprite: Phaser.Physics.Arcade.Sprite;
  scaleManager: Phaser.Scale.ScaleManager;
  movingN = false;
  movingE = false;
  movingS = false;
  movingW = false;
  facing: 'N' | 'E' | 'S' | 'W' = 'S';

  constructor({scene, map}: {scene: Phaser.Scene; map: Map}) {
    this.scaleManager = scene.sys.game.scale;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.sprite = scene.physics.add
      .sprite(map.spawnPoint.x, map.spawnPoint.y, 'dudeS', 0)
      .setSize(40, 54)
      .setOffset(10, 10);
    scene.physics.add.collider(this.sprite, map.worldLayer);
    this.sprite.setCollideWorldBounds(true);
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

    // joystick
    const margin = 128;
    const alpha = 0.4;
    const joyStick = (scene.plugins.get(
      'virtual-joystick'
    ) as VirtualJoystick).add(scene, {
      x: margin,
      y: window.innerHeight - margin,
      radius: 64,
      base: scene.add.circle(0, 0, 64, 0x888888, alpha).setDepth(100),
      thumb: scene.add.circle(0, 0, 32, 0xcccccc, alpha).setDepth(100),
      dir: '8dir',
    });
    this.cursorKeys2 = joyStick.createCursorKeys();
    windowResize.subscribe(() => {
      joyStick.y = window.innerHeight - margin;
      // todo: https://github.com/rexrainbow/phaser3-rex-notes/issues/105
      joyStick.thumb.y = window.innerHeight - margin;
    });
  }

  update() {
    const previousVelocity = this.sprite.body.velocity.clone();
    this.movingE = this.movingN = this.movingS = this.movingW = false;
    if (this.cursorKeys.left?.isDown || this.cursorKeys2.left?.isDown) {
      this.movingW = true;
      this.facing = 'W';
    } else if (
      this.cursorKeys.right?.isDown ||
      this.cursorKeys2.right?.isDown
    ) {
      this.movingE = true;
      this.facing = 'E';
    }
    if (this.cursorKeys.up?.isDown || this.cursorKeys2.up?.isDown) {
      this.movingN = true;
      this.facing = 'N';
    } else if (this.cursorKeys.down?.isDown || this.cursorKeys2.down?.isDown) {
      this.movingS = true;
      this.facing = 'S';
    }
    this.updateVelocity();
    this.updateAnims(previousVelocity);
  }

  updateVelocity() {
    const speed = 128;
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
