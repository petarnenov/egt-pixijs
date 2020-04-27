import { Application, Rectangle } from "pixi.js";
import Example from "./Example";
import assert from "assert";
import delay from "./delay";
import { start } from "repl";
import ExampleSprite from "./ExampleSprite";
import BonceBox from "./BounceBox";
import BounceBox from "./BounceBox";

function containerDemo() {
  const sprites = 25;
  const offset = 64;

  const app = new Application({
    antialias: true,
    resolution: 1,
    autoStart: false,
  });

  const containerExample = new Example(app);

  const demoContainer = containerExample.addContainer("demoContainer");
  const bunny = containerExample.addTexture("bunny", "assets/bunny64.png");

  for (let i = 0; i < sprites; i++) {
    containerExample.addSprite(`bunny${i}`, bunny);
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
    spritesInDemoContainer.map((s) => {
      s.rotation += 0.01;
    });
  });

  containerExample.start();
  setTimeout(() => {
    containerExample.destroy();
    transparentDemo();
  }, 1000);
}

function transparentDemo() {
  const app = new Application({
    antialias: true,
    resolution: 1,
    transparent: true,
  });

  const transparentExample = new Example(app);

  const demoTransparentContainer = transparentExample.addContainer(
    "demoTransparent"
  );
  const bunnyTexture = transparentExample.addTexture(
    "bunny",
    "assets/bunny64.png"
  );
  const bunnySprite = transparentExample.addSprite("bunny", bunnyTexture);
  bunnySprite.anchor.set(0.5);
  demoTransparentContainer.pivot.set(
    demoTransparentContainer.width / 2,
    demoTransparentContainer.height / 2
  );
  demoTransparentContainer.position.set(
    app.renderer.width / 2,
    app.renderer.height / 2
  );
  transparentExample.addSpriteToContainer(
    bunnySprite,
    demoTransparentContainer
  );
  transparentExample.addContainerToStage("demoTransparent");
  transparentExample.addToTicker((deltaTime) => {
    bunnySprite.rotation += 0.1;
  });
  transparentExample.start();
  setTimeout(() => {
    transparentExample.destroy();
    tintingDemo();
  }, 1000);
}

function tintingDemo() {
  const app = new Application({
    resolution:1,
    antialias:true
  });
  const tintingExample = new Example(app);
  const demoTintingContainer = tintingExample.addContainer("tintingDemo");
  const tintingTexture = tintingExample.addTexture(
    "bunny",
    "assets/bunny64.png"
  );
  const totalBunnies = 1000;
  for (let i = 0; i < totalBunnies; i++) {
    const currentBunny = tintingExample.addSprite("dude" + i, tintingTexture);

    currentBunny.anchor.set(0.5);
    currentBunny.scale.set(0.8 + Math.random() * 0.3);
    currentBunny.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );
    currentBunny.tint = Math.random() * 0xffffff;
    tintingExample.addSpriteToContainer(currentBunny, demoTintingContainer);
  }
  tintingExample.addContainerToStage("tintingDemo");
  const bunnies = tintingExample.getAllSprites();
  // const bunnyBoundPadding = 64;
  // const bunnyBounds = new Rectangle(
  //   -bunnyBoundPadding,
  //   -bunnyBoundPadding,
  //   app.renderer.width + bunnyBoundPadding * 2,
  //   app.renderer.height + bunnyBoundPadding * 2
  // );
  const bounce = new BounceBox(app.renderer.width, app.renderer.height);

  tintingExample.addToTicker((deltaTime) => {
    bunnies.forEach((bunny) => {
      bunny.direction += bunny.turningSpeed * 0.01;
      bunny.x += Math.sin(bunny.direction) * bunny.speed;
      bunny.y += Math.cos(bunny.direction) * bunny.speed;
      bunny.rotation = -bunny.direction - Math.PI * 2;

      // if (bunny.x < bunnyBounds.x) {
      //   bunny.x += bunnyBounds.width;
      // } else if (bunny.x > bunnyBounds.x + bunnyBounds.width) {
      //   bunny.x -= bunnyBounds.width;
      // }

      // if (bunny.y < bunnyBounds.y) {
      //   bunny.y += bunnyBounds.height;
      // } else if (bunny.y > bunnyBounds.y + bunnyBounds.height) {
      //   bunny.y -= bunnyBounds.height;
      // }

      bounce.keepSpriteInBounce(bunny);
    });
  });
  tintingExample.start();
}

containerDemo();
