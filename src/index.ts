import {} from "pixi.js";

const app = new PIXI.Application({
  backgroundColor: 0xaaaaaa,
  antialias: true,
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
    //2. from TextureCashe
    const bunny2 = new PIXI.Sprite(PIXI.utils.TextureCache["bunny2.png"]);

    //3. from alias
    const id = PIXI.loader.resources["./assets/tileset.json"].textures;
    const bunny3 = new PIXI.Sprite(id!["bunny3.png"]);

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

    // Add the bunny1 to the scene we are building
    app.stage.addChild(bunny3, bunny2, bunny1);

    let delta = -1;
    // Listen for frame updates

    bunny2.anchor.set(0, 0.5);

    app.ticker.add(() => {
      // each frame we spin the bunny1 around a bit
      delta += 0.01;
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
  });
