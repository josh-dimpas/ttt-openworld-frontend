export class NibbleArray {
    data: Uint32Array;
    length = 0;
    #cursor: number = 0;

    #schema: number[] = [];
    #schemaLength = 0;

    get cursor() {
        return this.#cursor;
    }

    set cursor(value: number) {
        this.#cursor = value;
    }

    get BYTES_PER_ELEMENT() {
        return this.data.BYTES_PER_ELEMENT;
    }

    get BITS_PER_ELEMENT() {
        return this.BYTES_PER_ELEMENT * 8;
    }

    get bitlength(): number {
        return this.data.length * 32;
    }

    get current(): number[] {
        const [index, offset] = this.#getArrayIndex();
        const nibble = new Nibble(this.data[index]);

        if (this.#schema.length === 0) return [nibble.at(offset)];

        return this.#schema.map((v) => {
            const value = nibble.slice(0, v);
            nibble.splice(v);
            return value;
        });
    }

    constructor(initial: Uint32Array | number[] = new Uint32Array()) {
        this.length = initial.length;
        this.data = new Uint32Array(initial);
        this.cursor = 0;
    }

    push(...data: number[]) {
        const length = this.data.length;
    }

    scheme(...lengths: number[]) {
        this.#schema = lengths;
        this.#schemaLength = lengths.reduce((a, v) => a + v, 0);
        return this;
    }

    reset() {
        this.cursor = 0;
        return this;
    }

    next() {
        this.cursor += this.#schemaLength;
        return this;
    }

    #getArrayIndex(index = this.cursor) {
        return [~~(index / this.BITS_PER_ELEMENT), index % this.BITS_PER_ELEMENT];
    }
}

/**
 * Used for treating bytes as an array of numbers, where the most significant bit (left-most) is index 0
 */
export class Nibble {
    static readonly NIBBLE_AND_MAP = Array(32)
        .fill(0)
        .map((_, i) => 1 << (31 - i));

    static readonly NIBBLE_MAX = ~0 >>> 0;

    static createMask(start?: number, end?: number) {
        let max = this.NIBBLE_MAX;
        if (start) max = max << start;
        if (end) max = max >> end;
        return max;
    }

    data: number;

    constructor(v: number) {
        this.data = v;
    }

    // Let the application crash when index is beyond bounds
    at(index: number) {
        return this.data & Nibble.NIBBLE_AND_MAP[index];
    }

    slice(start?: number, end?: number) {
        let data = this.data;
        if (start) data = data << start;
        if (end) data = data >> end;
        return data;
    }

    splice(start?: number, end?: number) {
        this.data = this.slice(start, end);
        return this.data;
    }
}
