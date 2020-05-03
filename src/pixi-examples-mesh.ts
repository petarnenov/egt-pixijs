import {
  Application,
  Sprite,
  Point,
  mesh,
  Texture,
  Container,
  loader,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";
import BounceBox from "./BounceBox";

const delayDemo = 3000;
const width = 800;
const height = 600;

function meshBasic() {
  const app = initApp();

  //build a rope ???
  //snake size 918*117
  const ropeLength = 918 / 20;

  const points: Point[] = [];

  for (let i = 0; i < 20; i++) {
    const currentPoint = new Point(i * ropeLength, 0);
    points.push(currentPoint);
  }

  //console.table(points);

  loader.add("snake", "assets/snake.png").load(() => {
    const snake = Sprite.fromImage("snake");
    console.log(snake.width);
    console.log(snake.height);
  });

  const strip = new mesh.Rope(Texture.fromImage("assets/snake.png"), points);
  strip.x = -459;

  console.log(strip.width);

  const snakeContainer = new Container();
  snakeContainer.position.set(width / 2, height / 2);
  snakeContainer.scale.set(800 / 1100);

  app.stage.addChild(snakeContainer);

  snakeContainer.addChild(strip);
  //app.stage.addChild(snake);
  let count = 0;
  app.ticker.add(() => {
    count += 0.1;
    for (let i = 0; i < 20; i++) {
      points[i].y = Math.sin(i * 0.5 + count) * 30; //forward/back
      points[i].x = i * ropeLength + Math.cos(i * 0.3 + count) * 20; //up/down
    }
  });
  setTimeout(() => {
    destroyApp(app);
    meshAdvanced();
  }, delayDemo);
}

meshBasic();

function meshAdvanced() {
  const app = initApp();
  app.stage.interactive = true;
  let hasMove = false;
  app.stage.on("pointertap", () => {
    hasMove = !hasMove;
  });

  const snakeSpeed = 10;
  const totalPoints = 20;
  const ropeLength = width / totalPoints;
  const points: Point[] = [];
  for (let i = 0; i < totalPoints; i++) {
    const point = new Point(i * ropeLength, height / 3);
    points.push(point);
  }

  const strip = new mesh.Rope(Texture.fromImage("assets/snake.png"), points);

  const container = new Container();
  container.addChild(strip);

  //app.stage.addChild(strip);

  const g = new Graphics();
  //app.stage.addChild(g);
  container.addChild(g);

  app.stage.addChild(container);

  const style = new TextStyle({
    fill: "white",
    fontFamily: "Snippet",
    fontSize: 24,
  });
  const help = new Text("click here or snake to start/stop moving", style);

  app.stage.addChild(help);

  const bounce = new BounceBox(width, height);
  let count = 0;
  app.ticker.add(() => {
    count += 0.1;

    if (hasMove) {
      container.x += snakeSpeed;
    }

    points.forEach((p, i) => {
      p.x = i * ropeLength + Math.cos(i * 0.3 + count) * 20;
      p.y = height / 3 + Math.sin(i * 0.5 + count) * 30;
    });
    bounce.keepSpriteInBounce(container);
    render();
  });

  function render() {
    g.clear();
    g.moveTo(points[0].x, points[0].y);
    g.lineStyle(2, 0xffffff, 1);
    points.forEach((p) => {
      g.lineTo(p.x, p.y);
    });
    points.forEach((p) => {
      g.beginFill(0xff0000, 1);
      g.drawCircle(p.x, p.y, 10);
      g.endFill();
    });
  }

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
