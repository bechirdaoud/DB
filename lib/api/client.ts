export async function getPlaceholder<T>(payload: T, delayMs = 150): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return payload;
}
