// @oxlint-disable
import { describe, expect, it } from "vitest";

import { cn } from "../src/lib/utils";

describe("lib utils", () => {
    describe("cn", () => {
        it("merges class names", () => {
            expect(cn("foo", "bar")).toBe("foo bar");
        });

        it("handles conditional classes", () => {
            const cond = false;
            expect(cn("foo", cond && "bar")).toBe("foo");
            expect(cn("foo", true && "bar")).toBe("foo bar");
        });

        it("handles arrays", () => {
            expect(cn(["foo", "bar"])).toBe("foo bar");
            expect(cn(["foo", false, "bar"])).toBe("foo bar");
        });

        it("handles objects", () => {
            expect(cn({ foo: true, bar: false })).toBe("foo");
            expect(cn({ foo: false, bar: true })).toBe("bar");
        });

        it("handles mixed inputs", () => {
            expect(cn("foo", { bar: true, baz: false }, "qux")).toBe("foo bar qux");
        });

        it("handles empty inputs", () => {
            expect(cn()).toBe("");
            expect(cn("")).toBe("");
            expect(cn("", "")).toBe("");
        });
    });
});
