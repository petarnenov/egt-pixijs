import {
  Sprite,
  Texture,
  filters,
  Container,
  Graphics,
  interaction,
  extras,
  loader,
  loaders,
  Filter,
} from "pixi.js";
import ExampleSprite from "./ExampleSprite";
import BounceBox from "./BounceBox";
import { deflate } from "zlib";
import ExtendedResource from "./ExtendResource";
import { initApp, destroyApp } from "./initApp";

const width = 800;
const height = 600;
const delayDemo = 5000;
function filtersBlur() {
  const app = initApp();

  const bg = Sprite.fromImage("assets/greenScene.png");
  bg.width = width;
  bg.height = height;
  app.stage.addChild(bg);

  const textureBunny = Texture.fromImage("assets/bunny64.png");
  const bunny1 = new Sprite(textureBunny);
  bunny1.position.set(200, 200);
  const bunny2 = new Sprite(textureBunny);
  bunny2.position.set(520, 200);
  app.stage.addChild(bunny1, bunny2);

  const panda = Sprite.fromImage("assets/panda64.png");
  panda.anchor.set(0.5);
  panda.position.set(width / 2, height / 2);
  panda.scale.set(3);

  app.stage.addChild(panda);

  const blurFilter1 = new filters.BlurFilter();
  const blurFilter2 = new filters.BlurFilter();
  const blurFilter3 = new filters.BlurFilter();

  bunny1.filters = [blurFilter1];
  bunny2.filters = [blurFilter2];
  panda.filters = [blurFilter3];

  let count = 0;

  app.ticker.add(() => {
    count += 0.005;

    const blurAmount1 = Math.sin(count);
    const blurAmount2 = Math.cos(count);

    blurFilter1.blur = 20 * blurAmount1;
    blurFilter2.blur = 20 * blurAmount2;
    blurFilter3.blur = 40 * blurAmount1 * blurAmount2;
  });
  setTimeout(() => {
    destroyApp(app);
    filtersColorMatrix();
  }, delayDemo);
}

function filtersColorMatrix() {
  const app = initApp();
  app.stage.interactive = true;
  const filter = new filters.ColorMatrixFilter();

  const container = new Container();
  container.pivot.set(width / 2, height / 2);
  container.position.set(width / 2, height / 2);

  const bgFront = Sprite.fromImage("assets/rainbow.png");
  bgFront.width = width;
  bgFront.height = height;
  bgFront.position.set(width / 2, height / 2);
  bgFront.anchor.set(0.5);
  container.addChild(bgFront);

  const panda = Sprite.fromImage("assets/panda64.png");
  panda.scale.set(3);
  panda.anchor.set(0.5);
  panda.position.set(width / 2, height / 2);
  container.addChild(panda);

  app.stage.addChild(container);

  app.stage.filters = [filter];
  let count = 0;
  let hasTap = true;
  app.ticker.add(() => {
    count += 0.1;
    bgFront.rotation -= 0.01;

    panda.scale.x = 3 + Math.sin(count) * 0.4;
    panda.scale.y = 3 + Math.cos(count) * 0.4;

    const matrix = filter.matrix;
    matrix[1] = Math.sin(count) * 3;
    matrix[2] = Math.cos(count);
    matrix[3] = Math.cos(count) * 1.5;
    matrix[4] = Math.sin(count / 3) * 2;
    matrix[5] = Math.sin(count / 2);
    matrix[6] = Math.sin(count / 7);
  });

  setTimeout(() => {
    destroyApp(app);
    filtersDMCrawlies();
  }, delayDemo);
}

function filtersDMCrawlies() {
  const app = initApp();
  app.stage.interactive = true;
  app.stage.on("pointermove", onPointerMove).on("mousemove", onPointerMove);
  function onPointerMove(eventData: interaction.InteractionEvent) {
    ring.visible = true;
    displace.position.set(
      eventData.data.global.x - 25,
      eventData.data.global.y
    );
    ring.position.copy(displace.position);
  }

  const container = new Container();
  app.stage.addChild(container);

  const grass = Sprite.fromImage("assets/grass.png");
  grass.width = app.screen.width;
  grass.height = app.screen.height;
  //grass.anchor.set(0.5);
  //grass.position.set(width / 2, height / 2);
  grass.alpha = 0.4;

  //add maggots
  const totalMaggots = 200;
  const maggots = [] as ExampleSprite[];
  const maggotTexture = Texture.fromImage("assets/larva64horizontal.png");

  for (let i = 0; i < totalMaggots; i++) {
    const maggot = new ExampleSprite(maggotTexture);
    maggot.anchor.set(0.5);
    maggot.direction = Math.random() * Math.PI * 2;
    maggot.speed = 1;
    maggot.turningSpeed = Math.random() - 0.8;
    maggot.scale.set(0.7 + Math.random() * 0.3);
    maggot.original.scale.copy(maggot.scale);
    maggot.alpha = 0.4;
    maggot.position.set(Math.random() * width, Math.random() * height);
    maggots.push(maggot);
  }

  container.addChild(...maggots);

  const displace = Sprite.fromImage("assets/circle.png");
  //displace.alpha = 0.1;
  //displace.position.set(width / 2, height / 2);
  const filter = new filters.DisplacementFilter(displace);

  app.stage.addChild(displace);

  const ring = Sprite.fromImage("assets/ring.png");
  ring.anchor.set(0.5);
  ring.visible = false;
  app.stage.addChild(ring);

  container.filters = [filter];
  filter.scale.x = 110;
  filter.scale.y = 110;
  displace.anchor.set(0.5);

  container.addChild(grass);

  const bounce = new BounceBox(width, height);
  let count = 0;
  let maggotSlow = 0;
  let maggotFast = 0;
  app.ticker.add(() => {
    count += 0.05;
    maggotSlow += 0.03;
    maggotFast += 0.07;
    maggots.forEach((maggot, index) => {
      if (index % 2) {
        maggot.speed = 0.3;
        maggot.scale.x = maggot.original.scale.x + Math.sin(maggotSlow) * 0.2;
      } else {
        maggot.speed = 0.7;
        maggot.scale.x = maggot.original.scale.x + Math.sin(maggotFast) * 0.2;
      }
      maggot.direction += maggot.turningSpeed * 0.01;
      maggot.x += Math.sin(maggot.direction) * maggot.speed;
      maggot.y += Math.cos(maggot.direction) * maggot.speed;
      maggot.rotation = -maggot.direction - Math.PI / 2;
      bounce.keepSpriteInBounce(maggot);
    });
  });
  setTimeout(() => {
    destroyApp(app);
    filtersDMFlag();
  }, delayDemo);
}

function filtersDMFlag() {
  const app = initApp();
  app.stage.interactive = true;

  const container = new Container();
  app.stage.addChild(container);

  const flag = Sprite.fromImage("assets/honda.png");
  flag.position.set(100, 100);
  flag.scale.set(1);
  container.addChild(flag);

  const tillingTexture = Texture.fromImage("assets/sand.jpg");
  const tilling = new extras.TilingSprite(tillingTexture, width, height);
  app.stage.addChild(tilling);

  const displace = Sprite.fromImage("assets/displacement-flag.png");
  displace.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

  //const s =

  const filter = new filters.DisplacementFilter(displace);
  const filter2 = new filters.DisplacementFilter(tilling);
  //filter.autoFit = true;
  filter.padding = 50;
  displace.position.set(-430, 50);
  app.stage.addChild(displace);
  flag.filters = [filter];
  filter.scale.x = 50;
  filter.scale.y = 200;

  const bunny = Sprite.fromImage("assets/bunny64.png");
  bunny.position.set(530, 100);
  app.stage.addChild(bunny);
  bunny.filters = [filter];

  let increase = 1;
  let count = 0;
  app.ticker.add(() => {
    count += 0.01;
    //tilling.tilePosition.x++;
    tilling.x += Math.sin(count) * 0.5;
    displace.x += increase;

    if (displace.x > 99) {
      displace.x = -430;
    }
    // if(displace.x<-330){
    //   increase=1;
    // }
  });

  setTimeout(() => {
    destroyApp(app);
    filtersCustomFilter();
  }, delayDemo);
}

function filtersCustomFilter() {
  var deltas: number[] = [];
  const app = initApp();
  app.stage.interactive = true;
  app.stage.on("pointertap", onShowDeltas);
  function onShowDeltas() {
    console.table(deltas);
  }
  const grass = Sprite.fromImage("assets/grass.png");
  grass.width = width;
  grass.height = height;
  app.stage.addChild(grass);

  app.stop();

  loader.add("shader", "filters/shader.frag").load(onLoaded);

  let filter = {} as Filter<{ customUniform: number }>;
  function onLoaded(loader: loaders.Loader, res: ExtendedResource) {
    filter = new Filter(undefined, res.shader.data);

    grass.filters = [filter];
    app.start();
  }

  app.ticker.add((delta) => {
    filter.uniforms.customUniform += 0.04 * delta;
    deltas.push(delta);
  });

  setTimeout(() => {
    destroyApp(app);
  }, delayDemo);
}

filtersBlur();
