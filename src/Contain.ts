import { Sprite, Container } from "pixi.js";
interface BoundaryContainer {
  x: number;
  y: number;
  width: number;
  height: number;
}
export default class Contain {
  static hasHit(sprite: Sprite, container: BoundaryContainer) {
    let hit = "free";

    if (sprite.x < container.x) {
      sprite.x = container.x;
      hit = "left";
    }

    if (sprite.y < container.y) {
      sprite.y = container.y;
      hit = "up";
    }

    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      hit = "right";
    }

    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      hit = "down";
    }

    return hit;
  }
}
