import "pixi.js";
//import not work, fix with require
//https://www.html5gamedevs.com/topic/44191-pixi-spine-pixi-is-not-defined/?tab=comments#comment-246720
import "pixi-spine";
require("pixi-spine");

import { height, destroyApp, delayDemo, initApp, width } from "./initApp";
import ExtendedResource from "./ExtendResource";
import BounceBox from "./BounceBox";

function pluginSpine() {
  const app = initApp();
  app.stage.interactive = true;
  app.loader
    .add("spineboy", "assets/pixi-spine/spineboy.json")
    .load(onAssetsLoad);

  function onAssetsLoad(
    loader: PIXI.loaders.Loader,
    resource: ExtendedResource
  ) {
    const spineboy = new PIXI.spine.Spine(resource.spineboy.spineData);
    spineboy.position.set(width / 2, height);
    spineboy.scale.set(1.5);
    spineboy.stateData.setMix("walk", "jump", 0.2);
    spineboy.stateData.setMix("jump", "walk", 0.4);

    spineboy.state.setAnimation(0, "walk", true);

    app.stage.on("pointerdown", () => {
      spineboy.state.setAnimation(0, "jump", false);
      spineboy.state.addAnimation(0, "walk", true, 0);
    });

    app.stage.addChild(spineboy);
    const bounce = new BounceBox(width, height);
    app.ticker.add(() => {
      spineboy.x += 5;
      bounce.keepSpriteInBounce(spineboy);
    });
  }
}

pluginSpine();
