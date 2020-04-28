import {
  Sprite,
  Text,
  Container,
  Application,
  TextStyle,
  loader,
  extras,
} from "pixi.js";
import BounceBox from "./BounceBox";

const delayDemo = 3000;

function textDemo() {
  const app = initApp();
  //Simple usage of the text
  const basicText = new Text("Hello, PIXIjs.");
  basicText.anchor.set(0.5);
  basicText.y = basicText.width / 2;
  app.stage.addChild(basicText);

  //Add style
  const style = new TextStyle({
    fontFamily: "Serif",
    fontSize: 36,
    fontWeight: "bold",
    fill: ["#ffffff", "#ffaa99"], //gradient
    stroke: "ff0000",
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "0x000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 400,
  });

  const richText = new Text(
    "Rich text with a lot of options and across multiple lines",
    style
  );
  richText.anchor.set(0.5);
  richText.position.set(app.renderer.width / 2, app.renderer.height / 2);

  app.stage.addChild(richText);
  let radian = 0;
  const bounce = new BounceBox(app.renderer.width, app.renderer.height);
  app.ticker.add(() => {
    basicText.rotation += 0.01;
    basicText.x += 3;
    bounce.keepSpriteInBounce(basicText);

    richText.scale.x = Math.sin(radian);
    radian += 0.01;
    if (radian > Math.PI * 2) radian = 0;
  });

  app.start();
  setTimeout(() => {
    destroy(app);
    bitmapTextDemo();
  }, delayDemo);
}

function bitmapTextDemo() {
  const app = initApp();
  loader.add("assets/font/desyrel.xml").load(onLoadAssets);
  function onLoadAssets() {
    console.log("loded");
    const bitmapFontText = new extras.BitmapText(
      "bitmap fonts are supported\nWoo yay!",
      {
        font: "50px Desyrel",
        align: "left",
      }
    );
    bitmapFontText.position.set(50, 200);
    app.stage.addChild(bitmapFontText);
  }
  app.start();
  setTimeout(() => {
    destroy(app);
    webFontDemo();
  }, delayDemo);
}

function webFontDemo() {
  const app = initApp();

  const textSample = new Text(
    "Pixi.js text using the\ncustom Snippet Webfont",
    {
      fontFamily: "Snippet",
      fill: "white",
      fontSize: 50,
      align: "left",
    }
  );

  textSample.position.set(50, 200);
  app.stage.addChild(textSample);
  app.start();
  setTimeout(() => {
    destroy(app);
  }, delayDemo);
}

textDemo();

function destroy(app: Application) {
  document.body.removeChild(app.view);
  app.destroy();
}

function initApp() {
  const app = new Application({
    backgroundColor: 0x993300,
    autoStart: false,
  });
  document.body.appendChild(app.view);
  return app;
}
