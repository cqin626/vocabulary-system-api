export async function safePromise<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return [null, err];
    }
    return [null, new Error(String(err))];
  }
}
