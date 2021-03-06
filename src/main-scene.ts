import * as Phaser from 'phaser';

import Map from './map';
import Player from './player';
import fullScreen from '../assets/full-screen.png';
import Bullet from './bullet';
import {fireButtonPress} from './events';

class MainScene extends Phaser.Scene {
  map!: Map;
  player!: Player;

  preload() {
    this.load.image('fullScreen', fullScreen);
    Map.preload(this);
    Player.preload(this);
    Bullet.preload(this);
  }

  create() {
    // map & player
    this.map = new Map(this);
    this.player = new Player({scene: this, map: this.map});
    fireButtonPress(this).subscribe(() => {
      new Bullet({scene: this, player: this.player, map: this.map});
    });

    // camera
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(
      0,
      0,
      this.map.tilemap.widthInPixels,
      this.map.tilemap.heightInPixels
    );

    // go full screen
    const margin = 8;
    const fullScreenButton = this.add
      .image(margin, margin, 'fullScreen')
      .setOrigin(0, 0)
      .setInteractive({useHandCursor: true})
      .setScrollFactor(0)
      .setDepth(100)
      .on('pointerup', () => {
        if (!this.scale.isFullscreen) {
          this.scale.startFullscreen();
        }
      });
    document.addEventListener('fullscreenchange', () => {
      fullScreenButton.setVisible(!this.scale.isFullscreen);
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
