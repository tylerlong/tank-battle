import './index.css';

import * as Phaser from 'phaser';

import MainScene from './main-scene';

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

setTimeout(() => resizeGame(), 3000);
window.addEventListener('resize', resizeGame);
function resizeGame() {
  console.log('resize game');
  const canvas = document.querySelector('canvas');
  if (canvas !== null) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
}
