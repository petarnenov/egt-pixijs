import {
  Application,
  Sprite,
  Container,
  Graphics,
  Text,
  TextStyle,
  Point,
} from "pixi.js";
import BounceBox from "./BounceBox";

const delayDemo = 1000;

function masksGraphics() {
  const app = initApp();
  app.stage.interactive = true;
  app.stage.on("pointertap", onDropMask);
  let tap = 0;
  function onDropMask() {
    tap ^= 1;
    if (tap) {
      container.mask = circle;
    } else {
      container.mask = thing;
    }
  }

  const width = app.renderer.width;
  const height = app.renderer.height;

  const bg = Sprite.fromImage("assets/rainbow.png");
  bg.anchor.set(0.5);
  bg.position.set(width / 2, height / 2);
  bg.scale.set(0.7, 1.1);
  app.stage.addChild(bg);

  const container = new Container();
  container.position.set(width / 2, height / 2);

  //add sprites
  const bgFront = Sprite.fromImage("assets/rainbow.png");
  bgFront.scale.set(0.7, 1.1);
  bgFront.anchor.set(0.5);
  //bgFront.tint = Math.random() * 0xffffff;

  const panda = Sprite.fromImage("assets/panda64.png");
  panda.anchor.set(0.5);
  panda.scale.set(2);

  container.addChild(bgFront, panda);
  app.stage.addChild(container);

  const style = new TextStyle({
    fontFamily: "Snippet",
    fontSize: 26,
    fill: "white",
    fontWeight: "bold",
  });
  const help = new Text("click or tap to change mask", style);
  app.stage.addChild(help);

  const thing = new Graphics();
  app.stage.addChild(thing);
  thing.lineStyle(0);
  thing.position.set(width / 2, height / 2);

  container.mask = thing;

  const circle = new Graphics();
  app.stage.addChild(circle);

  //const bounce=new BounceBox(width,height)

  let count = 0;
  app.ticker.add(() => {
    count += 0.1;

    bg.rotation += 0.01;
    bgFront.rotation -= 0.01;

    panda.scale.x = 2 + Math.sin(count) * 0.4;
    panda.scale.y = 2 + Math.cos(count) * 0.4;

    // circle.scale.x = 1 + Math.sin(count) * 0.9;
    // circle.scale.y = 1 + Math.cos(count) * 0.9;
    // circle.scale.set(2)
    circle.clear();
    circle.beginFill(0x0, 0.1);
    circle.drawCircle(
      Math.random() * width,
      Math.random() * height,
      75 + Math.sin(count) * 20
    );
    //bounce.keepSpriteInBounce(circle);
    circle.endFill();

    thing.clear();
    thing.beginFill(0x8bc5ff, 0.3);
    thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
    thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
    thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
    thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
    thing.rotation = count * 0.1;
  });
  setTimeout(() => {
    destroyApp(app);
    masksSprite();
  }, delayDemo);
}

function masksSprite() {
  const app = initApp();
  app.stage.interactive = true;
  const width = app.renderer.width;
  const height = app.renderer.height;
  const center = new Point(width / 2, height / 2);

  const scene = Sprite.fromImage("assets/greenScene.png");
  scene.anchor.set(0.5);
  scene.position = center;
  scene.scale.set(1.5);

  app.stage.addChild(scene);

  const mesh = Sprite.fromImage("assets/mesh.png");
  mesh.anchor.set(0.5);
  mesh.position = center;
  //mesh.tint = 0xaa0088;

  const rainbow = Sprite.fromImage("assets/rainbow.png");
  rainbow.anchor.set(0.5);
  rainbow.scale.set(1.5);
  rainbow.position = center;

  const flower = Sprite.fromImage("assets/flower.png");
  flower.anchor.set(0.5);
  flower.position = center;

  mesh.mask = flower;
  rainbow.mask = flower;

  app.stage.addChild(flower, rainbow, mesh);

  const target = new Point();
  reset();
  function reset() {
    target.x = Math.random() * 500;
    target.y = Math.random() * 300;
  }

  app.ticker.add(() => {
    flower.x += (target.x - flower.x) * 0.1;
    flower.y += (target.y - flower.y) * 0.1;
    if (Math.abs(target.x - flower.x) < 1) {
      reset();
    }
  });
}

masksGraphics();

function initApp() {
  const app = new Application({
    antialias: true,
    resolution: 1,
  });
  document.body.appendChild(app.view);
  return app;
}

function destroyApp(app: Application) {
  document.body.removeChild(app.view);
  app.destroy();
}
