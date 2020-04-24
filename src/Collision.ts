import { Sprite } from "pixi.js";

export default class Collision {
  static hasCollision(spriteOne: Sprite, spriteTwo: Sprite) {
    const abs = Math.abs;
    const metrics = {
      deltaX: abs(spriteOne.x - spriteTwo.x),
      deltaY: abs(spriteOne.y - spriteTwo.y),
      maxX: spriteOne.width / 2 + spriteTwo.width / 2,
      maxY: spriteOne.height / 2 + spriteTwo.height / 2,
    };
    let hit = false;
    if (metrics.deltaX < metrics.maxX) {
      if (metrics.deltaY < metrics.maxY) {
        hit = true;
      }
    }
    return hit;
  }
}
