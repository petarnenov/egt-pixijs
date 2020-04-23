import { Sprite, Texture } from "pixi.js";

export default class Bunny extends Sprite {
  moves = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  };
  vx = () => -this.moves.left + this.moves.right;
  vy = () => -this.moves.up + this.moves.down;
  constructor(texture?: Texture) {
    super(texture);
  }
}
