type PromiseFn<T> = () => Promise<T> | T;

async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const minDelay = async <T>(
  promise: PromiseFn<T> | Promise<T> | T,
  ms: number
) => {
  const [p] = await Promise.all([
    typeof promise === "function" ? (promise as PromiseFn<T>)() : promise,
    sleep(ms),
  ]);
  return p;
};
