// - Клик на Escape работает нормально, почему-то не работает клики по крестику и оверлею

import { useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { Transition, TransitionChild } from '@headlessui/react';

import styles from './Modal.module.css';
import { useEvent } from '../../hooks/useEvent';
import { modalRoot } from '../../constants';

import modalController from './modalController';

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
    if (show) {
      modalController.registerModal(onCloseClickCb);
    }

    return () => {
      modalController.unregisterModal(onCloseClickCb);
    };
  }, [show, onCloseClickCb]);

  return createPortal(
    <Transition show={show}>
      <div className={styles.root}>
        <TransitionChild>
          <div
            className={styles.overlay}
            onClick={() => modalController.closeTopModal()}
          />
        </TransitionChild>
        <TransitionChild>
          <div className={styles.container} ref={modalRef}>
            <div className={styles.content}>
              <div className={styles.header}>
                {title && <div className={styles.title}>{title}</div>}
                <div
                  className={styles.close}
                  onClick={() => modalController.closeTopModal()}
                >
                  X
                </div>
              </div>
              {children}
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>,
    modalRoot
  );
});
