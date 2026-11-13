import { describe, expect, it } from "vitest";
import { contain, flee, stepFish, type FishBody, type World } from "@/lib/aquarium/simulation";

const body = (overrides: Partial<FishBody> = {}): FishBody => ({ x: 200, y: 250, vx: 25, vy: 0, radius: 40, speed: 25, phase: 0, fleeTime: 0, facing: 1, ...overrides });
const world: World = { width: 1000, height: 700, obstacles: [] };

describe("aquarium motion", () => {
  it("flees away from the click, then recovers at cruising speed", () => {
    const fish = body();
    flee(fish, { x: 170, y: 260 });
    expect(fish.vx).toBeGreaterThan(100);
    expect(fish.vy).toBeLessThan(0);
    stepFish(fish, 1 / 60, 0, world, null, [fish]);
    expect(fish.x).toBeGreaterThan(200);
    for (let frame = 0; frame < 360; frame++) stepFish(fish, 1 / 60, frame / 60, world, null, [fish]);
    expect(fish.fleeTime).toBe(0);
    expect(Math.hypot(fish.vx, fish.vy)).toBeCloseTo(25, 0);
  });
  it("handles an exact-center click and repeated clicks without unbounded velocity", () => {
    const fish = body();
    for (let i = 0; i < 100; i++) flee(fish, { x: fish.x, y: fish.y });
    expect(Number.isFinite(fish.vx)).toBe(true);
    expect(Math.hypot(fish.vx, fish.vy)).toBeCloseTo(190);
  });
  it("keeps fish outside the card and viewport over a long simulation", () => {
    const tank = { ...world, obstacles: [{ x: 550, y: 80, width: 400, height: 510 }] };
    const fish = body({ x: 480, vx: 150, fleeTime: 1.7 });
    for (let frame = 0; frame < 3600; frame++) {
      stepFish(fish, 1 / 60, frame / 60, tank, { x: 100, y: 250 }, [fish]);
      expect(fish.x).toBeGreaterThanOrEqual(fish.radius);
      expect(fish.x).toBeLessThanOrEqual(tank.width - fish.radius);
      expect(fish.y).toBeGreaterThanOrEqual(fish.radius * .7);
      expect(fish.y).toBeLessThanOrEqual(tank.height - fish.radius * .7);
      const inside = fish.x > 510 && fish.x < 990 && fish.y > 54 && fish.y < 616;
      expect(inside).toBe(false);
    }
  });
  it("moves a fish out of a newly expanded form", () => {
    const fish = body({ x: 600, y: 250 });
    contain(fish, { ...world, obstacles: [{ x: 550, y: 100, width: 400, height: 450 }] });
    expect(fish.x).toBe(510);
    expect(fish.vx).toBeLessThan(0);
  });
  it("caps elapsed time after a background-tab gap", () => {
    const fish = body();
    stepFish(fish, 90, 90, world, null, [fish]);
    expect(Math.hypot(fish.x - 200, fish.y - 250)).toBeLessThan(3);
  });
  it("maintains similar travel at 60 and 120 Hz", () => {
    const a = body(), b = body();
    for (let i = 0; i < 180; i++) stepFish(a, 1 / 60, i / 60, world, null, [a]);
    for (let i = 0; i < 360; i++) stepFish(b, 1 / 120, i / 120, world, null, [b]);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(1);
  });
  it("slows down while the form has focus", () => {
    const fish = body();
    for (let i = 0; i < 180; i++) stepFish(fish, 1 / 60, i / 60, world, null, [fish], true);
    expect(Math.hypot(fish.vx, fish.vy)).toBeLessThan(10);
  });
  it("a school member approaches nearby schoolmates without chasing other species", () => {
    const schooling = body({ school: 1, x: 300, y: 250, radius: 20 });
    const solitary = body({ x: 300, y: 250, radius: 20 });
    const neighbor = body({ school: 1, x: 430, y: 350, radius: 20 });
    for (let i = 0; i < 120; i++) {
      stepFish(schooling, 1 / 60, i / 60, world, null, [schooling, neighbor]);
      stepFish(solitary, 1 / 60, i / 60, world, null, [solitary, neighbor]);
    }
    expect(schooling.y).toBeGreaterThan(solitary.y + 3);
    expect(schooling.x).toBeGreaterThan(300);
  });
});
