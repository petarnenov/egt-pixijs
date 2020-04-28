import Example from "./Example";
import {
  Application,
  interaction,
  Texture,
  loaders,
  extras,
  Sprite,
  Graphics,
} from "pixi.js";

init();

function init() {
  // const width = window.innerWidth;
  // const height = window.innerHeight;
  const width = 800;
  const height = 600;
  const delayDemo = 3000;

  const app = getApp();
  app.loader
    .add("explosion", "assets/explosion/explosion.json")
    .load(spriteBasic);

  function getApp() {
    return new Application({
      width,
      height,
      antialias: true,
      resolution: 1,
      autoStart: false,
    });
  }

  // const screenWidth = app.screen.width;
  // const screenHeight = app.screen.height;

  function spriteBasic() {
    const app = getApp();
    const basicExample = new Example(app);

    const faceContainer = basicExample.addContainer("faces");
    const faceTexture = basicExample.addTexture("face", "assets/face.png");
    const face = basicExample.addSprite("face0", faceTexture);
    face.anchor.set(0.5);
    face.position.set(width / 2, height / 2);
    basicExample.addSpriteToContainer(face, faceContainer);
    basicExample.addContainerToStage("faces");
    basicExample.addToTicker((deltaTime) => {
      face.rotation += 0.01;
    });
    basicExample.start();
    setTimeout(() => {
      basicExample.destroy();
      textureSwapExample();
    }, delayDemo);
  }

  function textureSwapExample() {
    //const app = getApp();
    let hasTaped = false;
    const textureSwapExample = new Example(app);
    const container = textureSwapExample.addContainer("fruits");
    const tomatoTexture = textureSwapExample.addTexture(
      "tomato",
      "assets/tomato64.png"
    );
    const pineappleTexture = textureSwapExample.addTexture(
      "pineapple",
      "assets/pineapple64.png"
    );
    const dude = textureSwapExample.addSprite("dude", tomatoTexture);
    dude.anchor.set(0.5);
    dude.position.set(width / 2, height / 2);

    dude.interactive = true;
    dude.buttonMode = true;

    dude.on("pointertap", (e: interaction.InteractionEvent) => {
      hasTaped = !hasTaped;
      if (hasTaped) {
        dude.texture = tomatoTexture;
        dude.scale.set(1);
      } else {
        dude.texture = pineappleTexture;
        dude.scale.set(2);
      }
    });

    textureSwapExample.addSpriteToContainer(dude, container);
    textureSwapExample.addContainerToStage("fruits");

    textureSwapExample.addToTicker((deltaTime) => {
      dude.rotation += 0.01;
    });

    textureSwapExample.start();
    setTimeout(() => {
      textureSwapExample.destroy();
      spriteExplosion();
    }, delayDemo);
  }

  function spriteExplosion() {
    const app = getApp();
    document.body.appendChild(app.view);

    // app.loader
    //   .add("explosion", "assets/explosion/explosion.json")
    //   .load(onLoadAssets);

    // function onLoadAssets() {
    demo();
    function demo() {
      const explosionTextures = [] as Texture[];
      for (let i = 0; i < 10; i++) {
        const currentExplosion = PIXI.Texture.fromFrame("exp" + i + ".png");
        explosionTextures.push(currentExplosion);
      }
      for (let i = 0; i < 20; i++) {
        const exp = new PIXI.extras.AnimatedSprite(explosionTextures);
        //exp.position.set(width / 2, height / 2);
        exp.position.set(Math.random() * width, Math.random() * height);
        //exp.anchor.set(0.5);
        exp.rotation = Math.random() * Math.PI;
        exp.updateAnchor = true;
        exp.animationSpeed = Math.random();
        //play random texture from texture array
        //exp.gotoAndPlay(Math.random() * 11);
        exp.play();
        app.stage.addChild(exp);
      }

      let index = 0;
      // app.ticker.add(() => {
      //   if (index % 10) {
      //     exp.position.y -= 20 * (index % 10);
      //   } else {
      //     exp.position.y = height / 2;
      //     index=0;
      //   }
      //   exp.gotoAndPlay(index % 10);
      //   index++;
      // });

      app.start();
      setTimeout(() => {
        document.body.removeChild(app.view);
        app.destroy();
        spriteJet();
      }, delayDemo);
    }
  }

  function spriteJet() {
    const app = getApp();
    document.body.appendChild(app.view);

    // app.loader
    //   .add("explosion", "assets/explosion/explosion.json")
    //   .load(onLoadAssets);

    //function onLoadAssets() {
    demo();
    function demo() {
      const expTextures = [];
      for (let i = 0; i < 11; i++) {
        const exp = Texture.fromFrame("exp" + i + ".png");
        expTextures.push(exp);
      }

      const explosion = new PIXI.extras.AnimatedSprite(expTextures);
      explosion.anchor.set(0.5);
      explosion.position.set(width / 2, height / 2);
      explosion.animationSpeed = 0.1;
      //explosion.updateAnchor=true;
      explosion.play();

      app.stage.addChild(explosion);
      app.ticker.add(() => {
        explosion.rotation += 0.01;
      });
      app.start();
      setTimeout(() => {
        //console.log("remove");
        document.body.removeChild(app.view);
        app.destroy();
        spriteSpeed();
      }, delayDemo);
    }
  }

  function spriteSpeed() {
    const app = getApp();
    document.body.appendChild(app.view);

    // app.loader
    //   .add("explosion", "assets/explosion/explosion.json")
    //   .load(onLoadAssets);

    // function onLoadAssets(
    //   loader: loaders.Loader,
    //   resources: PIXI.loaders.Resource
    // )
    demo();
    function demo() {
      const explosionTextures = [];

      for (let i = 0; i < 11; i++) {
        const frameKey = "exp" + i + ".png";
        const texture = Texture.fromFrame("exp" + i + ".png");
        //FIXME: set proper type to resource.explosion
        //const time = resources.explosion.data.frames[frameKey].duration;
        explosionTextures.push({
          texture,
          time: 16,
        });
      }

      const explosion = new PIXI.extras.AnimatedSprite(explosionTextures);
      explosion.anchor.set(0.5);
      explosion.position.set(width / 2, height / 2);
      explosion.animationSpeed = 0.1;
      explosion.play();
      app.stage.addChild(explosion);
      app.start();

      setTimeout(() => {
        document.body.removeChild(app.view);
        app.destroy();
        spriteTiling();
      }, delayDemo);
    }

    function spriteTiling() {
      const app = getApp();

      document.body.appendChild(app.view);

      const texture = Texture.fromImage("assets/sand.jpg");

      const tilingSprite = new extras.TilingSprite(
        texture,
        app.screen.width,
        app.screen.height
      );

      //const mess = new Text("Hello");

      app.stage.addChild(tilingSprite);

      let count = 0;
      app.ticker.add(() => {
        count += 0.005;
        tilingSprite.tileScale.x = 2 + Math.sin(count);
        tilingSprite.tileScale.y = 2 + Math.cos(count);

        tilingSprite.tilePosition.x += 1;
        tilingSprite.tilePosition.y += 1;
      });

      app.start();
      setTimeout(() => {
        document.body.removeChild(app.view);
        app.destroy();
        spriteVideo();
      }, delayDemo);
    }

    function spriteVideo() {
      const app = getApp();
      document.body.appendChild(app.view);

      const buttonPlay = new Graphics()
        .beginFill(0xff0000, 0.5)
        .drawRoundedRect(0, 0, 100, 100, 10)
        .endFill()
        .beginFill(0xffffff)
        .moveTo(36, 30)
        .lineTo(36, 70)
        .lineTo(70, 50)
        .endFill();

      buttonPlay.interactive = true;
      buttonPlay.buttonMode = true;

      buttonPlay.on("pointertap", onPlay);

      const buttonStop = new Graphics()
        .beginFill(0xff0000, 0.5)
        .drawRoundedRect(0, 0, 100, 100, 10)
        .endFill()
        .beginFill(0xffffff)
        .moveTo(36, 30)
        .lineTo(36, 70)
        .lineTo(70, 70)
        .lineTo(70, 30)
        .endFill();

      buttonStop.interactive = true;
      buttonStop.buttonMode = true;
      buttonStop.visible = false;

      app.stage.addChild(buttonPlay);
      app.stage.addChild(buttonStop);

      function onPlay() {
        buttonPlay.destroy();
        buttonStop.on("pointertap", onStop);
        buttonStop.visible = true;
        const videoTexture = Texture.fromVideo(
          "assets/funny512.mp4",
          undefined,
          undefined,
          false
        );
        const video = new Sprite(videoTexture);
        const videoSource = videoTexture.baseTexture.source as HTMLVideoElement;
        video.anchor.set(0.5);
        video.position.set(width / 2, height / 2);
        app.stage.addChild(video);
        videoSource.play();
        function onStop() {
          buttonStop.destroy();
          videoSource.pause();
          document.body.removeChild(app.view);
          videoTexture.destroy();
          video.destroy();
          app.destroy();
        }
      }
      app.start();
      setTimeout(() => {
        document.body.removeChild(app.view);
        app.destroy();
      }, delayDemo);
    }
  }
}
