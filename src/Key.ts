import { Sprite } from "pixi.js";
export default class Key {
  isDown = false;
  isUp = true;
  constructor(public value: string) {
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

  press: (() => void) | undefined = undefined;
  release: (() => void) | undefined = undefined;

  unsubscribe() {
    window.removeEventListener("keydown", this.downHandler);
    window.removeEventListener("keyup", this.upHandler);
  }
}
