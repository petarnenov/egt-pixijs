import { Application, Container, Texture, ticker, Text } from "pixi.js";
import ExampleSprite from "./ExampleSprite";
export interface TickerArgs {
  fn(deltaTime: number): void;
  context?: any;
  priority: number | undefined;
}
export default class Examples {
  private fpsMessage = new Text("FPS", {
    fill: "white",
    fontFamily: "serif",
    fontSize: "16px",
  });

  private containers = {} as {
    [key: string]: Container;
  };
  private textures = {} as {
    [key: string]: Texture;
  };
  private sprites = {} as {
    [key: string]: ExampleSprite;
  };
  constructor(private app: Application) {
    document.body.appendChild(app.view);
  }

  addContainer(containerAlias: string) {
    this.containers[containerAlias] = new Container();
    return this.containers[containerAlias];
  }

  addContainerToStage(containerAlias: string) {
    this.app.stage.addChild(this.containers[containerAlias]);
  }

  addTexture(textureAlias: string, imageUrl: string) {
    this.textures[textureAlias] = Texture.fromImage(imageUrl);
    return this.textures[textureAlias];
  }

  addSprite(spriteAlias: string, spriteTextureAlias: string | Texture) {
    if (
      Object.prototype.toString.call(spriteTextureAlias) === "[object String]"
    ) {
      this.sprites[spriteAlias] = new ExampleSprite(
        this.textures[spriteTextureAlias as string]
      );
    } else {
      this.sprites[spriteAlias] = new ExampleSprite(
        spriteTextureAlias as Texture
      );
    }
    return this.sprites[spriteAlias];
  }
  addSpriteToContainer(sprite: ExampleSprite, container: Container) {
    container.addChild(sprite);
  }
  stop() {
    this.app.stop();
  }
  start() {
    this.app.stage.addChild(this.fpsMessage);
    this.app.ticker.add(this.refreshFpsMessage.bind(this));
    this.app.start();
  }
  getSprite(spriteAlias: string) {
    return this.sprites[spriteAlias];
  }
  getContainer(containerAlias: string) {
    return this.containers[containerAlias];
  }
  addToTicker(
    cb: (
      deltaTime: number,
      context?: any,
      priority?: number | undefined
    ) => void
  ) {
    this.app.ticker.add(cb);
  }
  destroy() {
    document.body.removeChild(this.app.view);
    this.app.destroy();
  }
  getFPS() {
    return this.app.ticker.FPS ^ 0;
  }
  refreshFpsMessage() {
    this.fpsMessage.text = "FPS: " + this.getFPS();
  }
  getAllSpritesFromContainer(containerAlias: string) {
    return this.containers[containerAlias].children;
  }
  getRenderer() {
    return this.app.renderer;
  }
  getAllSprites() {
    return Object.values(this.sprites);
  }
}
