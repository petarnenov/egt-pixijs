import {
  Application,
  Rectangle,
  loader,
  Sprite,
  Container,
  particles,
  BlendModeManager,
} from "pixi.js";
import Example from "./Example";
import assert from "assert";
import delay from "./delay";
import { start } from "repl";
import ExampleSprite from "./ExampleSprite";
import BounceBox from "./BounceBox";
import RandomRange from "./RandomRange";

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
    resolution: 1,
    antialias: true,
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
  setTimeout(() => {
    tintingExample.destroy();
    cacheAsBitmapDemo();
  }, 1000);
}

function cacheAsBitmapDemo() {
  const app = new Application({
    antialias: true,
    resolution: 1,
    autoStart: false,
  });

  app.stage.interactive = true;
  app.stage.on("pointertap", onTap);

  function onTap() {
    bitMapContainer.cacheAsBitmap = !bitMapContainer.cacheAsBitmap;
  }

  const bitMap = new Example(app);

  let counter = 0;
  const totalFruits = 100;
  const fruitsFrame = [
    "tomato64.png",
    "pineapple64.png",
    "watermelon64.png",
    "lime64.png",
  ];

  const bitMapContainer = bitMap.addContainer("bitMap");
  bitMapContainer.position.set(400, 300);

  bitMap.onLoadAssets = function () {
    for (let i = 0; i < totalFruits; i++) {
      const frameName = fruitsFrame[i % 4];
      const fruit = Sprite.fromFrame(frameName) as ExampleSprite;
      fruit.tint = Math.random() * 0xffffff;
      fruit.anchor.set(0.5);
      fruit.position.set(Math.random() * 800 - 400, Math.random() * 600 - 300);

      this.addToSprites(frameName + i, fruit);
      bitMapContainer.addChild(fruit);
    }
    this.addToTicker((deltaTime) => {
      this.getAllSprites().forEach((s) => {
        s.rotation += 0.1;
      });
      counter += 0.01;
      bitMapContainer.scale.set(Math.sin(counter));
    });
  };
  bitMap.addContainerToStage("bitMap");
  bitMap.loadAtlas("fruits", "assets/fruits.json");

  bitMap.start();

  // document.body.appendChild(app.view);

  // const totalFruits = 100;

  // loader.add("fruits", "assets/fruits.json").load(onAssetsLoaded);
  // const fruits = [] as Sprite[];
  // const fruitsFrame = [
  //   "tomato64.png",
  //   "pineapple64.png",
  //   "watermelon64.png",
  //   "lime64.png",
  // ];

  // let counter = 0;

  // const fruitsContainer = new Container();
  // fruitsContainer.position.set(400, 300);

  // app.stage.interactive = true;
  // app.stage.addChild(fruitsContainer);

  // function onAssetsLoaded() {
  //   for (let i = 0; i < totalFruits; i++) {
  //     const frameName = fruitsFrame[i % 4];
  //     const fruit = Sprite.fromFrame(frameName);
  //     fruit.tint = Math.random() * 0xffffff;
  //     fruit.anchor.set(0.5);
  //     fruit.position.set(Math.random() * 800 - 400, Math.random() * 600 - 300);

  //     fruits.push(fruit);
  //     fruitsContainer.addChild(fruit);
  //   }
  //   app.start();
  // }

  // app.stage.on("click", clickHandler);

  // function clickHandler() {
  //   fruitsContainer.cacheAsBitmap = !fruitsContainer.cacheAsBitmap;
  // }

  // app.ticker.add(() => {
  //   fruits.forEach((f) => {
  //     f.rotation += 0.1;
  //   });
  //   counter += 0.01;

  //   fruitsContainer.scale.x = Math.sin(counter);
  //   fruitsContainer.scale.y = Math.sin(counter);
  //   fruitsContainer.rotation += 0.01;
  // });

  setTimeout(() => {
    bitMap.destroy();
    particleContainerDemo();
  }, 3000);
}

function particleContainerDemo() {
  const app = new Application({
    // width: 400,
    // height: 300,
    antialias: true,
    resolution: 1,
    autoStart: false,
  });

  const totalLarvas = 10000;

  const particleContainerDemo = new particles.ParticleContainer(totalLarvas, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });

  const particleContainerExample = new Example(app);
  const tomato = particleContainerExample.addTexture(
    "tomato",
    "assets/larva64.png"
  );

  for (let i = 0; i < totalLarvas; i++) {
    const currentTomato = particleContainerExample.addSprite(
      "tomato" + i,
      tomato
    );
    currentTomato.tint = Math.random() * 0xe8d4cd;
    currentTomato.anchor.set(0.5);
    currentTomato.scale.set(Math.random() * 0.3 + 0.8);
    currentTomato.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );
    currentTomato.tint = Math.random() * 0x808080;
    currentTomato.speed *= 0.2;
    particleContainerDemo.addChild(currentTomato);
  }

  particleContainerExample.addParticleContainer(particleContainerDemo);
  const larvas = particleContainerExample.getAllSprites();
  let tick = 0;
  const bounce = new BounceBox(app.renderer.width, app.renderer.height);
  particleContainerExample.addToTicker((deltaTime) => {
    larvas.forEach((larva) => {
      larva.scale.y = 0.95 + Math.sin(tick) * 0.05;
      larva.direction += larva.turningSpeed * 0.01;
      larva.x += Math.sin(larva.direction) * (larva.speed * larva.scale.y);
      larva.y += Math.cos(larva.direction) * (larva.speed * larva.scale.y);
      larva.rotation = -larva.direction + Math.PI;
      //larva.blendMode=PIXI.BLEND_MODES.ADD;
      bounce.keepSpriteInBounce(larva);
    });

    //compare forEach vs for
    // for (let i = 0; i < totalLarvas; i++) {
    //   const larva = larvas[i];
    //   larva.scale.y = 0.95 + Math.sin(tick) * 0.05;
    //   larva.direction += larva.turningSpeed * 0.01;
    //   larva.x += Math.sin(larva.direction) * (larva.speed * larva.scale.y);
    //   larva.y += Math.cos(larva.direction) * (larva.speed * larva.scale.y);
    //   larva.rotation = -larva.direction + Math.PI;
    //   bounce.keepSpriteInBounce(larva);
    // }
    tick += 0.1;
  });
  particleContainerExample.start();

  setTimeout(() => {
    particleContainerExample.destroy();
    blendModesDemo();
  }, 3000);
}

function blendModesDemo() {
  const SupportedBlendModes = [
    PIXI.BLEND_MODES.ADD,
    PIXI.BLEND_MODES.SCREEN,
    PIXI.BLEND_MODES.MULTIPLY,
    PIXI.BLEND_MODES.NORMAL,
  ];

  const app = new Application({
    antialias: true,
    resolution: 1,
    autoStart: false,
  });

  const blendModesDemo = new Example(app);

  const backgroundTexture = blendModesDemo.addTexture(
    "rainbow",
    "assets/rainbow.png"
  );
  const background = blendModesDemo.addSprite("background", backgroundTexture);
  background.width = app.renderer.width;
  background.height = app.renderer.height;
  const blendContainer = blendModesDemo.addContainer("blend");
  blendModesDemo.addSpriteToContainer(background, blendContainer);
  blendModesDemo.addContainerToStage("blend");

  const totalFaces = 20;
  const faceTexture = blendModesDemo.addTexture("face", "assets/face.png");
  for (let i = 0; i < totalFaces; i++) {
    const face = blendModesDemo.addSprite("face" + i, faceTexture);
    face.anchor.set(0.5);
    face.scale.set(0.8 + Math.random() * 0.3);
    face.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );
    const randomBlendModes = RandomRange.getRandomInt(0, 3);

    face.blendMode = SupportedBlendModes[randomBlendModes];

    blendModesDemo.addSpriteToContainer(face, blendContainer);
  }

  const bounce = new BounceBox(app.renderer.width, app.renderer.height);
  const faces = blendModesDemo.getAllSprites();
  blendModesDemo.addToTicker((deltaTime) => {
    faces.forEach((face, index) => {
      if (index !== 0) {
        face.direction += face.turningSpeed * 0.01;
        face.x += Math.sin(face.direction) * face.speed;
        face.y += Math.cos(face.direction) * face.speed;
        face.rotation = -face.direction - Math.PI / 2;
        bounce.keepSpriteInBounce(face);
      }
    });
  });

  blendModesDemo.start();

  setTimeout(() => {
    blendModesDemo.destroy();
  }, 5000);
}

containerDemo();
