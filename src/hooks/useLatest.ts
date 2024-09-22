import { useLayoutEffect, useRef } from 'react';

export default function useLatest<Value>(value: Value) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
