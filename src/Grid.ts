import { Point } from "pixi.js";

export default class Grid {
  private points = [] as Point[];
  constructor(width: number, height: number, rows: number, cols: number) {
    const deltaWidth = (width / (cols + 1)) ^ 0;
    const deltaHeight = (height / (rows + 1)) ^ 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const point = new Point(
          deltaWidth * (1 + col),
          deltaHeight * (1 + row)
        );
        this.points.push(point);
      }
    }
  }
  getPoints() {
    return this.points;
  }
}
