import {
  loader,
  loaders,
  Texture,
  Container,
  Sprite,
  Graphics,
  TextStyle,
  Text,
  RenderTexture,
  interaction,
  Point,
  mesh,
  BLEND_MODES,
} from "pixi.js";
import { delayDemo, height, destroyApp, initApp, width } from "./initApp";
import Reel from "./Reel";
import BounceBox from "./BounceBox";
import ExtendedResource from "./ExtendResource";
import { PixelateFilter } from "pixi-filters";
import delay from "./delay";
import Star from "./Star";

function demosAdvancedSlots() {
  const REEL_WIDTH = 160;
  const SYMBOL_SIZE = 150;
  const symbolFrames = [
    "tomato64.png",
    "pineapple64.png",
    "lime64.png",
    "watermelon64.png",
  ];

  const app = initApp();

  loader.add("assets/fruits.json").load(onAssetsLoad);

  function onAssetsLoad(loader: loaders.Loader, resources: loaders.Resource) {
    //create slot symbol textures
    const slotTextures: Texture[] = [];
    symbolFrames.forEach((frame) => {
      const texture = Texture.fromFrame(frame);
      slotTextures.push(texture);
    });

    //create reels
    const reels = [] as Reel[];
    const reelContainer = new Container();

    for (let i = 0; i < 5; i++) {
      const rc = new Container();
      rc.x = i * REEL_WIDTH;
      reelContainer.addChild(rc);

      const reel = new Reel();

      reel.container = rc;
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;

      rc.filters = [reel.blur];

      //build symbols
      for (let j = 0; j < 4; j++) {
        const symbol = new Sprite(
          slotTextures[(Math.random() * slotTextures.length) ^ 0]
        );
        symbol.width = SYMBOL_SIZE;
        symbol.height = SYMBOL_SIZE;
        symbol.y = j * SYMBOL_SIZE;
        //TODO: symbol.x
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      reels.push(reel);
    }
    //build top and bottom covers
    const margin = (height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = width - REEL_WIDTH * 5;

    const top = new Graphics();
    //app.stage.addChild(top)
    top.beginFill(0x993300, 1);
    top.drawRect(0, 0, width, margin);
    top.endFill();

    const bottom = top.clone();
    //app.stage.addChild(bottom)
    bottom.position.set(0, height - margin);

    //add play text
    const style = new TextStyle({
      fontFamily: "Snippet",
      fontSize: 36,
      fontStyle: "italic",
      fill: ["#ffffff", "#00ff99"],
      strokeThickness: 5,
      wordWrap: true,
      wordWrapWidth: 440,
      dropShadow: true,
    });

    const playText = new Text("Spin the wheels", style);
    playText.x = (width - playText.width) / 2;
    playText.y = (margin - playText.height) / 2;
    bottom.addChild(playText);

    //add header text
    const headerText = new Text("PIXI FRUIT SLOTS", style);
    headerText.x = (width - headerText.width) / 2;
    headerText.y = (margin - headerText.height) / 2;
    top.addChild(headerText);

    //add interactivity
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.on("pointertap", rotateWheel);

    headerText.interactive = true;
    headerText.buttonMode = true;
    headerText.on("pointertap", onStartStop);

    let state = true;
    function onStartStop() {
      state = !state;
    }

    let running = false;
    function rotateWheel() {
      if (running || !state) return;
      running = true;

      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = (Math.random() * 3) ^ 0;

        //TODO: call tweenTo with proper arguments
        const target = r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;
        const complete = i === reels.length - 1 ? reelsComplete : null;
        tweenTo(r, "position", target, time, backout(0.5), null, complete);
      }
    }

    //reels done handler
    function reelsComplete() {
      running = false;
    }

    app.stage.addChild(reelContainer, top, bottom);

    //listen for animate update

    const bounce = new BounceBox(REEL_WIDTH, height - 2 * SYMBOL_SIZE);

    app.ticker.add((delta) => {
      reels.forEach((r, i) => {
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        //update symbol position on reel
        r.symbols.forEach((s, j) => {
          const prevY = s.y;
          const a1 = r.position + j;
          const a2 = a1 % r.symbols.length;
          const a3 = a2 * SYMBOL_SIZE;
          const a4 = a3 - SYMBOL_SIZE;
          //console.log(a1, a2, a3, a4);
          s.y =
            ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;

          //s.y +=3+ i*5;

          //bounce.keepSpriteInBounce(s)

          if (s.y < 0 && prevY > SYMBOL_SIZE) {
            //Detect going over and swap textures
            s.texture = slotTextures[(Math.random() * slotTextures.length) ^ 0];
            s.width = s.height = SYMBOL_SIZE;
          }
        });
      });
    });
  }
  const tweens: any[] = [];

  function tweenTo(
    object: Reel,
    property: string,
    target: number,
    time: number,
    easing: Function,
    onchange: Function | null,
    oncomplete: Function | null
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property] as number,
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };
    tweens.push(tween);
    return tween;
  }

  //listen to animate update
  app.ticker.add((delta) => {
    const now = Date.now();
    const remove: any[] = [];
    tweens.forEach((t) => {
      const phase = Math.min(1, (now - t.start) / t.time);
      t.object[t.property] = lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    });
    remove.forEach((r) => {
      tweens.splice(tweens.indexOf(r), 1);
    });
    //console.log(tweens.length);
    //console.log(remove.length);
  });

  //Basic leap function
  function lerp(a1: number, a2: number, t: number) {
    const val = a1 * (1 - t) + a2 * t;
    //console.log(val);
    return val;
  }

  //Backout function from tweenjs
  function backout(amount: number) {
    return function (t: number) {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  }
  // function backout(amount:number) {
  //   return function (t:number) {
  //     return 1;
  //   }
  // }
  setTimeout(() => {
    destroyApp(app);
    demosAdvancedScratchcard();
  }, delayDemo);
}

function demosAdvancedScratchcard() {
  const app = initApp();

  const brush = new Graphics();
  brush.beginFill(0xff3300, 1);
  brush.drawCircle(0, 0, 30);
  brush.endFill();

  loader
    .add("rainbow", "assets/rainbow.png")
    .add("grass", "assets/grass.png")
    .load(onAssetsLoad);

  function onAssetsLoad(loader: loaders.Loader, resources: ExtendedResource) {
    const background = new Sprite(resources.grass.texture);
    background.width = width;
    background.height = height;
    app.stage.addChild(background);

    const imageToReveal = new Sprite(resources.rainbow.texture);
    imageToReveal.width = width;
    imageToReveal.height = height;
    app.stage.addChild(imageToReveal);

    const renderTexture = RenderTexture.create(width / 2, height / 2);
    const renderTextureSprite = new Sprite(renderTexture);
    //renderTextureSprite.position.set(width / 2, height / 2);
    app.stage.addChild(renderTextureSprite);

    imageToReveal.mask = renderTextureSprite;

    app.stage.interactive = true;
    app.stage.on("pointerdown", onDown);
    app.stage.on("pointermove", onMove);
    app.stage.on("pointerup", onUp);

    let dragging = false;

    function onDown(event: interaction.InteractionEvent) {
      dragging = true;
      onMove(event);
    }

    function onMove(event: interaction.InteractionEvent) {
      if (dragging) {
        brush.position.copy(event.data.global);
        app.renderer.render(brush, renderTexture, true, undefined, false);
        //console.log(event.data.global);
      }
    }

    function onUp(event: interaction.InteractionEvent) {
      dragging = false;
    }
  }
  setTimeout(() => {
    destroyApp(app);
    demosAdvancedMouseTrail();
  }, delayDemo);
}

function demosAdvancedMouseTrail() {
  const app = initApp();

  const trailTexture = Texture.fromImage("assets/trail.png");

  const historyX: number[] = [];
  const historyY: number[] = [];
  const historySize = 50;

  const ropeSize = 100;
  const points: Point[] = [];

  // for (let i = 0; i < historySize; i++){
  //   historyX.push(0);
  //   historyY.push(0);
  // }

  repeats(historySize, (index: number) => {
    historyX.push(0);
    historyY.push(0);
  });

  //create rope points
  // for (let i = 0; i < ropeSize; i++){
  //   points.push(new Point(0, 0));
  // }

  repeats(ropeSize, (index: number) => {
    points.push(new Point(0, 0));
  });

  //create rope
  const rope = new mesh.Rope(trailTexture, points);

  //set the blendmode
  rope.blendMode = BLEND_MODES.ADD;

  app.stage.addChild(rope);

  app.ticker.add(() => {
    //implementing this property with plugin mouse global may not update on certain devices
    const mousePosition = app.renderer.plugins.interaction.mouse.global;
    //console.log(mousePosition);

    //update mouse value to history
    historyX.pop();
    historyX.unshift(mousePosition.x);
    historyY.pop();
    historyY.unshift(mousePosition.y);

    points.forEach((p, index) => {
      const ix = cubicInterpolation(historyX, (index / ropeSize) * historySize);
      const iy = cubicInterpolation(historyY, (index / ropeSize) * historySize);
      p.x = ix;
      p.y = iy;
    });
  });

  function clipInput(k: number, array: number[]) {
    if (k < 0) k = 0;
    if (k > array.length - 1) k = array.length - 1;
    return array[k];
  }

  function getTangent(k: number, factor: number, array: number[]) {
    return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
  }

  function cubicInterpolation(array: number[], t: number, tangentFactor = 1) {
    //if (!tangentFactor) tangentFactor = 1;

    //round number down
    const k = t ^ 0;
    const m = [
      getTangent(k, tangentFactor, array),
      getTangent(k + 1, tangentFactor, array),
    ];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (
      (2 * t3 - 3 * t2 + 1) * p[0] +
      (t3 - 2 * t2 + t) * m[0] +
      (-2 * t3 + 3 * t2) * p[1] +
      (t3 - t2) * m[1]
    );
  }
  setTimeout(() => {
    destroyApp(app);
    demosAdvancedStarWarp();
  }, delayDemo);
}

function demosAdvancedStarWarp() {
  const app = initApp();

  const starTexture = Texture.fromImage("assets/star.png");

  const config = {
    starAmount: 1000,
    cameraZ: 0,
    fov: 20,
    baseSpeed: 0.025,
    speed: 0,
    warpSpeed: 0,
    starStretch: 5,
    starBaseSize: 0.05,
  };

  let {
    starAmount,
    cameraZ,
    fov,
    baseSpeed,
    speed,
    warpSpeed,
    starStretch,
    starBaseSize,
  } = config;

  //create stars
  const stars: Star[] = [];
  repeats(starAmount, (index: number) => {
    const star = new Star(starTexture);
    star.sprite.anchor.set(0.5, 0.7);
    star.randomize(cameraZ, true);
    app.stage.addChild(star.sprite);
    stars.push(star);
  });

  //change flight speed every 5 seconds
  setInterval(() => {
    warpSpeed = warpSpeed ? 0 : 1;
  }, 5000);

  //listen to animate updates
  app.ticker.add((delta) => {
    speed += (warpSpeed - speed) / 20;
    cameraZ += delta * 10 * (speed + baseSpeed);
    stars.forEach((star) => {
      if (star.z < cameraZ) star.randomize(cameraZ);

      //map star 3d position to 2d with really simple projection
      const z = star.z - cameraZ;
      star.sprite.x = star.x * (fov / z) * width + width / 2;
      star.sprite.y = star.y * (fov / z) * width + width / 2;

      //calculate scale and rotation
      const dxCenter = star.sprite.x - width / 2;
      const dyCenter = star.sprite.y - height / 2;
      const distanceCenter = Math.sqrt(dxCenter ** 2 + dyCenter ** 2);
      const distanceScale = Math.max(0, (2000 - z) / 2000);
      star.sprite.scale.x = distanceScale * starBaseSize;
      star.sprite.scale.y =
        distanceScale * starBaseSize +
        (distanceScale * speed * starStretch * distanceCenter) / width;
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    });
  });
}
demosAdvancedSlots();

function repeats(repeats: number, cb: Function) {
  for (let i = 0; i < repeats; i++) {
    cb(i);
  }
}
