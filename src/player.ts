class Player {
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add
      .sprite(x, y, 'atlas', 'misa-front')
      .setSize(30, 40)
      .setOffset(0, 24);
  }
}

export default Player;
