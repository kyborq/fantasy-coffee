type DurationUnit = "s" | "m" | "h" | "d" | "w";

export type DurationString = `${number}${DurationUnit}`;

const UNIT_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
  w: 7 * 24 * 60 * 60,
};

export function fromDuration(duration: DurationString): number {
  const m = duration.trim().match(/^(\d+)\s*([smhdw])$/i);
  if (!m) throw new SyntaxError(`Invalid duration: ${duration}`);
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const mult = UNIT_SECONDS[unit];
  return n * mult;
}
