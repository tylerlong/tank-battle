import './index.css';

import * as Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin';

import MainScene from './main-scene';
import {windowResize} from './events';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'container',
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
    },
  },
  scene: [MainScene],
  plugins: {
    global: [
      {
        key: 'virtual-joystick',
        plugin: VirtualJoystickPlugin,
        start: true,
      },
    ],
  },
});

windowResize.subscribe(() => {
  console.log('windowResize');
  game.scale.resize(window.innerWidth, window.innerHeight);
});
