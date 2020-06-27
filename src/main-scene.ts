import * as Phaser from 'phaser';

import Map from './map';
import Player from './player';

class MainScene extends Phaser.Scene {
  map!: Map;
  player!: Player;
  joyStick!: any;
  cursorKeys!: any;

  preload() {
    Map.preload(this);
    Player.preload(this);
    const url =
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
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

    // camera
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(
      0,
      0,
      this.map.tilemap.widthInPixels,
      this.map.tilemap.heightInPixels
    );

    // help text
    const helpText = this.add
      .text(16, 16, 'Arrow keys to move', {
        font: '18px monospace',
        fill: '#000000',
        padding: {x: 20, y: 10},
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(30);
    setTimeout(() => helpText.destroy(), 10000);

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

    this.joyStick = (this.plugins.get('rexvirtualjoystickplugin') as any).add(
      this,
      {
        x: 100,
        y: 500,
        radius: 64,
        base: this.add.circle(0, 0, 64, 0x888888),
        thumb: this.add.circle(0, 0, 32, 0xcccccc),
        dir: '4dir', // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
        // forceMin: 16,
        // enable: true
      }
    );
    this.cursorKeys = this.joyStick.createCursorKeys();
    this.joyStick.on('update', this.dumpJoyStickState, this);

    this.dumpJoyStickState();
  }

  dumpJoyStickState() {
    // const cursorKeys = this.joyStick.createCursorKeys();
    let s = 'Key down: ';
    for (const name in this.cursorKeys) {
      if (this.cursorKeys[name].isDown) {
        s += name + ' ';
      }
    }
    s += '\n';
    s += 'Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n';
    s += 'Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n';
    console.log(s);
  }

  update() {
    this.player.update();
  }
}

export default MainScene;
