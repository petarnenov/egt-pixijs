import { Sprite } from "pixi.js";
export default class Key {
  value: string;
  isDown = false;
  isUp = true;

  constructor(value: string) {
    this.value = value;
    window.addEventListener("keydown", this.downHandler.bind(this), false);
    window.addEventListener("keyup", this.upHandler.bind(this), false);
  }
  downHandler(event: KeyboardEvent) {
    if (event.key === this.value) {
      if (this.isUp && this.press) this.press();
      this.isDown = true;
      this.isUp = false;
      event.preventDefault();
    }
  }
  upHandler(event: KeyboardEvent) {
    if (event.key === this.value) {
      if (this.isDown && this.release) this.release();
      this.isDown = false;
      this.isUp = true;
      event.preventDefault();
    }
  }

  press() {}
  release() {}

  unsubscribe() {
    window.removeEventListener("keydown", this.downHandler);
    window.removeEventListener("keyup", this.upHandler);
  }
}
