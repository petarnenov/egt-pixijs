import {
  Sprite,
  Container,
  Application,
  Graphics,
  TextStyle,
  Text,
  Rectangle,
  Texture,
} from "pixi.js";
import Key from "./Key";
import Collision from "./Collision";
import Explorer from "./Explorer";
import Blob from "./Blob";
import RandomRange from "./RandomRange";
import Contain from "./Contain";

const app = new Application({
  antialias: true,
  resolution: 1,
  backgroundColor: 0x993344,
});

document.body.appendChild(app.view);

const gameConfig = {
  state: (delta: number) => {},
  availableTreasures: 1,
  blobs: [] as Blob[],
  explorer: {} as Explorer,
  explorerSpeed: 3,
  outerBar: {} as Graphics,
  gameScene: {} as Container,
  gameOverScene: {} as Container,
  treasures: [] as Sprite[],
  door: {} as Sprite,
  message: {} as Text,
  keys: [] as Key[],
  textures: PIXI.utils.TextureCache,
  levelText: {} as Text,
  levelCounter: 1,
  playGround: {
    x: 28,
    y: 10,
    width: 480,
    height: 480,
  },
};

// let state: Function;
// const blobs: Blob[] = [];
// let explorer: Explorer;
// const explorerSpeed = 3;
// let outerBar: Graphics;
// let gameScene: Container;
// let gameOverScene: Container;
// let treasure: Sprite;
// let door: Sprite;
// let message: Text;
// const keys: Key[] = [];
// let nextLevel: Function;
// const treasures: Sprite[] = [];
// const playGround = {
//   x: 28,
//   y: 10,
//   width: 448,
//   height: 480,
// };

app.loader.add("./assets/treasureHunter.json").load(setup);

function setup() {
  //TODO: Initialize the game sprites, set the game "state" to "play"
  //and start the gameLoop

  //Create the "gameScene"
  gameConfig.gameScene = new Container();
  app.stage.addChild(gameConfig.gameScene);

  gameConfig.textures = PIXI.utils.TextureCache;

  //Create Dungeon
  const dungeon = new Sprite(gameConfig.textures!["dungeon.png"]);
  gameConfig.gameScene.addChild(dungeon);

  //Create the "door" sprite
  gameConfig.door = new Sprite(gameConfig.textures!["door.png"]);
  gameConfig.door.position.set(32, 0);
  gameConfig.gameScene.addChild(gameConfig.door);

  //Create the "player" sprite
  gameConfig.explorer = new Explorer(gameConfig.textures!["explorer.png"]);
  gameConfig.explorer.position.set(
    64,
    gameConfig.gameScene.height / 2 - gameConfig.explorer.height / 2
  );
  gameConfig.gameScene.addChild(gameConfig.explorer);

  //Create the "treasure" sprite
  buildTreasure();

  //Make the enemies
  interface BlobConfig {
    numberOfBlobs: number;
    spacing: number;
    xOffset: number;
    speed: number;
    direction: number;
  }
  const blobConfig: BlobConfig = {
    numberOfBlobs: 8,
    spacing: 48,
    xOffset: 96,
    speed: 2,
    direction: 1,
  };

  for (let i = 0; i < blobConfig.numberOfBlobs; i++) {
    const currentBlob = new Blob(gameConfig.textures!["blob.png"]);
    let x = blobConfig.spacing * i + blobConfig.xOffset;
    let y = RandomRange.getRandomInt(
      32,
      gameConfig.gameScene.height - currentBlob.height - 32
    );
    currentBlob.position.set(x, y);
    currentBlob.tint = Math.random() * 0xffffff;
    if (blobConfig.direction > 0) {
      currentBlob.moves.down = blobConfig.speed;
    } else {
      currentBlob.moves.up = blobConfig.speed;
    }
    blobConfig.direction *= -1;
    gameConfig.blobs.push(currentBlob);
  }

  gameConfig.gameScene.addChild(...gameConfig.blobs);

  //Create the "health" bar
  const healthBar = new Container();
  const innerBar = new Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();

  gameConfig.outerBar = new Graphics();
  gameConfig.outerBar.beginFill(0xff0000);
  gameConfig.outerBar.drawRect(0, 0, 128, 8);
  gameConfig.outerBar.endFill();

  healthBar.addChild(innerBar);
  healthBar.addChild(gameConfig.outerBar);

  healthBar.position.set(gameConfig.gameScene.width - 160, 4);
  gameConfig.gameScene.addChild(healthBar);

  //Create the "gameOverScene" group
  gameConfig.gameOverScene = new Container();
  gameConfig.gameOverScene.visible = false;
  app.stage.addChild(gameConfig.gameOverScene);

  //Add some text for the game over message
  const style = new TextStyle({
    fontFamily: "Future",
    fontSize: 64,
    fill: "white",
  });

  gameConfig.message = new Text("The End!", style);
  gameConfig.message.position.set(120, app.stage.height / 2 - 32);
  gameConfig.gameOverScene.addChild(gameConfig.message);

  //Assign the player's keyboard controllers
  const left = new Key("ArrowLeft");
  const up = new Key("ArrowUp");
  const right = new Key("ArrowRight");
  const down = new Key("ArrowDown");
  const name = ["left", "up", "right", "down"];
  type moveAliases = "left" | "right" | "up" | "down";
  gameConfig.keys = [left, up, right, down];
  gameConfig.keys.forEach((k, index) => {
    k.press = () => {
      gameConfig.explorer.moves[name[index] as moveAliases] =
        gameConfig.explorerSpeed;
    };
    k.release = () => {
      gameConfig.explorer.moves[name[index] as moveAliases] = 0;
    };
  });

  //Cheat health key
  const heal = new Key("h");
  heal.press = () => {
    gameConfig.outerBar.width += 30;
    if (gameConfig.outerBar.width > 128) gameConfig.outerBar.width = 128;
  };

  //set the state to play
  gameConfig.state = play;

  //console.log(gameConfig.blobs);

  //Create level message
  gameConfig.levelText = new Text(`Level: ${gameConfig.levelCounter}`);
  gameConfig.levelText.position.set(
    gameConfig.gameScene.width / 2,
    gameConfig.gameScene.height / 2
  );
  gameConfig.levelText.style.fill = "white";
  gameConfig.levelText.anchor.set(0.5);
  gameConfig.levelText.alpha = 0.5;
  gameConfig.gameScene.addChild(gameConfig.levelText);

  //start the game loop
  app.ticker.add(gameLoop);
  // app.ticker.add(() => {
  //   blobs.forEach((b) => {
  //     b.x += b.vx();
  //     b.y += b.vy();
  //   });
  // });
  // setInterval(() => {
  //   outerBar.width -= 1;
  // }, 1000);
}

function buildTreasure() {
  for (let t = 0; t < gameConfig.availableTreasures; t++) {
    const treasure = new Sprite(gameConfig.textures!["treasure.png"]);
    treasure.position.set(
      RandomRange.getRandomInt(
        gameConfig.gameScene.width / 2,
        gameConfig.gameScene.width - treasure.width - 32
      ),
      RandomRange.getRandomInt(
        gameConfig.gameScene.height / 2,
        gameConfig.gameScene.height - treasure.height - 32
      )
    );
    gameConfig.treasures.push(treasure);
  }
  gameConfig.gameScene.addChild(...gameConfig.treasures);
}

function gameLoop(delta: number) {
  //TODO: run the current game "state" in the loop and render the sprites
  gameConfig.state(delta);
}

function play(delta: number) {
  //TODO: All the game logic stays here
  //Move the explorer and keep in boundary
  gameConfig.explorer.x += gameConfig.explorer.vx();
  gameConfig.explorer.y += gameConfig.explorer.vy();
  Contain.hasHit(gameConfig.explorer, gameConfig.playGround);

  //Move the blob monsters
  // console.log(
  //   `${gameConfig.blobs[0].moves.up}:${gameConfig.blobs[0].moves.down}:${gameConfig.blobs[0].x}:${gameConfig.blobs[0].y}`
  // );
  gameConfig.blobs.forEach((blob) => {
    blob.y += blob.vy();
    //console.log(blob.vy())
    const blobHitsWall = Contain.hasHit(blob, gameConfig.playGround);
    if (blobHitsWall === "up") {
      blob.moves.down = blob.moves.up;
      blob.moves.up = 0;
    }
    if (blobHitsWall === "down") {
      blob.moves.up = blob.moves.down;
      blob.moves.down = 0;
    }

    //Check for collision between blob and explorer
    if (Collision.hasCollision(blob, gameConfig.explorer)) {
      gameConfig.explorer.alpha = 0.5;
      gameConfig.outerBar.width -= 1;
      if (gameConfig.outerBar.width < 1) {
        gameConfig.message.text = "You lost!";
        gameConfig.state = end;
      }
    } else {
      gameConfig.explorer.alpha = 1;
    }
  });

  //Check for collision between explorer and treasure
  gameConfig.treasures.forEach((treasure, index) => {
    if (
      Collision.hasCollision(gameConfig.explorer, treasure) &&
      !gameConfig.explorer.hasTreasure
    ) {
      // treasure.x = gameConfig.explorer.x + 8;
      // treasure.y = gameConfig.explorer.y + 8;
      gameConfig.explorer.hasTreasure = true;
      gameConfig.explorer.idTreasure = index;
    }
    //Check for collision between treasure and door
    if (Collision.hasCollision(treasure, gameConfig.door)) {
      //gameConfig.message.text = "You won!";
      gameConfig.explorer.hasTreasure = false;
      gameConfig.explorer.idTreasure = undefined;
      treasure.visible = false;
    }
  });
  gameConfig.treasures = gameConfig.treasures.filter(
    (treasure) => treasure.visible
  );
  if (!gameConfig.treasures.length) {
    levelUp();
  }
  [];
  if (gameConfig.explorer.hasTreasure) {
    gameConfig.treasures[gameConfig.explorer.idTreasure as number].x =
      gameConfig.explorer.x + 8;
    gameConfig.treasures[gameConfig.explorer.idTreasure as number].y =
      gameConfig.explorer.y + 8;
  }
  gameConfig.explorer.tint = Math.random() * 0xffffff;
}

function end(delta: number) {
  //TODO: All the code that should run after the end of the game
  gameConfig.keys.forEach((key) => {
    key.unsubscribe();
  });
  gameConfig.gameOverScene.visible = false;
  gameConfig.gameOverScene.visible = true;
}

function levelUp() {
  //sanitize();
  //clearContainer(app.stage);
  //console.log("level up");
  gameConfig.levelCounter += 1;
  gameConfig.levelText.text = `Level: ${gameConfig.levelCounter}`;
  gameConfig.availableTreasures += 1;
  buildTreasure();
  gameConfig.blobs.forEach((blob) => {
    blob.moves.up += 1;
    blob.moves.down += 1;
  });
}

function clearContainer(container: Container) {
  const sprites = container.children;
  sprites.forEach((c) => {
    c.destroy();
  });
}

function sanitize() {
  gameConfig.treasures.length = 0;
  gameConfig.blobs.length = 0;
}
