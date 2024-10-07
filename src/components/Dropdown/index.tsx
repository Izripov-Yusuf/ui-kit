// Правки
// - outside click - нужно обрабатывать ✅
// - рендерить меню в портале ✅
// - не рендерить обертку для триггера, делать через клон элемент - https://youtu.be/D7UDfW2MFI4?si=7uwxQhXuahtMlVBi ✅
// - нет закрытия при клике на айтем
// - добавить внешний обработчик клика в айтем

// import { Transition } from '@headlessui/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';

import styles from './Dropdown.module.css';
import { useClickOutside } from '../../hooks/useClickOutside';

import { modalRoot } from '../../constants';
import { createPortal } from 'react-dom';

type DropdownProps = {} & PropsWithChildren;

type TriggerChildProps = {
  onClick: React.MouseEventHandler<HTMLElement>;
  ref: React.MutableRefObject<HTMLDivElement | null>;
};
type TriggerProps = {
  children: (props: TriggerChildProps) => React.ReactElement;
};

type DropdownContextType = {
  isOpen: boolean;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
  setToggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      'This component must be used within a <Dropdown> component.'
    );
  }

  return context;
}

const DropdownRoot = ({ children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setToggle = useCallback(() => setIsOpen((prevState) => !prevState), []);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      setToggle,
      triggerRef,
    }),
    [isOpen, setToggle]
  );

  useClickOutside(rootRef, setToggle, isOpen);

  return (
    <DropdownContext.Provider value={value}>
      <div className={styles.root} ref={rootRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children }: TriggerProps) => {
  const { setToggle, triggerRef } = useDropdownContext();
  return (
    <>
      {children({
        onClick: setToggle,
        ref: triggerRef,
      })}
    </>
  );
};

const Menu = ({ children }: PropsWithChildren) => {
  // TODO: сейчас из-за портала меню закрывается даже при клике на айтемы внутри него
  // TODO: сделать как-нибудь плавность, щас Transition мешает, появляются проблемы с рефом
  const { isOpen, triggerRef } = useDropdownContext();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const anchor = triggerRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const TOP_SPACE = 20;

    setPosition({
      top: anchorRect.top + menuRect.height - TOP_SPACE,
      left: anchorRect.left + anchorRect.width / 2 - menuRect.width / 2,
    });
  }, [isOpen]);

  return createPortal(
    isOpen && (
      <div
        className={styles.menu}
        style={{ top: position.top, left: position.left }}
        ref={menuRef}
      >
        {children}
      </div>
    ),
    modalRoot
  );
};

const Item = ({ children }: PropsWithChildren) => {
  return <div className={styles.item}>{children}</div>;
};

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Menu,
  Item,
});
