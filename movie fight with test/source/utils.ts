export const debounce = <T extends (...args: unknown[]) => ReturnType<T>>(
  callback: T,
  delayMs = 500
) => {
  let timeoutId: number;
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeoutId) clearTimeout(timeoutId);
    return new Promise((resolve, _reject) => {
      timeoutId = setTimeout(() => {
        resolve(callback(...args));
      }, delayMs);
    });
  };
};
