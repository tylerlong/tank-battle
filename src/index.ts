import './index.css';

import * as Phaser from 'phaser';

import MainScene from './main-scene';
import {windowResize} from './events';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
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
});

// todo: allow user to toggle full screen
// game.scale.toggleFullscreen();

windowResize.subscribe(() => {
  console.log('windowResize');
  game.scale.resize(window.innerWidth, window.innerHeight);
});
