import AbstractExtendSprite from "./AbstractExtendSprite";
import { Texture } from "pixi.js";

export default class ExampleSprite extends AbstractExtendSprite {
  constructor(texture?: Texture) {
    super(texture);
  }
}
