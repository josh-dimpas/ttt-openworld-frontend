export async function promiseTimeout(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs))
}
