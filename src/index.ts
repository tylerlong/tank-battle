import './index.css';

import * as Phaser from 'phaser';

import MainScene from './main-scene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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

// game.scale.toggleFullscreen();
// setTimeout(() => game.scale.toggleFullscreen(), 3000);

setTimeout(() => resizeGame(), 3000);
window.addEventListener('resize', resizeGame);
function resizeGame() {
  console.log('resize game');
  const canvas = document.querySelector('canvas');
  if (canvas !== null) {
    // game is ready
    // game.scale.setGameSize(window.innerWidth, window.innerHeight);
  }
}
