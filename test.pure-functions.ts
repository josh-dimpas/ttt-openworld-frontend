import { describe, expect, it, vi, beforeEach } from "vitest";

import * as number from "./src/utils/number";
import * as string from "./src/utils/string";

describe("number utils", () => {
    describe("c2i", () => {
        it("converts 2D coordinates to index", () => {
            expect(number.c2i(0, 0)).toBe(0);
            expect(number.c2i(1, 0)).toBe(1);
            expect(number.c2i(0, 1)).toBe(0);
            expect(number.c2i(1, 1)).toBe(2);
        });

        it("uses custom width", () => {
            expect(number.c2i(2, 0, 5)).toBe(2);
            expect(number.c2i(0, 1, 5)).toBe(5);
            expect(number.c2i(4, 1, 5)).toBe(9);
        });
    });

    describe("i2c", () => {
        it("converts index to 2D coordinates", () => {
            expect(number.i2c(0, 3)).toEqual([0, 0]);
            expect(number.i2c(1, 3)).toEqual([1, 0]);
            expect(number.i2c(3, 3)).toEqual([0, 1]);
            expect(number.i2c(4, 3)).toEqual([1, 1]);
        });
    });

    describe("fade", () => {
        it("returns 0 at t=0", () => {
            expect(number.fade(0)).toBe(0);
        });

        it("returns non-zero at t=1", () => {
            expect(number.fade(1)).not.toBe(0);
        });

        it("returns positive value between 0 and 1", () => {
            const t = 0.5;
            const result = number.fade(t);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(1);
        });
    });

    describe("lerp", () => {
        it("interpolates between two values", () => {
            expect(number.lerp(0, 10, 0)).toBe(0);
            expect(number.lerp(0, 10, 1)).toBe(10);
            expect(number.lerp(0, 10, 0.5)).toBe(5);
            expect(number.lerp(10, 20, 0.5)).toBe(15);
        });
    });

    describe("dot", () => {
        it("calculates dot product", () => {
            expect(number.dot(1, 0, 1, 0)).toBe(1);
            expect(number.dot(1, 1, 1, 1)).toBe(2);
            expect(number.dot(2, 3, 4, 5)).toBe(2 * 4 + 3 * 5);
        });
    });
});

describe("string utils", () => {
    describe("random", () => {
        it("generates string of specified length", () => {
            expect(string.random(0)).toBe("");
            expect(string.random(5).length).toBe(5);
            expect(string.random(10).length).toBe(10);
        });

        it("uses default character set", () => {
            const result = string.random(100);
            const validChars = string.random.ALPHANUMERIC;
            for (const char of result) {
                expect(validChars).toContain(char);
            }
        });

        it("accepts custom character set", () => {
            const result = string.random(100, "AB");
            for (const char of result) {
                expect(["A", "B"]).toContain(char);
            }
        });

        it("throws on empty character set", () => {
            expect(() => string.random(5, "")).toThrow();
            expect(() => string.random(5, " ")).not.toThrow();
        });
    });

    describe("random constants", () => {
        it("ALPHANUMERIC contains expected chars", () => {
            expect(string.random.ALPHANUMERIC).toBe(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
            );
        });

        it("ALPHABETIC contains expected chars", () => {
            expect(string.random.ALPHABETIC).toBe(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            );
        });

        it("ALPHANUMERIC_LOW contains expected chars", () => {
            expect(string.random.ALPHANUMERIC_LOW).toBe("abcdefghijklmnopqrstuvwxyz1234567890");
        });

        it("ALPHABETIC_LOW contains expected chars", () => {
            expect(string.random.ALPHABETIC_LOW).toBe("abcdefghijklmnopqrstuvwxyz");
        });
    });
});
