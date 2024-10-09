import { RefObject, useEffect } from 'react';

export const useClickOutside = (
  refsArr: RefObject<HTMLElement | undefined>[],
  callback: () => void,
  addEventListener = true
) => {
  const handleClick = (event: MouseEvent) => {
    const isOutsideClick = refsArr.every(
      (ref) => ref.current && !ref.current.contains(event.target as HTMLElement)
    );
    if (isOutsideClick) {
      callback();
    }
  };

  useEffect(() => {
    if (addEventListener) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
