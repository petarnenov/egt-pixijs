import { Point } from "pixi.js";

export default class Grid {
  private points: Point[] = [];
  constructor(
    private width: number,
    private height: number,
    private rows: number,
    private cols: number
  ) {
    const deltaWidth = (width / (cols + 1)) ^ 0;
    const deltaHeight = (height / (rows + 1)) ^ 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const point = new Point(deltaWidth * (1 + row), deltaHeight * (1 + col));
        this.points.push(point);
      }
    }
  }
  getPoints() {
    return this.points;
  }
}
