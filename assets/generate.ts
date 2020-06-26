/* eslint-disable node/no-unpublished-import */
import * as fs from 'fs';
import * as path from 'path';
import LPC, {Animations} from 'liberated-pixel-cup';

const lpc = new LPC(process.env.LPC_SPRITE_FOLDER!);

(async () => {
  const buffer = await lpc.overlay(
    lpc.body().male().tanned(),
    lpc.hair().male().messy2().black(),
    lpc.torso().shirts().pirate().shirt().blue().gray(),
    lpc.legs().armor().male()._8(),
    lpc.weapons().left().hand().male().shield().black()
  );
  const animations = await Animations.fromBuffer(buffer);
  fs.writeFileSync(
    path.join(__dirname, 'generated', 'dude', 'walk-n.png'),
    animations.walk.n
  );
  fs.writeFileSync(
    path.join(__dirname, 'generated', 'dude', 'walk-e.png'),
    animations.walk.e
  );
  fs.writeFileSync(
    path.join(__dirname, 'generated', 'dude', 'walk-s.png'),
    animations.walk.s
  );
  fs.writeFileSync(
    path.join(__dirname, 'generated', 'dude', 'walk-w.png'),
    animations.walk.w
  );
})();
