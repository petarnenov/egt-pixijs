import { Application, Graphics, Texture, Sprite, interaction } from "pixi.js";
import { rootCertificates } from "tls";

const delayDemo = 3000;

function graphicSimple() {
  const app = initApp();

  const graphics = new Graphics();

  //rectangle
  graphics.beginFill(0xff0000, 1);
  graphics.lineStyle(2, 0xaaaaaa, 1);
  graphics.drawRect(10, 10, 200, 100);
  graphics.endFill();

  //circle
  graphics.beginFill(0x993300);
  graphics.drawCircle(40, 150, 30);
  graphics.endFill();

  //ellipse
  graphics.beginFill(0x00ff00);
  graphics.drawEllipse(110, 230, 100, 50);
  graphics.endFill();

  //shape
  graphics.beginFill(0x0000dd);
  graphics.moveTo(10, 320);
  graphics.lineTo(10, 350);
  graphics.lineTo(30, 350);
  graphics.lineTo(30, 320);
  graphics.lineTo(10, 320);
  graphics.endFill();

  //star
  graphics.beginFill(0xee1111);
  graphics.drawStar(40, 400, 7, 30, 10);
  graphics.endFill();

  //polygon
  const path = [10, 500, 15, 520, 20, 540, 25, 540, 30, 520, 35, 500, 10, 500];
  graphics.beginFill(0xaa33aa);
  graphics.drawPolygon(path);
  graphics.endFill();

  app.stage.addChild(graphics);
  setTimeout(() => {
    destroyApp(app);
    graphicsAdvance();
  }, delayDemo);
}

graphicSimple();

function graphicsAdvance() {
  //https://en.wikipedia.org/wiki/B%C3%A9zier_curve
  const app = initApp();
  const graphics = new Graphics();

  const path = new Graphics();
  path.lineStyle(2, 0xffffff, 1);

  //path.beginFill(0xffffff);
  path.moveTo(0, 0);
  path.lineTo(100, 200);
  path.lineTo(200, 200);
  path.lineTo(240, 100);

  path.position.set(50, 50);

  app.stage.addChild(path);

  const bezier = new Graphics();
  bezier.lineStyle(20, 0xeeeeee, 0.5);
  bezier.bezierCurveTo(100, 200, 200, 200, 240, 100);
  bezier.position.set(50, 50);

  app.stage.addChild(bezier);

  //bezier curve with texture
  const texture = Texture.fromImage("assets/rainbow.png");
  const sprite = new Sprite(texture);

  const path2 = path.clone();
  path2.x += 300;
  path2.y += 50;

  app.stage.addChild(path2);

  const bezier2 = bezier.clone();
  bezier2.x += 300;
  bezier2.y += 50;

  //v4.8.0 not support method lineTextureStyle
  //bezier2.lineTextureStyle(10,sprite.texture)
  app.stage.addChild(bezier2);

  //arc

  const arc = new Graphics();
  arc.lineStyle(20, 0xaa00bb, 0.5);
  arc.arc(600, 100, 50, 2 * Math.PI, (3 * Math.PI) / 2);

  app.stage.addChild(arc);

  //hole

  const rectAndHole = new Graphics();

  rectAndHole.beginFill(0x00ff00);
  rectAndHole.drawRect(350, 350, 150, 150);
  rectAndHole.endFill();
  //INFO: v4.8.0 beginHole() not supported
  //rectAndHole.beginHole();
  rectAndHole.beginFill(0x000000);
  rectAndHole.drawCircle(375, 375, 25);
  rectAndHole.drawCircle(425, 425, 25);
  rectAndHole.drawCircle(475, 475, 25);
  //rectAndHole.endHole();
  rectAndHole.endFill();

  app.stage.addChild(rectAndHole);
  setTimeout(() => {
    destroyApp(app);
    graphicsDynamic();
  }, delayDemo);
}

function graphicsDynamic() {
  const app = initApp();
  const graphics = new Graphics();

  app.stage.interactive = true;
  //interaction
  //app.renderer.plugins.interaction.on("pointertap",onDrawBezier)
  app.renderer.plugins.interaction.on("pointerdown", onDrawBezier);
  //app.stage.on("pointertap", onDrawBezier);

  //use interactionManager
  //   const im = new interaction.InteractionManager(app.renderer);
  //   im.on("pointerdown", onDrawBezier);

  function onDrawBezier() {
    console.log("draw");
    graphics.lineStyle(
      Math.random() * 30,
      +Math.random().toString().slice(2, 8),
      Math.random()
    );
    graphics.moveTo(Math.random() * 800, Math.random() * 600);
    graphics.bezierCurveTo(
      Math.random() * 800,
      Math.random() * 600,
      Math.random() * 800,
      Math.random() * 600,
      Math.random() * 800,
      Math.random() * 600
    );
  }

  graphics.lineStyle(10, 0xffd900, 1);
  graphics.beginFill(0xff3300);

  //draw a shape
  graphics.moveTo(50, 50);
  graphics.lineTo(250, 50);
  graphics.lineTo(100, 100);
  graphics.lineTo(250, 220);
  graphics.lineTo(50, 220);
  graphics.lineTo(50, 50);
  graphics.endFill();

  //preset a file and lineStyle
  graphics.lineStyle(10, 0xff0000, 0.8);
  graphics.beginFill(0xff700b, 1);

  //draw a shape
  graphics.moveTo(210, 300);
  graphics.lineTo(450, 320);
  graphics.lineTo(570, 350);
  graphics.quadraticCurveTo(600, 0, 480, 100);
  graphics.lineTo(330, 120);
  graphics.lineTo(410, 200);
  graphics.lineTo(210, 300);
  graphics.endFill();

  //draw a rectangle
  graphics.beginFill(0x0000ff, 1);
  graphics.drawRect(50, 250, 100, 100);

  //draw a circle
  graphics.lineStyle(0);
  graphics.beginFill(0xffff0b, 0.5);
  graphics.drawCircle(470, 200, 100);
  graphics.endFill();

  //draw a line
  graphics.lineStyle(20, 0x33ff00);
  graphics.moveTo(30, 30);
  graphics.lineTo(600, 300);

  app.stage.addChild(graphics);

  //create a moving shape
  const thing = new Graphics();
  app.stage.addChild(thing);
  thing.position.set(400, 300);

  let count = 0;
  app.ticker.add(() => {
    count += 0.1;
    thing.clear();
    thing.lineStyle(10, 0xff0000, 1);
    thing.beginFill(0xffff00, 0.5);

    thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);

    thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
    thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
    thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
    thing.lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);

    thing.rotation = count * 0.1;
  });
  setTimeout(() => {
    destroyApp(app);
  }, delayDemo);
}

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
