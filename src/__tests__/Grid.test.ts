import Grid from "../Grid";
import { Point } from "pixi.js";
import RandomRange from "../RandomRange";

describe("Grid class", () => {
  it("should be generate points", () => {
    const width = RandomRange.getRandomInt(100, 800);
    const height = RandomRange.getRandomInt(100, 600);
    const row = RandomRange.getRandomInt(1, 10);
    const col = RandomRange.getRandomInt(1, 10);
    const grid = new Grid(width, height, row, col);
    expect(grid).toBeDefined();
    const points = grid.getPoints();
    expect(grid.getPoints).toBeCalled;
    expect(points).toBeDefined();
    expect(points).toBeInstanceOf(Array);
    expect(points.length).toEqual(row * col);
    const point = points[0];
    expect(point).toBeInstanceOf(Point);
    expect(point.x).toBeDefined();
    expect(point.y).toBeDefined();
    expect(
      points.every((p) => p.x <= width && p.x > 0 && p.y <= height && p.y > 0)
    ).toBeTruthy();
    expect(points[0].x).toBe((width / (col + 1)) ^ 0);
    expect(points[0].y).toBe((height / (row + 1)) ^ 0);
  });
});
