export function isPositiveNumber(number, zeroPositive = false) {
  if (typeof number !== 'number') return false;

  if (zeroPositive) {
    return number >= 0;
  }

  return number > 0;
}
