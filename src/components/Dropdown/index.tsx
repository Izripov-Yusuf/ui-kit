// Правки
// - outside click - нужно обрабатывать ✅
// - рендерить меню в портале ✅
// - не рендерить обертку для триггера, делать через клон элемент - https://youtu.be/D7UDfW2MFI4?si=7uwxQhXuahtMlVBi ✅
// - нет закрытия при клике на айтем ✅
// - добавить внешний обработчик клика в айтем ✅

import { Transition } from '@headlessui/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import styles from './Dropdown.module.css';
import { useClickOutside } from '../../hooks/useClickOutside';

import { modalRoot } from '../../constants';
import { createPortal } from 'react-dom';
import { useEvent } from '../../hooks/useEvent';

type DropdownProps = {} & PropsWithChildren;

type RenderlessChildProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
  className?: string;
};
type RenderlessComponentProps = {
  children: (props: RenderlessChildProps) => React.ReactElement;
};

type DropdownContextType = {
  isOpen: boolean;
  position: {
    top: number;
    left: number;
  };
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
  menuCbRef: (menuElement: HTMLDivElement | null) => any;
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

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuCbRef = useEvent((menuElement: HTMLDivElement | null) => {
    if (!isOpen) {
      return;
    }

    const anchor = triggerRef.current;
    const menu = menuElement;
    if (!anchor || !menu) {
      return;
    }
    menuRef.current = menu;

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const TOP_SPACE = 20;

    const newPosition = {
      top: anchorRect.top + menuRect.height - TOP_SPACE,
      left: anchorRect.left + anchorRect.width / 2 - menuRect.width / 2,
    };

    // TODO: насколько норм? И почему это решает проблему
    requestAnimationFrame(() => {
      setPosition(newPosition);
    });
  });

  const value = useMemo(
    () => ({
      isOpen,
      position,
      setToggle,
      triggerRef,
      menuCbRef,
    }),
    [isOpen, position, setToggle]
  );

  useClickOutside([menuRef, triggerRef], setToggle, isOpen);

  return (
    <DropdownContext.Provider value={value}>
      <div className={styles.root}>{children}</div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children }: RenderlessComponentProps) => {
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
  const { isOpen, position, menuCbRef } = useDropdownContext();

  return createPortal(
    <Transition show={isOpen}>
      <div
        className={styles.menu}
        style={{ top: position.top, left: position.left }}
        ref={menuCbRef}
      >
        {children}
      </div>
    </Transition>,
    modalRoot
  );
};

const Item = ({ children }: RenderlessComponentProps) => {
  // TODO: Норм ли здесь использовать renderless подход?
  const { setToggle } = useDropdownContext();
  return (
    <>
      {children({
        onClick: setToggle,
        className: styles.item,
      })}
    </>
  );
};

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Menu,
  Item,
});
