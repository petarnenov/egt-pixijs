import {
  Application,
  Texture,
  Sprite,
  settings,
  Graphics,
  Container,
  TextStyle,
  Text,
  SCALE_MODES,
  interaction,
  extras,
} from "pixi.js";
//needs to extend Sprite with some extra props
import ExampleSprite from "./ExampleSprite";
const delayDemo = 3000;

function interactionClick() {
  const app = initApp();
  settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const texture = Texture.fromImage("assets/bunny64.png");
  const bunny = new Sprite(texture);
  bunny.interactive = true;
  bunny.buttonMode = true;
  bunny.on("pointertap", onScaleUp);
  bunny.anchor.set(0.5);
  bunny.position.set(400, 300);

  app.stage.addChild(bunny);

  function onScaleUp() {
    bunny.scale.x *= 1.25;
    bunny.scale.y *= 1.25;
    //console.log(bunny.scale.x);
    if (bunny.scale.x > 12) bunny.scale.set(1);
  }

  setTimeout(() => {
    destroyApp(app);
    interactionInteractivity();
  }, delayDemo);
}

function interactionInteractivity() {
  const app = initApp();

  const lampsOff: Graphics[] = [];
  const lampsOn: Graphics[] = [];
  const button = new Container();

  const baseLampOff = new Graphics();
  baseLampOff.beginFill(0xffff00);
  baseLampOff.drawCircle(0, 0, 8);
  baseLampOff.endFill();

  const baseLampOn = new Graphics();
  baseLampOn.beginFill(0xff0000);
  baseLampOn.drawCircle(0, 0, 8);
  baseLampOn.endFill();

  //baseLampOn.position.set(400, 300)
  //app.stage.addChild(baseLampOn);

  for (let i = 0; i < 6; i++) {
    const lampOff = baseLampOff.clone();
    lampOff.x += 14 + i * 20;
    lampOff.y = 16;
    lampOff.alpha = 0.2;
    lampsOff.push(lampOff);
    const lampOn = baseLampOn.clone();
    lampOn.x += 14 + i * 20;
    lampOn.y = 16;
    lampsOn.push(lampOn);
  }

  const style = new TextStyle({
    fill: "red",
    fontFamily: "serif",
    fontWeight: "bold",
    fontSize: 24,
  });

  const text = new Text("Touch me", style);
  text.y += 24;
  text.x += 8;

  const roundRect = new Graphics();
  roundRect.lineStyle(4, 0xffffff, 1);
  roundRect.beginFill(0xaaaaaa);
  roundRect.drawRoundedRect(0, 0, 128, 64, 8);
  roundRect.endFill();

  button.addChild(roundRect);
  button.addChild(...lampsOff);
  button.addChild(text);

  button.interactive = true;
  button.buttonMode = true;

  button.on("pointerover", onTextOver);
  button.on("pointerout", onTextOut);
  button.on("pointerdown", onLampOn);
  button.on("pointerup", onLampOff);
  button.on("pointerupoutside", onLampOff);

  function onTextOver() {
    text.text = "Turn ON";
    text.style.fill = "green";
  }

  function onTextOut() {
    text.text = "Touch me";
    text.style.fill = "red";
  }

  function onLampOn() {
    console.log("down");
    lampsOff.forEach((l) => {
      //   button.removeChild(l);
      l.alpha = 1;
    });
    // lampsOn.forEach((l) => {
    //   button.addChild(l);
    // });
  }

  function onLampOff() {
    console.log("up");
    // lampsOn.forEach((l) => {
    //   button.removeChild(l);
    //   l.alpha=0;
    // });
    lampsOff.forEach((l) => {
      l.alpha = 0.2;
    });
  }

  button.position.set(400, 300);
  button.pivot.set(button.width / 2, button.height / 2);

  app.stage.addChild(button);
  setTimeout(() => {
    destroyApp(app);
    interactionDragging();
  }, delayDemo);
}

function interactionDragging() {
  const app = initApp();

  const texture = Texture.fromImage("assets/bunny64.png");
  texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

  const totalBunnies = 10;

  for (let i = 0; i < totalBunnies; i++) {
    const x = Math.random() * app.renderer.width;
    const y = Math.random() * app.renderer.height;
    createBunny(x, y);
  }

  function createBunny(x: number, y: number) {
    const bunny = new ExampleSprite(texture);
    bunny.interactive = true;
    bunny.buttonMode = true;
    bunny.anchor.set(0.5);
    bunny.scale.set(2);
    bunny.position.set(x, y);
    bunny.on("pointerdown", onDragStart);
    bunny.on("pointerup", onDragEnd);
    bunny.on("pointerupoutside", onDragEnd);
    bunny.on("pointermove", onDragMove);
    app.stage.addChild(bunny);
  }

  function onDragStart(this: ExampleSprite, e: interaction.InteractionEvent) {
    this.alpha = 0.5;
    this.interactionEvent = e;
    this.dragging = true;
  }
  function onDragEnd(this: ExampleSprite) {
    this.alpha = 1;
    this.dragging = false;
    this.interactionEvent = null;
  }
  function onDragMove(this: ExampleSprite, e: interaction.InteractionEvent) {
    if (this.dragging) {
      const coords = this.interactionEvent!.data.getLocalPosition(this.parent);
      this.position.set(coords.x, coords.y);
    }
  }
  setTimeout(() => {
    destroyApp(app);
    interactionCustomMouseIcon();
  }, delayDemo);
}

function interactionCustomMouseIcon() {
  const app = initApp();

  const defaultIcon = "url('assets/bunny1.png'),auto";
  const hoverIcon = "url('assets/bunny2.png'),auto";
  app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
  app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;

  const texture = Texture.fromImage("assets/bunny64.png");
  texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  const bunny = new Sprite(texture);
  bunny.scale.set(3);
  bunny.interactive = true;
  bunny.buttonMode = true;
  bunny.cursor = "hover";
  bunny.anchor.set(0.5);
  bunny.position.set(400, 300);

  app.stage.addChild(bunny);
  setTimeout(()=>{
    destroyApp(app)
  },delayDemo)
}

interactionClick();

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
