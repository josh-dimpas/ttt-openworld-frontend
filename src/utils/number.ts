export function c2i(x: number, y: number, width?: number): number {
    width ??= x;
    return width * y + x;
}

export function i2c(index: number, width: number) {
    return [index % width, ~~(index / width)];
}

