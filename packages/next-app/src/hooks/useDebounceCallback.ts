import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const useDebounceCallback = <T extends unknown[]>(
  fn: (...args: T) => void,
  deps: unknown[],
  duration: number,
) => {
  const memorized = useMemo(
    () => fn,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  const [cnt, setCnt] = useState(0);
  const nextArgs = useRef<T>();

  const lastCnt = useRef(0);
  useEffect(() => {
    if (lastCnt.current === cnt) {
      return;
    }

    const timeout = setTimeout(() => {
      lastCnt.current = cnt;
      if (!nextArgs.current) {
        return;
      }
      memorized(...nextArgs.current);
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [cnt, duration, memorized]);

  return useCallback((...args: T) => {
    nextArgs.current = args;
    setCnt((prev) => prev + 1);
  }, []);
};
