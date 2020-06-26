import * as Phaser from 'phaser';

import Player from './player';

class SpawnPoint extends Phaser.GameObjects.GameObject {
  x!: number;
  y!: number;
}

class MainScene extends Phaser.Scene {
  player!: Player;

  preload() {
    this.load.image(
      'tiles',
      '../assets/tilesets/tuxmon-sample-32px-extruded.png'
    );
    this.load.tilemapTiledJSON('map', '../assets/tilemaps/tuxemon-town.json');
    Player.preload(this);
  }

  create() {
    const tilemap = this.make.tilemap({key: 'map'});
    const tileset = tilemap.addTilesetImage(
      'tuxmon-sample-32px-extruded',
      'tiles'
    );
    tilemap.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = tilemap.createStaticLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({collides: true});
    const aboveLayer = tilemap.createStaticLayer('Above Player', tileset, 0, 0);
    aboveLayer.setDepth(10);

    const spawnPoint = tilemap.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point'
    ) as SpawnPoint;
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.physics.add.collider(this.player.sprite, worldLayer);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Arrow keys to move', {
        font: '18px monospace',
        fill: '#000000',
        padding: {x: 20, y: 10},
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(30);

    // Debug graphics
    if (JSON.parse(process.env.PHASER_DEBUG ?? 'false') === true) {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      worldLayer.renderDebug(graphics, {
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
