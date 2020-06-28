import {fromEvent, interval} from 'rxjs';
import {debounce} from 'rxjs/operators';

export const windowResize = fromEvent(window, 'resize').pipe(
  debounce(() => interval(1000))
);
