export class BitArrayBuilder {
    data: Uint32Array;
    cursor: number;

    get bitlength(): number {
        return this.data.length * 32;
    }

    constructor(initial: Uint32Array = new Uint32Array()) {
        this.data = initial;
        this.cursor = 0;
    }
}
