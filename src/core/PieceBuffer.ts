/**
 * ChunkBuffer
 *
 * Parses a tightly-packed Uint8Array where each chunk is exactly 82 bits:
 *   [ x: int16 (16 bits) | y: int16 (16 bits) | data: 50 bits ]
 *
 * Chunks are packed back-to-back with NO per-chunk padding. Only the very
 * last byte of the buffer may contain trailing padding bits.
 *
 * Cell layout inside a chunk (5×5 grid, 2 bits per cell):
 *   - Cell (0,0) occupies the FIRST 2 bits of the 50-bit data block (MSB side).
 *   - Cell (4,4) occupies the LAST  2 bits of the 50-bit data block (LSB side).
 *   - Row-major order: left→right, top→bottom.
 *
 * Cell values: 0, 1, 2, or 3 (raw 2-bit value, no shift).
 */

const BITS_PER_CHUNK = 82
const CELLS_PER_AXIS = 5
const BITS_PER_CELL = 2

// ---------------------------------------------------------------------------
// Low-level bit reader
// ---------------------------------------------------------------------------

/**
 * Reads `count` bits starting at `bitOffset` from `buffer`, returned as a
 * 32-bit unsigned integer (MSB of the extracted window = MSB of result).
 *
 * Supports reads of up to 32 bits.
 */
function readBits(
  buffer: Uint8Array,
  bitOffset: number,
  count: number,
): number {
  if (count === 0) return 0
  if (count > 32) throw new RangeError('readBits: count must be ≤ 32')

  let result = 0
  let bitsLeft = count
  let currentBitOffset = bitOffset

  while (bitsLeft > 0) {
    const byteIndex = currentBitOffset >>> 3 // which byte
    const bitInByte = currentBitOffset & 7 // bit position within that byte (0 = MSB)
    const availableInByte = 8 - bitInByte // bits remaining in this byte
    const bitsToRead = Math.min(availableInByte, bitsLeft)

    // Extract `bitsToRead` bits starting at `bitInByte` from the current byte.
    // Shift right to align to LSB, then mask to keep only `bitsToRead` bits.
    const shift = availableInByte - bitsToRead
    const mask = (1 << bitsToRead) - 1
    const extracted = (buffer[byteIndex] >>> shift) & mask

    result = (result << bitsToRead) | extracted
    currentBitOffset += bitsToRead
    bitsLeft -= bitsToRead
  }

  return result >>> 0 // force unsigned
}

/**
 * Reads a signed 16-bit integer from a bit offset.
 */
function readInt16(buffer: Uint8Array, bitOffset: number): number {
  const raw = readBits(buffer, bitOffset, 16)
  // Sign-extend from 16 bits
  return raw >= 0x8000 ? raw - 0x10000 : raw
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChunkCoord {
  x: number
  y: number
}

export interface Chunk {
  x: number // chunk coordinate (signed)
  y: number // chunk coordinate (signed)
  bitOffset: number // where this chunk starts in the source buffer
}

export type StrikeOrientation =
  | 'horizontal'
  | 'vertical'
  | 'diagonal-lr'
  | 'diagonal-rl'

export interface StrikeCell {
  x: number
  y: number
}

export interface Strike {
  cells: [StrikeCell, StrikeCell, StrikeCell]
  orientation: StrikeOrientation
}

/** Scan directions: [dx, dy] → orientation label */
const DIRECTIONS: Array<{
  dx: number
  dy: number
  orientation: StrikeOrientation
}> = [
  { dx: 1, dy: 0, orientation: 'horizontal' },
  { dx: 0, dy: 1, orientation: 'vertical' },
  { dx: 1, dy: 1, orientation: 'diagonal-lr' },
  { dx: 1, dy: -1, orientation: 'diagonal-rl' },
]

// ---------------------------------------------------------------------------
// ChunkBuffer
// ---------------------------------------------------------------------------

export class PieceBuffer {
  private buffer: Uint8Array = new Uint8Array(0)

  /** Map from "x,y" → Chunk metadata (bit offset into the buffer). */
  private chunkMap: Map<string, Chunk> = new Map()

  /**
   * Per-piece-type strike cache.
   * Key: piece type (1 or 2). Value: confirmed strikes found so far.
   */
  private strikeCache: Map<number, Strike[]> = new Map()

  /**
   * Per-piece-type set of cell keys permanently off-limits for detection
   * because they already belong to a cached strike.
   * Key: piece type (1 or 2). Value: Set of "x,y" cell keys.
   */
  private markedCells: Map<number, Set<string>> = new Map()

  // -------------------------------------------------------------------------
  // Loading
  // -------------------------------------------------------------------------

  /**
   * Load (or reload) the chunk buffer from the server.
   * `fetchFn` should return the raw Uint8Array received from the server.
   */
  load(bitarray: Uint8Array) {
    this.setBuffer(bitarray)
  }

  /**
   * Synchronously replace the buffer (e.g. if you already have the bytes).
   * Strike caches are intentionally preserved across reloads — only newly
   * appearing strikes will be appended on the next computeStrikes() call.
   */
  setBuffer(data: Uint8Array): void {
    this.buffer = data
    this.chunkMap = new Map()
    this.parseChunks()
  }

  // -------------------------------------------------------------------------
  // Parsing
  // -------------------------------------------------------------------------

  private parseChunks(): void {
    const totalBits = this.buffer.length * 8
    let bitOffset = 0
    let index = 0

    while (bitOffset + BITS_PER_CHUNK <= totalBits) {
      const x = readInt16(this.buffer, bitOffset)
      const y = readInt16(this.buffer, bitOffset + 16)

      const chunk: Chunk = { x, y, bitOffset }
      this.chunkMap.set(this.key(x, y), chunk)

      bitOffset += BITS_PER_CHUNK
      index++
    }
  }

  private key(x: number, y: number): string {
    return `${x},${y}`
  }

  // -------------------------------------------------------------------------
  // Chunk access
  // -------------------------------------------------------------------------

  /**
   * Returns the number of chunks in the buffer.
   */
  get chunkCount(): number {
    return this.chunkMap.size
  }

  /**
   * Returns the Chunk metadata for the given chunk coordinate, or undefined.
   */
  getChunk(chunkX: number, chunkY: number): Chunk | undefined {
    return this.chunkMap.get(this.key(chunkX, chunkY))
  }

  /**
   * Returns true if a chunk at (chunkX, chunkY) exists in the buffer.
   */
  hasChunk(chunkX: number, chunkY: number): boolean {
    return this.chunkMap.has(this.key(chunkX, chunkY))
  }

  /**
   * Iterates over every chunk in the buffer.
   * Callback receives (chunk, index).
   */
  forEachChunk(callback: (chunk: Chunk, index: number) => void): void {
    let index = 0
    for (const chunk of this.chunkMap.values()) {
      callback(chunk, index++)
    }
  }

  /**
   * Returns all chunks as an array.
   */
  getChunks(): Chunk[] {
    return Array.from(this.chunkMap.values())
  }

  // -------------------------------------------------------------------------
  // Cell access
  // -------------------------------------------------------------------------

  /**
   * Converts global cell coordinates to a chunk coordinate and a local cell
   * coordinate within that chunk.
   *
   * Global cell (0,0) → chunk (0,0), local (0,0)  [top-left of chunk (0,0)]
   * Global cell (-1,-1) → chunk (-1,-1), local (4,4) [bottom-right of chunk (-1,-1)]
   */
  cellToChunkCoord(
    cellX: number,
    cellY: number,
  ): { chunkX: number; chunkY: number; localX: number; localY: number } {
    // JavaScript's % operator can return negative values for negative operands,
    // so we use a proper floored division / modulo.
    const chunkX = Math.floor(cellX / CELLS_PER_AXIS)
    const chunkY = Math.floor(cellY / CELLS_PER_AXIS)
    const localX = ((cellX % CELLS_PER_AXIS) + CELLS_PER_AXIS) % CELLS_PER_AXIS
    const localY = ((cellY % CELLS_PER_AXIS) + CELLS_PER_AXIS) % CELLS_PER_AXIS
    return { chunkX, chunkY, localX, localY }
  }

  /**
   * Returns the raw 2-bit cell value (0–3) for the given local cell position
   * within a chunk.
   *
   * localX and localY must be in [0, 4].
   */
  getLocalCell(chunk: Chunk, localX: number, localY: number): number {
    // Data block starts 32 bits into the chunk (after two int16s).
    const dataBlockBitOffset = chunk.bitOffset + 32

    // Cells are in row-major order, (0,0) is the first (MSB-most) cell.
    const cellIndex = localY * CELLS_PER_AXIS + localX
    const cellBitOffset = dataBlockBitOffset + cellIndex * BITS_PER_CELL

    return readBits(this.buffer, cellBitOffset, BITS_PER_CELL)
  }

  /**
   * Returns the raw 2-bit cell value (0–3) for any global cell coordinate.
   * Supports negative coordinates.
   *
   * Returns `undefined` if the owning chunk is not present in the buffer.
   */
  getCell(cellX: number, cellY: number): number | undefined {
    const { chunkX, chunkY, localX, localY } = this.cellToChunkCoord(
      cellX,
      cellY,
    )
    const chunk = this.getChunk(chunkX, chunkY)
    if (!chunk) return undefined
    return this.getLocalCell(chunk, localX, localY)
  }

  // -------------------------------------------------------------------------
  // Strike detection
  // -------------------------------------------------------------------------

  /**
   * Scans all loaded cells for 3-consecutive runs of `pieceType` in all 8
   * directions (via 4 directional vectors — each covers both ends).
   *
   * **Caching & marking rules:**
   * - Strikes found in previous calls are preserved and never moved.
   * - Any cell that belongs to a cached strike is permanently off-limits and
   *   will never be claimed by a new strike, even if it is part of a longer run.
   * - Within a single call, cells are marked greedily in scan order
   *   (top-to-bottom, left-to-right per chunk, then by direction priority).
   *   Once a cell is claimed by a new strike it is immediately marked and
   *   cannot be used by any subsequent candidate in this same call.
   * - A 4-in-a-row produces exactly 1 strike (the first non-overlapping
   *   window found), not 2.
   *
   * Returns the full list of strikes (cached + newly found this call).
   *
   * @param pieceType  1 (X) or 2 (O)
   */
  computeStrikes(pieceType: 1 | 2): Strike[] {
    // Initialise per-piece structures lazily.
    if (!this.strikeCache.has(pieceType)) {
      this.strikeCache.set(pieceType, [])
      this.markedCells.set(pieceType, new Set())
    }

    const cache = this.strikeCache.get(pieceType)!
    const marked = this.markedCells.get(pieceType)!

    // Collect every global cell coordinate that holds pieceType, is not
    // already marked, and lives inside a chunk we have data for.
    // We gather them first so we can sort into a stable, deterministic order
    // before running the directional scan.
    const candidates = new Set<string>() // "x,y" keys for quick look-up
    const candidateList: StrikeCell[] = []

    for (const chunk of this.chunkMap.values()) {
      const baseX = chunk.x * CELLS_PER_AXIS
      const baseY = chunk.y * CELLS_PER_AXIS

      for (let localY = 0; localY < CELLS_PER_AXIS; localY++) {
        for (let localX = 0; localX < CELLS_PER_AXIS; localX++) {
          const val = this.getLocalCell(chunk, localX, localY)
          if (val !== pieceType) continue

          const gx = baseX + localX
          const gy = baseY + localY
          const k = this.key(gx, gy)

          if (!marked.has(k)) {
            candidates.add(k)
            candidateList.push({ x: gx, y: gy })
          }
        }
      }
    }

    // Sort: top-to-bottom, then left-to-right — gives a stable, reproducible
    // scan order regardless of chunk insertion order in the map.
    candidateList.sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x))

    // Helper: is a global cell available (has pieceType AND not marked)?
    const isAvailable = (x: number, y: number): boolean => {
      const k = this.key(x, y)
      // Must be an unmarked candidate we collected above (avoids a getCell
      // call and guarantees we only use cells from loaded chunks).
      return candidates.has(k) && !marked.has(k)
    }

    const newStrikes: Strike[] = []

    // Scan each direction. We only start a run from the "leading" end to avoid
    // counting the same run twice (e.g. for dx=1,dy=0 we skip any cell whose
    // immediate left neighbour is also a valid piece — that neighbour would
    // have started the run already).
    for (const { dx, dy, orientation } of DIRECTIONS) {
      for (const { x: sx, y: sy } of candidateList) {
        // Skip if this cell is already claimed (by cache or a new strike in
        // this call found earlier in the loop).
        if (!isAvailable(sx, sy)) continue

        // Only start a run from the "head" — the cell that has NO predecessor
        // in this direction. This ensures each run is counted once.
        const prevX = sx - dx
        const prevY = sy - dy
        const hasPredecessor =
          this.getCell(prevX, prevY) === pieceType &&
          !marked.has(this.key(prevX, prevY))

        if (hasPredecessor) continue // middle/tail of a run — skip

        // Walk forward collecting consecutive available cells.
        // We collect greedily but emit strikes in non-overlapping windows of 3.
        const run: StrikeCell[] = []
        let cx = sx
        let cy = sy

        while (isAvailable(cx, cy)) {
          run.push({ x: cx, y: cy })
          cx += dx
          cy += dy
        }

        // Consume the run in windows of exactly 3, marking as we go.
        // Any leftover cells (< 3 at the tail) are left unmarked so a future
        // call can pick them up if more pieces are added.
        let i = 0
        while (i + 3 <= run.length) {
          const triplet = run.slice(i, i + 3) as [
            StrikeCell,
            StrikeCell,
            StrikeCell,
          ]

          // Mark all three cells immediately so subsequent directions in this
          // same call cannot steal them.
          for (const cell of triplet) {
            marked.add(this.key(cell.x, cell.y))
            candidates.delete(this.key(cell.x, cell.y)) // keep isAvailable fast
          }

          newStrikes.push({ cells: triplet, orientation })
          i += 3 // advance by 3 — no overlap
        }
      }
    }

    // Append new strikes to the persistent cache.
    cache.push(...newStrikes)

    // Return the full picture: everything cached + newly found.
    return cache
  }

  /**
   * Clears the strike cache and marked-cell set for a given piece type.
   * After calling this, the next computeStrikes() will re-scan from scratch.
   */
  clearStrikeCache(pieceType: 1 | 2): void {
    this.strikeCache.delete(pieceType)
    this.markedCells.delete(pieceType)
  }
}
