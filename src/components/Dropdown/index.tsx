import { Transition } from '@headlessui/react';
import {
  memo,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

import styles from './Dropdown.module.css';

type DropdownProps = {} & PropsWithChildren;

type DropdownContextType = {
  isOpen: boolean;
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

const DropdownRoot = memo(({ children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setToggle = useCallback(() => setIsOpen((prevState) => !prevState), []);

  const value = useMemo(
    () => ({
      isOpen,
      setToggle,
    }),
    [isOpen, setToggle]
  );
  return (
    <DropdownContext.Provider value={value}>
      <div className={styles.root}>{children}</div>
    </DropdownContext.Provider>
  );
});

const Trigger = memo(({ children }: PropsWithChildren) => {
  const { setToggle } = useDropdownContext();
  return (
    <div className={styles.trigger} onClick={setToggle}>
      {children}
    </div>
  );
});

const Menu = memo(({ children }: PropsWithChildren) => {
  const { isOpen } = useDropdownContext();
  return (
    <Transition show={isOpen}>
      <div className={styles.menu}>{children}</div>
    </Transition>
  );
});

const Item = memo(({ children }: PropsWithChildren) => {
  return <div className={styles.item}>{children}</div>;
});

// TODO: Как лучше и почему так лучше? Вот так
export const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Menu,
  Item,
});

// TODO: Или вот так? Но тут без memo на Dropdown, т.к. если обернуть Dropdown в memo, то получаем TS ошибки
// const Dropdown = ({ children }: DropdownProps) => {
//   return <div className="dropdown">{children}</div>;
// };

// const Trigger = memo(({ children }: PropsWithChildren) => {
//   return <div className="dropdown-trigger">{children}</div>;
// });

// const Menu = memo(({ children }: PropsWithChildren) => {
//   return <div className="dropdown-menu">{children}</div>;
// });

// const Item = memo(({ children }: PropsWithChildren) => {
//   return <div className="dropdown-item">{children}</div>;
// });

// Dropdown.Trigger = Trigger;
// Dropdown.Menu = Menu;
// Dropdown.Item = Item;

// export default Dropdown;
