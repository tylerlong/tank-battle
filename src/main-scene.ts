import * as Phaser from 'phaser';

import Player from './player';
// eslint-disable-next-line node/no-unpublished-import
import dudeN from '../assets/generated/dude/walk-n.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeE from '../assets/generated/dude/walk-e.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeS from '../assets/generated/dude/walk-s.png';
// eslint-disable-next-line node/no-unpublished-import
import dudeW from '../assets/generated/dude/walk-w.png';

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

    this.load.spritesheet('dudeN', dudeN, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('dudeE', dudeE, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('dudeS', dudeS, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('dudeW', dudeW, {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    const map = this.make.tilemap({key: 'map'});

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    map.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0);

    worldLayer.setCollisionByProperty({collides: true});

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = map.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point'
    ) as SpawnPoint;

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player.sprite, worldLayer);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
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
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    }
  }

  update() {
    this.player.update();
  }
}

export default MainScene;
