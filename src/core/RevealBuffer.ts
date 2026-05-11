export interface Chunk {
  x: number // now properly signed
  y: number // now properly signed
  data: number
}

export class RevealBuffer {
  private buffer: Uint8Array
  private byteLength: number
  private chunkCount: number
  private readonly lookup = new Map<number, number>() // key = (chunkX << 16 | chunkY)  [using signed values]

  constructor(initialBuffer: Uint8Array = new Uint8Array(0)) {
    this.buffer = initialBuffer
    this.byteLength = initialBuffer.length
    this.chunkCount = Math.floor((this.byteLength * 8) / 57)
    this.buildLookup()
  }

  // ====================== Cell & Chunk Methods ======================

  public localToBitIndex(localX: number, localY: number): number {
    return (
      (localY < 0 ? 5 + localY : localY) * 5 +
      (localX < 0 ? 5 + localX : localX)
    )
  }

  getCell(wx: number, wy: number): 0 | 1 {
    const { chunkX, chunkY, localX, localY } = this.worldToChunk(wx, wy)
    const chunkIndex = this.getChunkIndex(chunkX, chunkY)
    if (chunkIndex === -1) return 0

    const bitOffset =
      chunkIndex * 57 + 32 + this.localToBitIndex(localX, localY)
    return this.readBits(bitOffset, 1) as 0 | 1
  }

  // ====================== FIXED WORLD TO CHUNK ======================
  worldToChunk(wx: number, wy: number) {
    // Correct floor division and positive modulo for negative coordinates
    const chunkX = Math.floor(wx / 5)
    const chunkY = Math.floor(wy / 5)

    let localX = wx % 5
    let localY = wy % 5

    // Fix negative modulo (JavaScript behavior)
    if (localX < 0) localX += 5
    if (localY < 0) localY += 5

    return { chunkX, chunkY, localX, localY }
  }

  // ====================== Updated getChunkIndex ======================
  getChunkIndex(chunkX: number, chunkY: number): number {
    // Ensure consistent key even with negative numbers
    const key = ((chunkX & 0xffff) << 16) | (chunkY & 0xffff)
    return this.lookup.get(key) ?? -1
  }

  // ====================== Improved buildLookup ======================
  private buildLookup(): void {
    this.lookup.clear()
    for (let i = 0; i < this.chunkCount; i++) {
      const bitOffset = i * 57
      const x = this.readSignedBits(bitOffset, 16)
      const y = this.readSignedBits(bitOffset + 16, 16)

      // Use consistent key format
      const key = ((x & 0xffff) << 16) | (y & 0xffff)
      this.lookup.set(key, i)
    }
  }

  // ====================== Also update appendNewChunk ======================
  private appendNewChunk(chunkX: number, chunkY: number): number {
    const chunkBytes = new Uint8Array(8)

    this.writeBitsToArray(chunkBytes, 0, 16, chunkX & 0xffff)
    this.writeBitsToArray(chunkBytes, 16, 16, chunkY & 0xffff)

    const newBuffer = new Uint8Array(this.byteLength + 8)
    newBuffer.set(this.buffer, 0)
    newBuffer.set(chunkBytes, this.byteLength)

    this.buffer = newBuffer
    this.byteLength = newBuffer.length
    this.chunkCount++

    const newIndex = this.chunkCount - 1
    const key = ((chunkX & 0xffff) << 16) | (chunkY & 0xffff)
    this.lookup.set(key, newIndex)

    return newIndex
  }

  setCell(wx: number, wy: number, value: boolean | 0 | 1): void {
    const bitValue = value ? 1 : 0
    const { chunkX, chunkY, localX, localY } = this.worldToChunk(wx, wy)
    let chunkIndex = this.getChunkIndex(chunkX, chunkY)

    if (chunkIndex === -1) {
      chunkIndex = this.appendNewChunk(chunkX, chunkY)
    }

    const bitOffset =
      chunkIndex * 57 + 32 + this.localToBitIndex(localX, localY)
    this.writeBit(bitOffset, bitValue)
  }

  getChunk(index: number): Chunk | null {
    if (index < 0 || index >= this.chunkCount) return null

    const bitOffset = index * 57
    return {
      x: this.readSignedBits(bitOffset, 16), // ← Fixed
      y: this.readSignedBits(bitOffset + 16, 16), // ← Fixed
      data: this.readBits(bitOffset + 32, 25),
    }
  }

  // ====================== Bit Reading ======================

  private readBits(bitOffset: number, bitLength: number): number {
    let value = 0
    let bitsLeft = bitLength

    while (bitsLeft > 0) {
      const bytePos = Math.floor(bitOffset / 8)
      const bitInByte = bitOffset % 8
      const bitsToRead = Math.min(8 - bitInByte, bitsLeft)

      const mask = (1 << bitsToRead) - 1
      const shifted =
        (this.buffer[bytePos] >> (8 - bitInByte - bitsToRead)) & mask

      value = (value << bitsToRead) | shifted

      bitOffset += bitsToRead
      bitsLeft -= bitsToRead
    }
    return value
  }

  /** Read signed integer (two's complement) */
  private readSignedBits(bitOffset: number, bitLength: number): number {
    const unsigned = this.readBits(bitOffset, bitLength)
    const signBit = 1 << (bitLength - 1)
    if (unsigned & signBit) {
      return unsigned - (1 << bitLength) // Convert to negative
    }
    return unsigned
  }

  private writeBit(bitOffset: number, value: 0 | 1): void {
    const bytePos = Math.floor(bitOffset / 8)
    const bitInByte = bitOffset % 8
    const mask = 1 << (7 - bitInByte)

    if (value) {
      this.buffer[bytePos] |= mask
    } else {
      this.buffer[bytePos] &= ~mask
    }
  }

  private writeBitsToArray(
    target: Uint8Array,
    bitOffset: number,
    bitLength: number,
    value: number,
  ): void {
    let v = value
    let bitsLeft = bitLength

    while (bitsLeft > 0) {
      const bytePos = Math.floor(bitOffset / 8)
      const bitInByte = bitOffset % 8
      const bitsToWrite = Math.min(8 - bitInByte, bitsLeft)

      const mask = (1 << bitsToWrite) - 1
      const shifted = (v & mask) << (8 - bitInByte - bitsToWrite)

      target[bytePos] |= shifted

      v >>= bitsToWrite
      bitOffset += bitsToWrite
      bitsLeft -= bitsToWrite
    }
  }

  // ... rest of the methods (updateBuffer, appendBuffer, forEach, etc.) remain the same
  updateBuffer(newBuffer: Uint8Array): void {
    this.buffer = newBuffer
    this.byteLength = newBuffer.length
    this.chunkCount = Math.floor((this.byteLength * 8) / 57)
    this.buildLookup()
  }

  /**
   * Returns the bounding box of all cells that are set to 1.
   * Returns [left, top, right, bottom] in world coordinates.
   * Returns null if there are no cells set to 1.
   */
  getCellBounds(): [number, number, number, number] {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let i = 0; i < this.chunkCount; i++) {
      const bitOffset = i * 57
      const chunkX = this.readSignedBits(bitOffset, 16)
      const chunkY = this.readSignedBits(bitOffset + 16, 16)
      const data = this.readBits(bitOffset + 32, 25) // 25-bit data

      // Check each of the 25 bits
      for (let local = 0; local < 25; local++) {
        const isSet = (data & (1 << (24 - local))) !== 0
        const localX = local % 5
        const localY = Math.floor(local / 5)

        const worldX = chunkX * 5 + localX
        const worldY = chunkY * 5 + localY

        if (isSet) {
          // if bit is set

          if (worldX < minX) minX = worldX
          else if (worldX > maxX) maxX = worldX
          if (worldY < minY) minY = worldY
          else if (worldY > maxY) maxY = worldY
        }
      }
    }

    if (minX === Infinity) minX = 0
    if (minY === Infinity) minY = 0
    if (maxX === -Infinity) maxX = 0
    if (maxY === -Infinity) maxY = 0

    return [minX, minY, maxX, maxY]
  }

  debugPrintSetCells(): void {
    console.log(`=== ChunkBuffer Debug - ${this.chunkCount} chunks ===`)
    for (let i = 0; i < this.chunkCount; i++) {
      const bitOffset = i * 57
      const chunkX = this.readSignedBits(bitOffset, 16)
      const chunkY = this.readSignedBits(bitOffset + 16, 16)
      const data = this.readBits(bitOffset + 32, 25)

      const setCells: string[] = []

      for (let localBit = 0; localBit < 25; localBit++) {
        if ((data & (1 << localBit)) !== 0) {
          const lx = localBit % 5
          const ly = Math.floor(localBit / 5)
          setCells.push(`(${lx},${ly})`)
        }
      }

      if (setCells.length > 0) {
        console.log(`Chunk (${chunkX}, ${chunkY}) → ${setCells.join(', ')}`)
      }
    }
  }

  /**
   * Loop through each chunk with optional early termination
   */
  forEach(
    callback: (
      chunk: Chunk,
      index: number,
      buffer: RevealBuffer,
    ) => boolean | void,
  ): void {
    for (let i = 0; i < this.chunkCount; i++) {
      const chunk = this.getChunk(i)
      if (chunk) {
        const result = callback(chunk, i, this)
        if (result === false) break // allow early exit by returning false
      }
    }
  }

  get totalChunks(): number {
    return this.chunkCount
  }

  get rawBuffer(): Uint8Array {
    return this.buffer
  }
}
