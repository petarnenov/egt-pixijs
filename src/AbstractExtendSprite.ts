import { Sprite, Texture } from "pixi.js";

export default abstract class AbstractExtendSprite extends Sprite {
  direction = Math.random() * Math.PI * 2;
  turningSpeed = Math.random() - 0.8;
  speed = 2 + Math.random() * 2;
  moves = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  };
  constructor(texture?: Texture) {
    super(texture);
  }
  vx() {
    return -this.moves.left + this.moves.right;
  }
  vy() {
    return -this.moves.up + this.moves.down;
  }
}
