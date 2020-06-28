import * as Phaser from 'phaser';

import Map from './map';
import Player from './player';
import fullScreen from '../assets/full-screen.png';
import {windowResize} from './events';

class MainScene extends Phaser.Scene {
  map!: Map;
  player!: Player;

  preload() {
    this.load.spritesheet('fullScreen', fullScreen, {
      frameWidth: 64,
      frameHeight: 64,
    });
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
    // todo: fix next line
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

    const fullScreenButton = this.add
      .image(window.innerWidth - 16, 16, 'fullScreen', 0)
      .setOrigin(1, 0)
      .setInteractive()
      .setScrollFactor(0)
      .on('pointerup', () => {
        if (this.scale.isFullscreen) {
          fullScreenButton.setFrame(0);
          this.scale.stopFullscreen();
        } else {
          fullScreenButton.setFrame(1);
          this.scale.startFullscreen();
        }
      });
    windowResize.subscribe(() => {
      fullScreenButton.x = window.innerWidth - 16;
    });

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
