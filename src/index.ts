import './index.css';

import * as Phaser from 'phaser';

import MainScene from './main-scene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
    },
  },
  scene: [MainScene],
};

new Phaser.Game(config);
