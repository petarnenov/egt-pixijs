import { Sprite, Texture } from "pixi.js";
import AbstractExtendSprite from "./AbstractExtendSprite";

export default class Bunny extends AbstractExtendSprite {
  // moves = {
  //   left: 0,
  //   right: 0,
  //   up: 0,
  //   down: 0,
  // };
  constructor(texture?: Texture) {
    super(texture);
  }
  // vx() {
  //   return -this.moves.left + this.moves.right;
  // }
  // vy() {
  //   return -this.moves.up + this.moves.down;
  // }
}
