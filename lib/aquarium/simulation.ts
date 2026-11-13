export interface Point { x: number; y: number }
export interface Obstacle { x: number; y: number; width: number; height: number }
export interface FishBody extends Point {
  vx: number; vy: number; radius: number; speed: number; phase: number;
  fleeTime: number; facing: number; school?: number;
}
export interface World { width: number; height: number; obstacles: Obstacle[] }

const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));

/** Only the simulation owns motion. React owns the stable entity markup. */
export function flee(fish: FishBody, origin: Point) {
  let dx = fish.x - origin.x;
  let dy = fish.y - origin.y;
  if (Math.hypot(dx, dy) < 8) { dx = fish.facing; dy = -.35; }
  const distance = Math.hypot(dx, dy);
  fish.vx = dx / distance * 190;
  fish.vy = dy / distance * 190;
  fish.fleeTime = 1.7;
}

/** Project outside solid obstacles after steering; also handles layout changes. */
export function contain(fish: FishBody, world: World) {
  const r = fish.radius;
  for (const box of world.obstacles) {
    const left = box.x - r, right = box.x + box.width + r;
    const top = box.y - r * .65, bottom = box.y + box.height + r * .65;
    if (fish.x > left && fish.x < right && fish.y > top && fish.y < bottom) {
      const exits = [
        { distance: fish.x - left, x: left, y: fish.y, axis: "x" },
        { distance: right - fish.x, x: right, y: fish.y, axis: "x" },
        { distance: fish.y - top, x: fish.x, y: top, axis: "y" },
        { distance: bottom - fish.y, x: fish.x, y: bottom, axis: "y" },
      ].filter(p => p.x >= r && p.x <= world.width - r && p.y >= r * .7 && p.y <= world.height - r * .7);
      exits.sort((a, b) => a.distance - b.distance);
      const exit = exits[0];
      if (exit) {
        fish.x = exit.x; fish.y = exit.y;
        if (exit.axis === "x") fish.vx = (exit.x === left ? -1 : 1) * Math.max(10, Math.abs(fish.vx));
        else fish.vy = (exit.y === top ? -1 : 1) * Math.max(10, Math.abs(fish.vy));
      }
    }
  }
  const x = clamp(fish.x, r, Math.max(r, world.width - r));
  const y = clamp(fish.y, r * .7, Math.max(r * .7, world.height - r * .7));
  if (x !== fish.x) fish.vx = x <= r ? Math.abs(fish.vx) : -Math.abs(fish.vx);
  if (y !== fish.y) fish.vy = y <= r * .7 ? Math.abs(fish.vy) : -Math.abs(fish.vy);
  fish.x = x; fish.y = y;
}

export function stepFish(fish: FishBody, dt: number, time: number, world: World, pointer: Point | null, others: FishBody[], calm = false) {
  dt = clamp(dt, 0, .04);
  fish.fleeTime = Math.max(0, fish.fleeTime - dt);
  let ax = 0, ay = Math.sin(time * .55 + fish.phase) * (calm ? 2 : 8);
  const edge = fish.radius + 48;
  ax += Math.max(0, edge - fish.x) * 2 - Math.max(0, fish.x - (world.width - edge)) * 2;
  ay += Math.max(0, edge - fish.y) * 2 - Math.max(0, fish.y - (world.height - edge)) * 2;
  for (const box of world.obstacles) {
    const nearX = clamp(fish.x, box.x, box.x + box.width);
    const nearY = clamp(fish.y, box.y, box.y + box.height);
    const dx = fish.x - nearX, dy = fish.y - nearY, distance = Math.hypot(dx, dy);
    const reach = fish.radius + 48;
    if (distance > 0 && distance < reach) {
      const force = (reach - distance) * 3;
      ax += dx / distance * force; ay += dy / distance * force;
    }
  }
  if (pointer && !calm && fish.fleeTime === 0) {
    const dx = fish.x - pointer.x, dy = fish.y - pointer.y, distance = Math.hypot(dx, dy);
    if (distance > 1 && distance < 85) {
      ax += dx / distance * (85 - distance) * .35;
      ay += dy / distance * (85 - distance) * .35;
    }
  }
  let schoolX = 0, schoolY = 0, schoolVx = 0, schoolVy = 0, schoolmates = 0;
  for (const other of others) {
    if (other === fish) continue;
    const dx = fish.x - other.x, dy = fish.y - other.y, distance = Math.hypot(dx, dy);
    const reach = (fish.radius + other.radius) * .8;
    if (fish.school && fish.school === other.school && distance < 260 && fish.fleeTime === 0 && other.fleeTime === 0) {
      schoolX += other.x; schoolY += other.y; schoolVx += other.vx; schoolVy += other.vy; schoolmates++;
    }
    if (distance > 1 && distance < reach) {
      ax += dx / distance * (reach - distance); ay += dy / distance * (reach - distance);
    }
  }
  if (schoolmates) {
    ax += (schoolX / schoolmates - fish.x) * .035 + (schoolVx / schoolmates - fish.vx) * .4;
    ay += (schoolY / schoolmates - fish.y) * .035 + (schoolVy / schoolmates - fish.vy) * .4;
  }
  fish.vx += ax * dt; fish.vy += ay * dt;
  const speed = Math.hypot(fish.vx, fish.vy) || 1;
  const target = (fish.fleeTime > 0 ? fish.speed + 110 * fish.fleeTime / 1.7 : fish.speed) * (calm ? .35 : 1);
  const nextSpeed = speed + (target - speed) * (1 - Math.exp(-2.5 * dt));
  fish.vx = fish.vx / speed * nextSpeed; fish.vy = fish.vy / speed * nextSpeed;
  fish.x += fish.vx * dt; fish.y += fish.vy * dt;
  contain(fish, world);
  if (Math.abs(fish.vx) > 4) fish.facing = fish.vx > 0 ? 1 : -1;
}
