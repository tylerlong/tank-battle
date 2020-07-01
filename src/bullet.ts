// eslint-disable-next-line node/no-unpublished-import
import bullet from '../assets/bullet.png';
import chop from '../assets/chop.ogg';
import wood from '../assets/wood.ogg';

import Player from './player';
import Map from './map';

class Bullet {
  static preload(scene: Phaser.Scene) {
    scene.load.image('bullet', bullet);
    scene.load.audio('chop', chop);
    scene.load.audio('wood', wood);
  }

  sprite: Phaser.Physics.Arcade.Sprite;

  constructor({
    scene,
    player,
    map,
  }: {
    scene: Phaser.Scene;
    player: Player;
    map: Map;
  }) {
    this.sprite = scene.physics.add.sprite(
      player.sprite.x,
      player.sprite.y,
      'bullet'
    );
    scene.sound.play('chop');
    scene.physics.add.collider(this.sprite, map.worldLayer, () => {
      scene.sound.play('wood');
      this.sprite.destroy();
    });
    (this.sprite.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    scene.physics.world.on(
      'worldbounds',
      (body: Phaser.Physics.Arcade.Body) => {
        body.gameObject.destroy();
      }
    );
    this.sprite.setCollideWorldBounds(true);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    const speed = 200;
    switch (player.facing) {
      case 'E': {
        body.setVelocityX(speed);
        break;
      }
      case 'W': {
        body.setVelocityX(-speed);
        break;
      }
      case 'N': {
        body.setVelocityY(-speed);
        break;
      }
      case 'S': {
        body.setVelocityY(speed);
        break;
      }
    }
  }
}

export default Bullet;
