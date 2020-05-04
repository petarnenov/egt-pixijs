import {
  loader,
  loaders,
  Texture,
  GroupD8,
  Rectangle,
  Text,
  Sprite,
  TextStyle,
  TextureMatrix,
  Container,
  BaseRenderTexture,
  SCALE_MODES,
  RenderTexture,
  SpriteMaskFilter,
} from "pixi.js";
import { initApp, destroyApp, width, height, delayDemo } from "./initApp";
import ExtendedResource from "./ExtendResource";
import Grid from "./Grid";

function texturesRotate() {
  const app = initApp();
  loader.add("bunny", "assets/bunny64.png").load(onLoadAssets);
  function onLoadAssets(loader: loaders.Loader, resource: ExtendedResource) {
    const texture = resource.bunny.texture;
    const frame = texture.frame;
    const textures: Texture[] = [];
    const D8 = GroupD8;
    for (let i = 0; i < 16; i++) {
      console.log(D8.isVertical(i), i);
      const w = D8.isVertical(i) ? frame.width : frame.height;
      const h = D8.isVertical(i) ? frame.height : frame.width;
      const crop = new Rectangle(frame.x, frame.y, w, h);
      const trim = crop;
      let rotatedTexture: Texture;
      rotatedTexture = new Texture(texture.baseTexture, frame, crop, trim);

      //problem with 1,3,5 ..., diamond-shapes are different in canvas and webgl
      //rotatedTexture = new Texture(texture.baseTexture, frame, crop, trim, i);
      rotatedTexture.rotate += i;
      // if (i % 2) {
      //   rotatedTexture = new Texture(
      //     texture.baseTexture,
      //     frame,
      //     crop,
      //     trim,
      //     i - 1
      //   );
      //   rotatedTexture.rotate++;
      // } else {
      //   rotatedTexture = new Texture(texture.baseTexture, frame, crop, trim, i);
      // }
      textures.push(rotatedTexture);
    }
    // const offsetX = (width / 16) | 0;
    // const offsetY = (height / 8) | 0;
    // const gridW = width / 4;
    // const gridH = height / 5;
    const grid = new Grid(width, height, 4, 4);
    const gridPoints = grid.getPoints();
    for (let i = 0; i < 16; i++) {
      //const dude = new Sprite(textures[i < 8 ? i * 2 : (i - 8) * 2 + 1]);
      //dude.scale.set(0.5);
      const dude = new Sprite(textures[i]);
      dude.anchor.set(0.5);
      //if (i % 2) dude.scale.set(0.5)
      //dude.scale.set(0.5);
      // dude.x = offsetX + gridW * (i % 4);
      // dude.y = offsetY + gridH * ((i / 4) | 0);
      dude.position = gridPoints[i];
      app.stage.addChild(dude);
      const style = new TextStyle({
        fontFamily: "Snippet",
        fontSize: "16px",
        fill: "white",
      });
      const text = new Text("rotate= " + i, style);
      text.x = dude.x - dude.width / 2;
      text.y = dude.y - dude.height / 2 - 30;
      app.stage.addChild(text);
    }
  }
  setTimeout(() => {
    destroyApp(app);
    texturesBasic();
  }, delayDemo);
}

function texturesBasic() {
  const app = initApp();

  const container = new Container();

  const texture = Texture.fromImage("assets/bunny64.png");
  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.scale.set(0.5);
    bunny.x = (i % 5) * 30;
    bunny.y = ((i / 5) ^ 0) * 30;
    bunny.rotation = Math.random() * Math.PI * 2;
    container.addChild(bunny);
  }

  console.log(container.width, container.height);

  app.stage.addChild(container);

  const brt = new BaseRenderTexture(400, 400, SCALE_MODES.LINEAR, 1);
  const rt = new RenderTexture(brt);
  const sprite = new Sprite(rt);
  sprite.position.set(300, 60);

  app.stage.addChild(sprite);

  container.position.set(100, 60);

  app.ticker.add(() => {
    app.renderer.render(container, rt);
    console.log(container.width, container.height, sprite.width);
  });
  setTimeout(() => {
    destroyApp(app);
    texturesAdvanced();
  }, delayDemo);
}

function texturesAdvanced() {
  const app = initApp();

  //create two render textures
  let rndOne = RenderTexture.create(width, height);
  let rndTwo = RenderTexture.create(width, height);

  let currentRndTexture = rndOne;

  const outputSprite = new Sprite(currentRndTexture);
  outputSprite.anchor.set(0.5);
  outputSprite.position.set(width / 2, height / 2);

  app.stage.addChild(outputSprite);

  const stuffContainer = new Container();
  stuffContainer.position.set(width / 2, height / 2);
  app.stage.addChild(stuffContainer);

  //create array of images
  loader.add("fruits", "assets/fruits.json").load(onLoadAssets);
  const itemFrames: string[] = [
    "tomato64.png",
    "lime64.png",
    "pineapple64.png",
    "watermelon64.png",
  ];
  const items: Sprite[] = [];
  function onLoadAssets(loader: loaders.Loader, resource: ExtendedResource) {
    itemFrames.forEach((frame) => {
      //triple the item
      for (let j = 0; j < 3; j++) {
        const currentTexture = Texture.fromFrame(frame);
        const sprite = new Sprite(currentTexture);
        sprite.x = (Math.random() * width) / 2 - width / 4;
        sprite.y = (Math.random() * height) / 2 - height / 3;
        sprite.anchor.set(0.5);
        stuffContainer.addChild(sprite);
        items.push(sprite);
      }
    });

    let count = 0;

    app.ticker.add(() => {
      count += 0.01;
      items.forEach((item) => {
        item.rotation += 0.1;
      });

      //swapping the buffers
      currentRndTexture = rndOne;
      rndOne = rndTwo;
      rndTwo = currentRndTexture;

      outputSprite.texture = rndOne;

      stuffContainer.rotation -= 0.01;
      outputSprite.scale.set(1 + Math.sin(count) * 0.5);

      app.renderer.render(app.stage, rndTwo, false);
      if (count > Math.PI * 2) count = 0;
    });
  }

  setTimeout(() => {
    destroyApp(app);
    texturesGradient();
  }, delayDemo);
}

function texturesGradient() {
  const app = initApp();

  function createGradient() {
    const quality = 256;
    const canvas = document.createElement("canvas");
    canvas.width = quality;
    canvas.height = 1;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    //use canvas2d API to create gradient
    const grd: CanvasGradient = ctx!.createLinearGradient(0, 0, quality, 0);
    grd.addColorStop(0, "rgba(255,255,255,0.0)");
    grd.addColorStop(0.3, "cyan");
    grd.addColorStop(0.7, "red");
    grd.addColorStop(1, "green");

    ctx!.fillStyle = grd;
    ctx!.fillRect(0, 0, quality, 1);

    return Texture.fromCanvas(canvas);
  }

  const gradientTexture = createGradient();

  const sprite = new Sprite(gradientTexture);
  sprite.position.set(150, 50);
  sprite.rotation = Math.PI / 8;
  sprite.width = 500;
  sprite.height = 50;
  app.stage.addChild(sprite);
}

texturesRotate();
