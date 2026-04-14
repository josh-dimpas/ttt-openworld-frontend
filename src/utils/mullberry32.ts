// ------------------------
//        Simple and efficient 32-bit seeded PRNG 
// ------------------------

function strToInt(str: string): number {
    return str.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 65_535;
}

export function m32(seed: string | number) {
    if (typeof seed === 'string') seed = strToInt(seed)

    return () => {
        let t = ((seed as number) += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
