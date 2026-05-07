export function c2i(x: number, y: number, width?: number): number {
    width ??= x;
    return width * y + x;
}

export function i2c(index: number, width: number) {
    return [index % width, ~~(index / width)];
}

export function fade(t: number) {
    return ((6 * t - 15) * t + 10) * t * t * t;
}

// 2. Linear interpolation
export function lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
}

// 3. Dot Product
export function dot(gx: number, gy: number, x: number, y: number) {
    return gx * x + gy * y;
}
