import { Container, Sprite, filters } from "pixi.js";

export default class Reel {
  [key: string]: any;
  container = new Container();
  symbols = [] as Sprite[];
  position = 0;
  previousPosition = 0;
  blur = new filters.BlurFilter();
}
