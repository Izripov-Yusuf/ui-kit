import { useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';

import styles from './Modal.module.css';

type ModalProps = {
  show: boolean;
  onCloseClick: () => void;
  title?: string;
} & React.PropsWithChildren;

export default function Modal({
  show,
  title,
  children,
  onCloseClick,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // TODO: кастование типов, норм ли здесь
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseClick();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Transition show={show}>
      <div
        className={styles.modalOverlay}
        onClick={onCloseClick}
        ref={modalRef}
      >
        <div className={styles.modal}>
          <div className={styles.header}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.close} onClick={onCloseClick}>
              X
            </div>
          </div>
          {children}
        </div>
      </div>
    </Transition>
  );
}
