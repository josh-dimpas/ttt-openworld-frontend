import { describe, expect, it, vi } from "vitest";

import { EventEmitter } from "./src/core/EventEmitter";
import { MapGen, Chunk } from "./src/core/MapGeneration";

describe("EventEmitter", () => {
    it("registers and emits events", () => {
        const emitter = new EventEmitter();
        const callback = vi.fn();

        emitter.on("test", callback);
        emitter.emit("test", "arg1", "arg2");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("calls multiple listeners", () => {
        const emitter = new EventEmitter();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        emitter.on("test", cb1);
        emitter.on("test", cb2);
        emitter.emit("test");

        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it("removes listeners with off", () => {
        const emitter = new EventEmitter();
        const callback = vi.fn();

        emitter.on("test", callback);
        emitter.off("test", callback);
        emitter.emit("test");

        expect(callback).not.toHaveBeenCalled();
    });

    it("handles once listeners", () => {
        const emitter = new EventEmitter();
        const callback = vi.fn();

        emitter.once("test", callback);
        emitter.emit("test");
        emitter.emit("test");

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("removes all listeners with removeAllListeners", () => {
        const emitter = new EventEmitter();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        emitter.on("test1", cb1);
        emitter.on("test2", cb2);
        emitter.removeAllListeners();

        emitter.emit("test1");
        emitter.emit("test2");

        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();
    });

    it("removes specific event listeners", () => {
        const emitter = new EventEmitter();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        emitter.on("test1", cb1);
        emitter.on("test2", cb2);
        emitter.removeAllListeners("test1");

        emitter.emit("test1");
        emitter.emit("test2");

        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it("handles typed events", () => {
        type Events = {
            foo: [string, number];
            bar: [];
        };
        const emitter = new EventEmitter<Events>();
        const callback = vi.fn();

        emitter.on("foo", (a, b) => {
            callback(a, b);
        });
        emitter.emit("foo", "hello", 42);

        expect(callback).toHaveBeenCalledWith("hello", 42);
    });
});

describe("MapGeneration", () => {
    describe("MapGen", () => {
        it("creates instance with seed", () => {
            const gen = new MapGen({ seed: "test" });
            expect(gen.seed).toBe("test");
        });

        it("generates single chunk", () => {
            const gen = new MapGen({ seed: "test" });
            const chunk = gen.generateChunk(5, 10);
            expect(chunk).toEqual({ x: 5, y: 10 });
        });

        it("generates cluster with default radius", () => {
            const gen = new MapGen({ seed: "test" });
            const cluster = gen.generateCluster(0, 0);

            // Default radius = 1, so cluster is 3x3 = 9 chunks
            expect(cluster.length).toBe(9);
        });

        it("generates cluster with custom radius", () => {
            const gen = new MapGen({ seed: "test" });
            const cluster = gen.generateCluster(0, 0, 0);
            expect(cluster.length).toBe(1);

            const cluster2 = gen.generateCluster(0, 0, 2);
            // radius 2 = (2*2+1)^2 = 25 chunks
            expect(cluster2.length).toBe(25);
        });

        it("generates cluster at offset position", () => {
            const gen = new MapGen({ seed: "test" });
            const cluster = gen.generateCluster(5, 5, 0);

            expect(cluster).toContainEqual({ x: 5, y: 5 });
        });

        it("generates cluster with correct bounds", () => {
            const gen = new MapGen({ seed: "test" });
            const cluster = gen.generateCluster(5, 5, 1);

            // radius 1 = 3x3 around (5,5), so x in [4,6], y in [4,6]
            expect(cluster.length).toBe(9);
            expect(cluster).toContainEqual({ x: 4, y: 4 });
            expect(cluster).toContainEqual({ x: 6, y: 6 });
            expect(cluster).not.toContainEqual({ x: 3, y: 3 });
            expect(cluster).not.toContainEqual({ x: 7, y: 7 });
        });
    });

    describe("Chunk", () => {
        it("exists as empty class", () => {
            const chunk = new Chunk();
            expect(chunk).toBeInstanceOf(Chunk);
        });
    });
});
