import * as Phaser from 'phaser';

import tiles from '../assets/tilesets/tuxmon-sample-32px-extruded.png';
import map from '../assets/tilemaps/tuxemon-town.json.data';

class SpawnPoint extends Phaser.GameObjects.GameObject {
  x!: number;
  y!: number;
}

class Map {
  static preload(scene: Phaser.Scene) {
    scene.load.image('tiles', tiles);
    scene.load.tilemapTiledJSON('map', map);
  }

  spawnPoint: SpawnPoint;
  worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
  tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene) {
    this.tilemap = scene.make.tilemap({key: 'map'});
    const tileset = this.tilemap.addTilesetImage(
      'tuxmon-sample-32px-extruded',
      'tiles'
    );
    this.tilemap.createStaticLayer('Below Player', tileset, 0, 0);
    this.worldLayer = this.tilemap.createStaticLayer('World', tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({collides: true});
    // by default world bound is window size instead of tilemap size
    scene.physics.world.setBounds(
      0,
      0,
      this.worldLayer.width,
      this.worldLayer.height,
      true,
      true,
      true,
      true
    );
    const aboveLayer = this.tilemap.createStaticLayer(
      'Above Player',
      tileset,
      0,
      0
    );
    aboveLayer.setDepth(10);

    this.spawnPoint = this.tilemap.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point'
    ) as SpawnPoint;
  }
}

export default Map;
