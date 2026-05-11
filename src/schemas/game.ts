import z from 'zod'

export class GameSchema {
  public static config = z.object({
    seed: z.string(),
    chunk_size: z.number(),
    win_points_threshold: z.number(),
    shared_fog: z.boolean(),
    time_limit_seconds: z.number(),
    reveal_radius: z.number(),
  })

  public static player = z.object({
    id: z.number(),
    revealBuffer: z.array(z.number()),
  })

  public static state = z.object({
    mapLayer: z.number(),
    dataLayer: z.number(),
    turn: z.number(),
  })
}
