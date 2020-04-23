import { Sprite } from "pixi.js";
import Bunny from "./Bunny";
import Key from "./Key";
import { userInfo } from "os";

const app = new PIXI.Application({
  backgroundColor: 0xaaaaaa,
  antialias: true,
  resolution: 1,
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
    const speed = 5;

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
    const groupBunnys: Bunny[] = [];

    let x = 0;
    let y = 0;
    for (let i = 1; i <= 25; i++) {
      const currentBunny = new Bunny(id["bunny3.png"]);
      currentBunny.x = x * 120;
      currentBunny.y = y * 120;
      x++;
      if (!(i % 5)) {
        y += 1;
        x = 0
      }

      groupBunnys.push(currentBunny);
    }

    const containerBunnys = new PIXI.Container();
    containerBunnys.position.set(
      app.renderer.width / 2,
      app.renderer.height / 2
    );
    groupBunnys.forEach((b) => {
      containerBunnys.addChild(b);
    });
    containerBunnys.pivot = new PIXI.Point(
      containerBunnys.width / 2,
      containerBunnys.height / 2
    );
    containerBunnys.alpha = 0.8;
    containerBunnys.scale.set(0.5, 0.5);
    app.stage.addChild(containerBunnys);

    groupBunnys.forEach(b=>{
      console.log(b.getGlobalPosition());
    })

    console.log(groupBunnys[0].toLocal(groupBunnys[0].position,groupBunnys[25]).x);
    console.log(groupBunnys[0].toLocal(groupBunnys[0].position,groupBunnys[25]).y);

    app.ticker.add(() => {
      containerBunnys.rotation += 0.01;
    });
  });
