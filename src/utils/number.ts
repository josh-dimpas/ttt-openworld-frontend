export function c2i(x: number, y: number, width?: number): number {
  width ??= x
  return width * y + x
}

export function i2c(index: number, width: number) {
  return [index % width, ~~(index / width)]
}

export function fade(t: number) {
  return ((6 * t - 15) * t + 10) * t * t * t
}

export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a)
}

export function dot(gx: number, gy: number, x: number, y: number) {
  return gx * x + gy * y
}

export function fract(x: number, accuracy: number = 5) {
  const placer = 10 ** accuracy
  return ((x * placer) % placer) / placer
}
