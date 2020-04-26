import { Application } from "pixi.js";
import Example from "./Example";
import assert from "assert";

const sprites = 25;
const offset = 64;

const app = new Application({
  antialias: true,
  resolution: 1,
  autoStart: false,
});

const containerExample = new Example(app);

const demoContainer = containerExample.addContainer("demoContainer");
const bunny = containerExample.addTexture("bunny", "bunny64.png");

for (let i = 0; i < sprites; i++) {
  containerExample.addSprite(`bunny${i}`,bunny);
}

for (let i = 0; i < sprites; i++) {
  const currentSprite = containerExample.getSprite(`bunny${i}`);
  currentSprite.tint = Math.random() * 0xffffff;
  currentSprite.anchor.set(0.5);
  currentSprite.position.set(offset * (i % 5), Math.floor(i / 5) * offset);
  containerExample.addSpriteToContainer(currentSprite, demoContainer);
}

containerExample.addContainerToStage("demoContainer");

demoContainer.pivot.set(demoContainer.width / 2, demoContainer.height / 2);
demoContainer.position.set(app.renderer.width / 2, app.renderer.height / 2);

const spritesInDemoContainer = containerExample.getAllSpritesFromContainer(
  "demoContainer"
);

containerExample.addToTicker((deltaTime) => {
  demoContainer.rotation += 0.01;
  spritesInDemoContainer.map(s=>{
      s.rotation +=0.01;
  })
});

containerExample.start();

setTimeout(() => {
    containerExample.destroy();
}, 10000);
