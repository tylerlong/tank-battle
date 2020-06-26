class Player {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.sprite = scene.physics.add
      .sprite(x, y, 'atlas', 'misa-front')
      .setSize(30, 40)
      .setOffset(0, 24);
    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = scene.anims;
    anims.create({
      key: 'misa-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-left-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-right-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-front-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-back-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const speed = 175;
    const prevVelocity = this.sprite.body.velocity.clone();

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    // Horizontal movement
    if (this.cursorKeys.left?.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursorKeys.right?.isDown) {
      body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursorKeys.up?.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursorKeys.down?.isDown) {
      body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.sprite.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursorKeys.left?.isDown) {
      this.sprite.anims.play('misa-left-walk', true);
    } else if (this.cursorKeys.right?.isDown) {
      this.sprite.anims.play('misa-right-walk', true);
    } else if (this.cursorKeys.up?.isDown) {
      this.sprite.anims.play('misa-back-walk', true);
    } else if (this.cursorKeys.down?.isDown) {
      this.sprite.anims.play('misa-front-walk', true);
    } else {
      this.sprite.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) {
        this.sprite.setTexture('atlas', 'misa-left');
      } else if (prevVelocity.x > 0) {
        this.sprite.setTexture('atlas', 'misa-right');
      } else if (prevVelocity.y < 0) {
        this.sprite.setTexture('atlas', 'misa-back');
      } else if (prevVelocity.y > 0) {
        this.sprite.setTexture('atlas', 'misa-front');
      }
    }
  }
}

export default Player;
