# OpenWorld TicTacToe

Adding "open-world" to a tic-tac-toe game might be unusual, that is why I made this application to explore more on the idea, along with practicing my organizational design mechanisms and virtualization techniques.

## Features
- Open World 
    - bigger than 3x3 grid map
- Fog of War 
    - initially shows a 3x3 map, but more of the map will reveal on every "play" of a player
- Modified Game Loop
    - Lives system, players needs to get more than `1` row/column/diagonal pattern
    - Boosts, all through out the map, will sometimes appear a "boost" or "powerup" that a player can "activate" that offers different boons/benefits/punishers. Randomly generated but seeded
- Online - play with someone through websockets (planned as optional way to play)
- Terrains/Biome
    - procedural generation where some 'areas' can't be used to "put" on
    - seeded

### Future Plans
- Night/Day cycle
    - Some mechanics of the game changes based on the "time" (based on how many turns has been played)
- Villages / NPCs
    - Acts like powerups but can act autonomously in a game 

## Main Pain Points:
These are the items that requires clearly defined details. As of the time of writing, I don't have a clear structure in my head on how to execute and solve these problems, however, I assume they are interconnected to each other.

- Rendering Strategy
- Game loop
    - Networking
    - Data Structure
- Deadline Constraints


### Rendering Strategy
Since this will be open-world, this means we break the standard rule of a 3x3 grid, this propose multiple challenges, from how the data is stored and displayed. 

My plan is to use a "Chunk" based data structure to store coordinates and terrain data. These are all stored as a binary blob. Please refer to [Data Structures: Chunks](#data-structures) for a detailed breakdown on how these chunks are stored.

These chunks contains coordinate data, this way, we only render the chunks that overlaps within the viewbox. For a faster query of these chunks, we store them in a hashmap where the coordinates is the hash. These map can also act as a cache to improve data fetching from the server.

As for the terrain rendering, it is done through perlin noise rendered through CanvasAPI (since impossible on css)

The same mechanism on chunk query will be used for the "boost" layer and the "plays" layer (the layer that contains the 'x' and 'o' ) where data is stored as chunks

### Game Loop

### Data Structure
-   Coordinates: 2 x `16 bit` data<br>
    Stored inside the first 32 bits of a single chunk. This lets us have a maximum theoretical map of 65535x65535 where each chunk can contain `n` x `n` grid where `n` is the chunk size
-   Data: `4 bits per grid`<br>
    Contains the `vector` direction for perlin noise terrain. A size of a single vector direction depends on the `GameConfig`, `4 bits` means 2^4 number of possible vector configurations (16 directions). A chunk with a size of `4` contains 4 x 4 x `4 bits` + 2 x `16 bits` for a total of `80 bits` per chunk

In 
