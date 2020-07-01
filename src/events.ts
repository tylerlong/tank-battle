import {fromEvent, interval, timer} from 'rxjs';
import {debounce, filter} from 'rxjs/operators';

export const windowResize = fromEvent(window, 'resize').pipe(
  debounce(() => interval(100))
);

export const fireButtonPress = (scene: Phaser.Scene) => {
  const spaceKey = scene.input.keyboard.addKey('SPACE');
  return timer(0, 200).pipe(filter(() => spaceKey.isDown));
};
