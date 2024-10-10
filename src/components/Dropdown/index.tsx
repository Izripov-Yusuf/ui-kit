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
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  beforeEnterCb: () => any;
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
  const beforeEnterCb = useEvent(() => {
    if (!isOpen) {
      return;
    }

    const anchor = triggerRef.current;
    const menu = menuRef.current;
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

    setPosition(newPosition);
  });

  const value = useMemo(
    () => ({
      isOpen,
      position,
      setToggle,
      triggerRef,
      menuRef,
      beforeEnterCb,
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
  const { isOpen, position, menuRef, beforeEnterCb } = useDropdownContext();

  return createPortal(
    <Transition show={isOpen} beforeEnter={beforeEnterCb}>
      <div
        className={styles.menu}
        style={{ top: position.top, left: position.left }}
        ref={menuRef}
      >
        {children}
      </div>
    </Transition>,
    modalRoot
  );
};

const Item = ({ children }: RenderlessComponentProps) => {
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
