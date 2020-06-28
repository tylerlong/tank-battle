import * as Phaser from 'phaser';

import Map from './map';
import Player from './player';

class MainScene extends Phaser.Scene {
  map!: Map;
  player!: Player;

  preload() {
    Map.preload(this);
    Player.preload(this);
  }

  create() {
    // this.map.& player
    this.map = new Map(this);
    this.player = new Player(
      this,
      this.map.spawnPoint.x,
      this.map.spawnPoint.y
    );
    this.physics.add.collider(this.player.sprite, this.map.worldLayer);
    // this.player.sprite.setCollideWorldBounds(true);

    // camera
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(
      0,
      0,
      this.map.tilemap.widthInPixels,
      this.map.tilemap.heightInPixels
    );

    // Debug graphics
    if (JSON.parse(process.env.PHASER_DEBUG ?? 'false') === true) {
      // Turn on physics debugging
      this.physics.world.createDebugGraphic();
      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      this.map.worldLayer.renderDebug(graphics, {
        collidingTileColor: new Phaser.Display.Color(120, 120, 120),
        faceColor: new Phaser.Display.Color(255, 0, 0),
      });
    }
  }

  update() {
    this.player.update();
  }
}

export default MainScene;
