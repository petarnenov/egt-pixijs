import { Texture, Sprite } from "pixi.js";

export default class Star{
  sprite: Sprite;
  constructor(public texture: Texture, public z = 0, public x = 0, public y = 0) {
    this.sprite = new Sprite(texture);
  }
  //calculate position with random radial angle
  randomize(cameraZ:number,initial = false) {
    if (initial) {
     this.z=Math.random()*2000
    } else {
      this.z=cameraZ+Math.random()*1000+2000;
    }
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;
    this.x = Math.cos(deg) * distance;
    this.y = Math.sin(deg) * distance;
  }
}