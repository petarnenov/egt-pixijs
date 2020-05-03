import { Rectangle, Sprite, Graphics, Container } from "pixi.js";

export default class BounceBox {
  private bounce: Rectangle;
  constructor(public width: number, public height: number) {
    this.bounce = new Rectangle(0, 0, width, height);
  }
  keepSpriteInBounce(sprite: Sprite | Graphics | Container) {
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    if (sprite.x < this.bounce.x - spriteWidth) {
      sprite.x += this.bounce.width + 2 * spriteWidth;
    } else if (sprite.x > this.bounce.x + this.bounce.width + spriteWidth) {
      sprite.x -= this.bounce.width + 2 * spriteWidth;
    }
    if (sprite.y < this.bounce.y - spriteHeight) {
      sprite.y += this.bounce.height + 2 * spriteHeight;
    } else if (sprite.y > this.bounce.x + this.bounce.height + spriteHeight) {
      sprite.y -= this.bounce.height + 2 * spriteHeight;
    }
  }
}
