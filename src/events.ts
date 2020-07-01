import {fromEvent, interval, timer, merge} from 'rxjs';
import {debounce, filter, throttle} from 'rxjs/operators';

export const windowResize = fromEvent(window, 'resize').pipe(
  debounce(() => interval(100))
);

export const fireButtonPress = (scene: Phaser.Scene) => {
  const spaceKey = scene.input.keyboard.addKey('SPACE');
  return merge(
    fromEvent(spaceKey, 'down'), // key down
    timer(0, 200).pipe(filter(() => spaceKey.isDown)) // key down and hold
  ).pipe(throttle(() => interval(200)));
};
