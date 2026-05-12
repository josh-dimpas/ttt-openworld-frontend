# TicTacToe Openworld

The project is a multiplayer open-world tic-tac-toe game. It uses WebSocket for real-time updates and Tanstack tools for handling caching and fetching, and all non-canvas related pages are server side rendered, utilizing server functions. It features a Lobby system for pooling players first then a customize canvas renderer for displaying game objects. The gameplay offers a non-ending (almost) open world top down view, and a fog of war system that prevents players from knowing the state of the other (configurable).

## Technical Details

### Game Structure

A game session can have a maximum theoretical size of `107,374,182,400` `(5^2 * 2^32)` number of cells to be populated by either X or O, despite that, this maximum will only take up `~57.445` gb raw uncompressed, which is still big on its own, but storing 107 billion bits takes up to ~13.4 gb so a 4.28x increase is not bad on its own when the game features a multi-directional expansion and a fog of war information, not including the pieces information. This is possible with the chunk-based system, where each chunk consist of the coordinate information + the chunk data, all stored in a bit buffer.

For example, the data structure for storing fog of war information uses this arrangement:

```ts
​[ <chunk_1_x:int16> <chunk_1_y:int16> <chunk_1_data:bin25> ...] // <---- Buffer Array
         ^                  ^                   ^
[ 0000000000000000 0000000000000000 1110011100111000000000000 ] // <---- Chunk Example
```

The example above is a RevealChunk, it contains 2x16bit integers for storing coordinates and a 25-bit data where each bit represents if that cell is revealed to the player or not. In the example above, the chunk is at 0, 0, containing the reveal information for cells between 0,0 to 4,4 (each chunk contains a 5x5 grid). The data represents a 3x3 revealed square where its center is at 1,1, in fact, this is the initial reveal chunk for all games, as the game starts with a 3x3 initially revealed cells.

The PieceChunk contains the pieces (X or O) works similarly. The only difference is the length of the data section. The main problem with a 25-bit data is each bit can only contain 1 or 0. A tictactoe cell can have 3 states: X, O and an empty cell, so the whole data section of the chunk contains 50-bits instead, and each cell takes up 2-bits.

### Rendering

In order to make use of virtualization, the rendering approach consists of an extra layer that can act as a spacer, while the canvas being fixed in the screen. This spacer will receive all the input events and relay it for the canvas to display.

It is not a practical solution since a canvas is only you need to localized render, however, I wanted the scrollbars to appear and simulate a virtualized scrolling behavior.

## Future Improvements

- The data structure would benefit greatly from even a simple RLE compression due to the number of consecutive 0 and 1s.

- The pieces data can only support 4-states, normally that is fine since we only need 3, however, the original idea is to add "powerups" in the map the players can click on to to produce a certain effect

- Interception for event sourcing could have a more elegant approach
