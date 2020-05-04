import RandomRange from "../RandomRange";

describe("RandomRange class", () => {
  it("should return value in range", () => {
    const results = [] as number[];
    const start = -100;
    const end = 100;
    for (let i = 0; i < 10000; i++) {
      const result = RandomRange.getRandomInt(start, end);
      expect(result).toBeGreaterThanOrEqual(start);
      expect(result).toBeLessThanOrEqual(end);
      results.push(result);
    }
    expect(results).toContain(start);
    expect(results).toContain(end);
  });
});
