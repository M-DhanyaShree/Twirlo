export interface LevelSpec {
  rows: number;
  cols: number;
  fill: number;
  loopChance: number;
  circleChance: number;
}

const MAX_SIZE = 8;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function getLevelSpec(level: number): LevelSpec {
  let size: number;
  let start: number;
  let length: number;
  let atCap = false;

  if (level <= 5) {
    size = 3;
    start = 1;
    length = 5;
  } else if (level <= 15) {
    size = 4;
    start = 6;
    length = 10;
  } else if (level <= 30) {
    size = 5;
    start = 16;
    length = 15;
  } else {
    const step = Math.floor((level - 31) / 15);
    size = Math.min(MAX_SIZE, 6 + step);
    atCap = 6 + step > MAX_SIZE;
    start = 31 + step * 15;
    length = 15;
  }

  const progress = atCap ? 1 : clamp01((level - start) / Math.max(1, length - 1));

  return {
    rows: size,
    cols: size,
    fill: 0.62 + 0.38 * progress,
    loopChance: 0.08 + 0.32 * progress,
    circleChance: level < 6 ? 0 : 0.22,
  };
}
