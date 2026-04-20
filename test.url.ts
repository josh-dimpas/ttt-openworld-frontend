import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
    encodeGameConfig,
    decodeGameConfig,
    parseSearchParams,
} from "./src/utils/url";

describe("url utils", () => {
    describe("encodeGameConfig", () => {
        it("encodes object to base64 string", () => {
            const result = encodeGameConfig({ foo: "bar", num: 123 });
            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("encodes empty object", () => {
            const result = encodeGameConfig({});
            expect(typeof result).toBe("string");
        });
    });

    describe("decodeGameConfig", () => {
        it("decodes valid base64 string", () => {
            const encoded = encodeGameConfig({ foo: "bar", num: 123 });
            const decoded = decodeGameConfig<{ foo: string; num: number }>(encoded);
            expect(decoded).toEqual({ foo: "bar", num: 123 });
        });

        it("returns null for invalid base64", () => {
            const decoded = decodeGameConfig<unknown>("not-valid-base64!!!");
            expect(decoded).toBeNull();
        });

        it("roundtrips correctly", () => {
            const original = { a: 1, b: "test", c: [1, 2, 3] };
            const encoded = encodeGameConfig(original);
            const decoded = decodeGameConfig<typeof original>(encoded);
            expect(decoded).toEqual(original);
        });
    });

    describe("parseSearchParams", () => {
        it("parses empty params", () => {
            const params = new URLSearchParams();
            const result = parseSearchParams(params);
            expect(result).toEqual({});
        });

        it("parses single param", () => {
            const params = new URLSearchParams("foo=bar");
            const result = parseSearchParams(params);
            expect(result).toEqual({ foo: "bar" });
        });

        it("parses multiple params", () => {
            const params = new URLSearchParams("foo=bar&num=123&bool=true");
            const result = parseSearchParams(params);
            expect(result).toEqual({
                foo: "bar",
                num: "123",
                bool: "true",
            });
        });
    });
});