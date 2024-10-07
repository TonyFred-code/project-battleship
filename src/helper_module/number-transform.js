export default function transform(x, y, base) {
  const index = y * base + x;
  return index;
}

export function reverseTransform(index, base) {
  const y = Math.floor(index / base);
  const x = index % base;
  return [x, y];
}
