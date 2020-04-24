//TODO: https://github.com/kittykatattack/learningPixis

import { Sprite, Ellipse } from "pixi.js";
import Bunny from "./Bunny";
import Key from "./Key";
import Collision from "./Collision";

const app = new PIXI.Application({
  backgroundColor: 0xaaaaaa,
  antialias: true,
  resolution: 1,
  transparent:false
});

document.body.appendChild(app.view);
function progressLoadingHandler(
  loader: PIXI.loaders.Loader,
  resource: PIXI.loaders.Resource
) {
  console.log(loader.progress, resource.name);
}

//load separate files
// PIXI.loader
//   .add([
//     { name: "bunny1", url: "./assets/bunny1.png" },
//     { name: "bunny2", url: "./assets/bunny2.png" },
//     { name: "bunny3", url: "./assets/bunny3.png" },
//   ])
//   .on("progress", progressLoadingHandler)
//   .load((loader, resources) => {
//     //renderer object}
//     app.renderer.backgroundColor = 0x0;

//     const bunnyTexture = resources.bunny1.texture;

//     // This creates a texture from a 'bunny1.`png' image
//     const bunny1 = new PIXI.Sprite(resources.bunny1.texture);
//     const bunny2 = new PIXI.Sprite(resources.bunny2.texture);
//     const bunny3 = new PIXI.Sprite(resources.bunny3.texture);

//     //add interactivity
//     bunny1.interactive = true;
//     bunny1.cursor = "wait";
//     //bunny1.buttonMode = true;

//     // Setup the position of the bunny1
//     bunny1.x = (app.renderer.width / 7) * 2;
//     bunny1.y = (app.renderer.height / 7) * 2;
//     bunny2.x = (app.renderer.width / 7) * 4;
//     bunny2.y = (app.renderer.height / 7) * 4;
//     bunny3.x = (app.renderer.width / 7) * 6;
//     bunny3.y = (app.renderer.height / 7) * 6;
//     // Rotate around the center
//     bunny1.anchor.x = 0.5;
//     bunny1.anchor.y = 0.5;
//     bunny2.anchor.x = 0.5;
//     bunny2.anchor.y = 0.5;
//     bunny3.anchor.x = 0.5;
//     bunny3.anchor.y = 0.5;

//     // Add the bunny1 to the scene we are building
//     app.stage.addChild(bunny3, bunny2, bunny1);

//     let delta = -1;
//     // Listen for frame updates

//     let bunnyNum = 1;
//     setInterval(() => {
//       bunny1.texture = resources[`bunny${bunnyNum}`].texture;
//       bunnyNum++;
//       if (bunnyNum > 3) bunnyNum = 1;
//     }, 1000);

//     bunny2.anchor.set(0, 0.5);

//     app.ticker.add(() => {
//       // each frame we spin the bunny1 around a bit
//       delta += 0.01;
//       Math.sin(delta);
//       //bunny1.rotation = delta;
//       //bunny1.rotation += delta;

//       bunny2.rotation = Math.sin(delta);
//       bunny1.x += Math.sin(delta);
//       bunny1.scale.x = Math.sin(delta);
//       bunny2.scale.x = Math.sin(delta);
//       //bunny2.scale.set(delta, delta);
//       bunny3.scale.x = Math.sin(delta);

//       //console.log(delta);
//     });
//   });

//load tileset

PIXI.loader
  .add("./assets/tileset.json")
  .on("progress", progressLoadingHandler)
  .load((loader, resources) => {
    //renderer object}
    app.renderer.backgroundColor = 0x0;

    // This creates a texture from a 'bunny1.`png' image
    //1. from resources
    const bunny1 = new PIXI.Sprite(
      resources["./assets/tileset.json"].textures["bunny1.png"]
    );
    //2. from TextureCache
    const bunny2 = new PIXI.Sprite(PIXI.utils.TextureCache["bunny2.png"]);

    //3. from alias
    const id = PIXI.loader.resources["./assets/tileset.json"]
      .textures as PIXI.loaders.TextureDictionary;
    const bunny3 = new PIXI.Sprite(id["bunny3.png"]);

    //add interactivity
    bunny1.interactive = true;
    bunny1.cursor = "wait";
    //bunny1.buttonMode = true;

    // Setup the position of the bunny1
    bunny1.x = (app.renderer.width / 7) * 2;
    bunny1.y = (app.renderer.height / 7) * 2;
    bunny2.x = (app.renderer.width / 7) * 4;
    bunny2.y = (app.renderer.height / 7) * 4;
    bunny3.x = (app.renderer.width / 7) * 6;
    bunny3.y = (app.renderer.height / 7) * 6;
    // Rotate around the center
    bunny1.anchor.x = 0.5;
    bunny1.anchor.y = 0.5;
    bunny2.anchor.x = 0.5;
    bunny2.anchor.y = 0.5;
    bunny3.anchor.x = 0.5;
    bunny3.anchor.y = 0.5;

    //moving

    const bunny4 = new Bunny(id["bunny3.png"]);
    bunny4.anchor.set(0.5, 0.5);
    bunny4.position.set(100, 400);

    // Add the bunny1 to the scene we are building
    app.stage.addChild(bunny3, bunny2, bunny1, bunny4);

    let delta = 0;
    // Listen for frame updates

    bunny2.anchor.set(0, 0.5);
    let offset = 1;
    app.ticker.add(() => {
      // each frame we spin the bunny1 around a bit
      delta += 0.01;

      //2*Math.PI = 360 degree
      if (delta > 2 * Math.PI) delta = 0;
      Math.sin(delta);
      //bunny1.rotation = delta;
      //bunny1.rotation += delta;

      bunny2.rotation = Math.sin(delta);
      bunny1.x += Math.sin(delta);
      bunny1.scale.x = Math.sin(delta);
      bunny2.scale.x = Math.sin(delta);
      //bunny2.scale.set(delta, delta);
      bunny3.scale.x = Math.sin(delta);

      //console.log(delta);
    });

    //add another cb in game-loop
    app.ticker.add(bunny4Loop);

    //let gravity = 0.1;
    //add velocity
    //use velocity to control speed and directions

    //bunny4.vRight = 3;
    function bunny4Loop() {
      //if (bunny4.y > 400) bunny4.vUp = -bunny4.vUp;
      //if (bunny4.y < 200) bunny4.vDown = -bunny4.vDown;
      //bunny4.y += offset +gravity;
      //gravity += offset * 0.1;
      //console.log(bunny4.y)
      //move up/down by 1px
      //bunny4.y += offset * 1;
      bunny4.y += bunny4.vy();
      //bunny4.vy +=0.3;
      bunny4.x += bunny4.vx();
    }

    //Game
    interface GameState {
      (delta?: number): void;
    }
    const states: GameState[] = [play, stop];

    //add control keys
    const values = ["Left", "Right", "Up", "Down"];
    const speed = 1;

    type moveAliases = "left" | "right" | "up" | "down";

    const keys = values.map((value) => new Key(`Arrow${value}`));

    keys.forEach((key, index) => {
      key.press = () => {
        //console.log(key.value);
        bunny4.moves[values[index].toLowerCase() as moveAliases] = speed;
        //bunny4[] = moves[index][1];
      };
      key.release = () => {
        //console.log(key.value);
        bunny4.moves[values[index].toLowerCase() as moveAliases] = 0;
      };
    });

    // keys[0].press = () => {
    //   bunny4.vLeft = 5;
    // };
    // keys[0].release = () => {
    //   bunny4.vLeft = 0;
    // };
    // keys[1].press = () => {
    //   bunny4.vRight = 5;
    // };
    // keys[1].release = () => {
    //   bunny4.vRight = 0;
    // };
    // keys[2].press = () => {
    //   bunny4.vUp = 5;
    // };
    // keys[2].release = () => {
    //   bunny4.vUp = 0;
    // };
    // keys[3].press = () => {
    //   bunny4.vDown = 5;
    // };
    // keys[3].release = () => {
    //   bunny4.vDown = 0;
    // };

    let state = play;
    let index = 0;
    setInterval(() => {
      index ^= 1;
      state = states[index];
    }, 3000);

    function play(delta?: number) {
      //TODO: do here some sprite updates
      //console.log("play")
      //console.log(keyA.isDown);
    }

    function stop(delta?: number) {
      //TODO: do here some sprite updates
      //console.log("stop");
      //console.log(keyA.isDown);
    }

    function gameLoop(delta: number) {
      state(delta);
    }

    app.ticker.add((delta) => gameLoop(delta));

    //grouping sprites
    const groupBunnies: Bunny[] = [];
    const fastGroupBunnies: Bunny[] = [];
    let x = 0;
    let y = 0;
    for (let i = 1; i <= 25; i++) {
      const currentBunny = new Bunny(id["bunny3.png"]);
      const fastCurrentBunny = new Bunny(id["bunny2.png"]);
      currentBunny.x = x * 120;
      currentBunny.y = y * 120;
      fastCurrentBunny.x = x * 120;
      fastCurrentBunny.y = y * 120;

      x++;
      if (!(i % 5)) {
        y += 1;
        x = 0;
      }

      groupBunnies.push(currentBunny);
      fastGroupBunnies.push(fastCurrentBunny);
    }

    const containerBunnies = new PIXI.Container();
    //fast container PIXI.particles.ParticleContainer
    const fastContainerBunnies = new PIXI.particles.ParticleContainer(1500, {
      rotation: true,
      scale: true,
      position: true,
      alpha: true,
      tint: true,
    });
    containerBunnies.position.set(
      app.renderer.width / 2,
      app.renderer.height / 2
    );
    groupBunnies.forEach((b, index) => {
      containerBunnies.addChild(b);
      fastContainerBunnies.addChild(fastGroupBunnies[index]);
    });
    containerBunnies.pivot = new PIXI.Point(
      containerBunnies.width / 2,
      containerBunnies.height / 2
    );
    containerBunnies.alpha = 0.8;
    containerBunnies.scale.set(0.5, 0.5);

    fastContainerBunnies.position.set(650, 150);
    fastContainerBunnies.pivot = new PIXI.Point(290, 290);
    fastContainerBunnies.scale.set(0.3, 0.3);

    app.stage.addChild(containerBunnies);
    app.stage.addChild(fastContainerBunnies);

    groupBunnies.forEach((b) => {
      console.log(b.getGlobalPosition());
    });

    console.log(
      groupBunnies[0].toLocal(groupBunnies[0].position, groupBunnies[25]).x
    );
    console.log(
      groupBunnies[0].toLocal(groupBunnies[0].position, groupBunnies[25]).y
    );

    delta = 0;
    app.ticker.add(() => {
      containerBunnies.rotation += 0.01;
      //fastContainerBunnies.rotation += 0.1;
      fastGroupBunnies.forEach((b) => {
        b.x += Math.sin(delta);
      });
      delta += 0.05;
    });

    //PIXI Graphics

    //Rectangle
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x66ccff);
    rectangle.lineStyle(2, 0xff0000, 1);
    rectangle.drawRect(0, 0, 50, 50);
    rectangle.endFill();
    rectangle.position.set(50, 200);
    app.stage.addChild(rectangle);

    //Circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0x0000ff);
    circle.lineStyle(2, 0xffffff, 1);
    circle.drawCircle(0, 0, 15);
    circle.position.set(50, 300);
    circle.endFill();
    app.stage.addChild(circle);

    //Ellipses
    const ellipse = new PIXI.Graphics();
    ellipse.beginFill(0xaaaa22);
    ellipse.lineStyle(2, 0xffffff, 1);
    ellipse.drawEllipse(0, 0, 100, 40);
    ellipse.position.set(150, 500);
    ellipse.endFill();
    app.stage.addChild(ellipse);

    //Rounded rectangle
    const roundedRectangle = new PIXI.Graphics();
    roundedRectangle.beginFill(0x993322);
    roundedRectangle.lineStyle(2, 0xffffff, 1);
    roundedRectangle.drawRoundedRect(0, 0, 200, 50, 5);
    roundedRectangle.position.set(260, 520);
    roundedRectangle.endFill();
    app.stage.addChild(roundedRectangle);

    //Lines
    const line = new PIXI.Graphics();
    line.lineStyle(5, 0xffffff, 1);
    line.moveTo(0, 0);
    line.lineTo(100, 10);
    line.position.set(480, 500);
    app.stage.addChild(line);

    //Polygons
    const path = [0, 0, 0, 20, 50, 20, 0, 0];
    const triangle = new PIXI.Graphics();
    triangle.beginFill(0xbb3344);
    triangle.lineStyle(2, 0xffffff, 1);
    triangle.drawPolygon(path);
    triangle.position.set(650, 400);
    triangle.endFill();
    app.stage.addChild(triangle);

    //Text PIXI.Text
    const message = new PIXI.Text("Hello, Pixi!");
    message.style.fill = "#ffffff";
    message.position.set(500, 550);
    app.stage.addChild(message);

    //Collision detection

    app.ticker.add(collisionDetection);

    function collisionDetection() {
      if (Collision.hasCollision(bunny4, bunny1)) {
        message.text = "Hit";
      } else {
        message.text = "Free ride";
      }
    }
  });
