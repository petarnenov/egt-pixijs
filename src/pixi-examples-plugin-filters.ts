//pixijs v4.x.x use pixi-filters v2.x.x => 4.8.8 - 2.7.1
//bug with Google Chrome Version 81.0.4044.129
//test and run only Firefox 68.7.0esr (64-bit)
import { Sprite } from "pixi.js";
import { GlowFilter, OutlineFilter, AsciiFilter } from "pixi-filters";
import { height, width, delayDemo, destroyApp, initApp } from "./initApp";
import Grid from "./Grid";

function pluginFiltersOutline() {
  const rows = 4;
  const cols = 5;
  const app = initApp();

  const asciiFilter = new AsciiFilter();

  const outlineFilterBlue = new OutlineFilter(2, 0x99ff99);

  const outlineFilterRed = new GlowFilter(15, 2, 1, 0xff9999, 0.5);
  function filterOn(this: Sprite) {
    this.filters = [outlineFilterRed];
    //console.log("over sprite");
  }
  function filterOff(this: any) {
    this.filters = [outlineFilterBlue];
  }

  const bg = Sprite.fromImage("assets/rainbow.png");
  bg.width = width;
  bg.height = height;
  bg.filters = [asciiFilter];

  app.stage.addChild(bg);

  const grid = new Grid(width, height, rows, cols);
  const points = grid.getPoints();
  for (let i = 0; i < rows * cols; i++) {
    const bunny = PIXI.Sprite.fromImage("assets/bunny64.png");
    bunny.interactive = true;
    bunny.on("pointerover", filterOn).on("pointerout", filterOff);
    bunny.position = points[i];
    bunny.anchor.set(0.5);
    filterOff.call(bunny);
    app.stage.addChild(bunny);
  }

  //app.stage.position.set(width / 2, height / 2);
}

pluginFiltersOutline();
