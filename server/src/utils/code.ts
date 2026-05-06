import { randomInt } from "node:crypto";

export function generateCode(length: number = 6) {
  if (!Number.isInteger(length) || length < 1) {
    throw new RangeError("length must be a positive integer");
  }

  if (length === 1) {
    return randomInt(0, 10).toString();
  }

  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return randomInt(min, max).toString();
}
