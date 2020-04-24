import { Texture } from "pixi.js";
import AbstractExtendSprite from "./AbstractExtendSprite";
export default class Explorer extends AbstractExtendSprite {
  hasTreasure = false;
  idTreasure: number | undefined = undefined;
  constructor(texture?: Texture) {
    super(texture);
  }
}
