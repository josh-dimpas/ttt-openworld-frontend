import { subscribeKey } from 'valtio/utils'

import { gameStore } from '@/stores/game'

import type { Game } from '#/types/game'
import { PieceBuffer } from '../PieceBuffer'
import type { Strike } from '../PieceBuffer'
import { RevealBuffer } from '../RevealBuffer'
import type { GraphicsController } from './main'
import { GraphicsControllerSubModule } from './submodule'
import { proxy } from 'valtio'

// Handles syncing of the current game state and config by managing the Valtio observable
export class GraphicsConfigController extends GraphicsControllerSubModule {
  CELL_SIZE = 100

  // @ts-expect-error Initialized on component mount
  game: Game
  // @ts-expect-error Initialized on component mount
  #stop: () => void

  revealBuffer: RevealBuffer
  pieceBuffer: PieceBuffer

  ownStrikes: Strike[] = []
  otherStrikes: Strike[] = []

  scores = proxy({ own: 0, other: 0 })

  get canPut() {
    return this.game.can_put
  }

  get chunkSize() {
    return this.game.config.chunk_size
  }

  get ownTurn(): 2 | 1 {
    return this.canPut
      ? ((this.game.state.turn + 1) as 2 | 1)
      : this.game.state.turn === 1
        ? 1
        : 2
  }

  get otherTurn(): 2 | 1 {
    return this.ownTurn === 1 ? 2 : 1
  }

  constructor(gc: GraphicsController) {
    super(gc)
    this.revealBuffer = new RevealBuffer()
    this.pieceBuffer = new PieceBuffer()
  }

  setup() {
    const game = gameStore.game
    if (!game)
      throw new Error('Setting up ConfigController without Game Config')

    this.#stop = subscribeKey(gameStore, 'game', (game) => {
      if (!game) throw new Error('Game has been removed from the store')
      console.log('UPDATING GAME: ', game)
      this.updateGame(game)
    })

    this.updateGame(game)
  }

  updateGame(game: Game) {
    this.game = game

    this.revealBuffer.updateBuffer(game.reveal_buffer)

    const [l, t, r, b] = this.revealBuffer.getCellBounds()

    this.camera.world.w = r - l + 1
    this.camera.world.h = b - t + 1
    this.camera.worldOffset.x = Math.abs(l)
    this.camera.worldOffset.y = Math.abs(t)

    this.camera.syncWorldSizeToScrollable()

    console.log(l, t, r, b)

    this.pieceBuffer.load(game.state.pieces)

    this.ownStrikes = this.pieceBuffer.computeStrikes(this.ownTurn)
    this.otherStrikes = this.pieceBuffer.computeStrikes(this.otherTurn)

    this.scores.own = this.ownStrikes.length
    this.scores.other = this.otherStrikes.length

    // console.log(l, t, r, b)

    // console.log({ ...this.camera.world, ...this.camera.worldOffset })

    // this.revealBuffer.debugPrintSetCells()

    // this.revealBuffer.forEach((chunk) => {
    //   console.log(chunk)
    //   return true
    // })

    // const tx = -2
    // const ty = 1

    // const chunkIndex = this.revealBuffer.getChunkIndex(tx, ty)

    // const {
    //   chunkX: _,
    //   chunkY: __,
    //   localX,
    //   localY,
    // } = this.revealBuffer.worldToChunk(tx, ty)
    // const index = this.revealBuffer.localToBitIndex(localX, localY)

    // console.log(chunkIndex, index, this.revealBuffer.getCell(tx, ty))

    // console.log(`${tx} ${ty}: ${this.revealBuffer.getCell(tx, ty)}`)
  }

  isFilled(x: number, y: number) {
    return this.revealBuffer.getCell(x, y)
  }

  getData(x: number, y: number) {
    return this.pieceBuffer.getCell(x, y)
  }

  dismount() {
    this.#stop()
  }
}
