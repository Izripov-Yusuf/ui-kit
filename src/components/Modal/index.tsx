// - Вложенные модалки не обрабатываются корректно. нужно написать какую-то логику вне реакт, которая будет обрабатывать закрытие модалок по очереди.
// - Заметка от меня: при активной модалке, если кликнуть на кнопку, модалка моргает

import { useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from '@headlessui/react';

import styles from './Modal.module.css';
import { useEvent } from '../../hooks/useEvent';
import { modalRoot } from '../../constants';

type ModalProps = {
  show: boolean;
  onCloseClick: () => void;
  title?: string;
} & React.PropsWithChildren;

export const Modal = memo(function Modal({
  show,
  title,
  children,
  onCloseClick,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const onCloseClickCb = useEvent(onCloseClick);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseClickCb();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseClickCb();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseClickCb]);

  return createPortal(
    <>
      <Transition show={show}>
        <div className={styles.overlay} onClick={onCloseClick} />
      </Transition>
      <Transition show={show}>
        <div className={styles.container} ref={modalRef}>
          <div className={styles.content}>
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
    </>,
    modalRoot
  );
});
