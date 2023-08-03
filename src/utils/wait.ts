export function wait(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
