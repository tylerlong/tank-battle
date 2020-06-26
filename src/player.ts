class Player {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.sprite = scene.physics.add.sprite(x, y, 'dudeS', 0);
    // .setSize(30, 40)
    // .setOffset(0, 24);
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
      this.sprite.anims.play('dudeW', true);
    } else if (this.cursorKeys.right?.isDown) {
      this.sprite.anims.play('dudeE', true);
    } else if (this.cursorKeys.up?.isDown) {
      this.sprite.anims.play('dudeN', true);
    } else if (this.cursorKeys.down?.isDown) {
      this.sprite.anims.play('dudeS', true);
    } else {
      this.sprite.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) {
        this.sprite.setTexture('dudeW', 0);
      } else if (prevVelocity.x > 0) {
        this.sprite.setTexture('dudeE', 0);
      } else if (prevVelocity.y < 0) {
        this.sprite.setTexture('dudeN', 0);
      } else if (prevVelocity.y > 0) {
        this.sprite.setTexture('dudeS', 0);
      }
    }
  }
}

export default Player;
