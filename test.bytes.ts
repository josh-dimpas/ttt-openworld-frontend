import { describe, expect, it } from "vitest";
import { BitArrayBuilder } from "./src/utils/bytes";

describe("bytes utils", () => {
    describe("BitArrayBuilder", () => {
        it("creates empty builder by default", () => {
            const builder = new BitArrayBuilder();
            expect(builder.data).toEqual(new Uint32Array());
            expect(builder.cursor).toBe(0);
        });

        it("accepts initial data", () => {
            const initial = new Uint32Array([1, 2, 3]);
            const builder = new BitArrayBuilder(initial);
            expect(builder.data).toEqual(initial);
            expect(builder.cursor).toBe(0);
        });

        it("calculates bitlength", () => {
            const empty = new BitArrayBuilder();
            expect(empty.bitlength).toBe(0);

            const data = new BitArrayBuilder(new Uint32Array([1]));
            expect(data.bitlength).toBe(32);

            const data2 = new BitArrayBuilder(new Uint32Array([1, 2, 3]));
            expect(data2.bitlength).toBe(96);
        });
    });
});