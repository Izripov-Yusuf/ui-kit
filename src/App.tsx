import { useState } from 'react';
import { Button } from '@headlessui/react';

import styles from './App.module.css';
import { Modal } from './components/Modal';
import { Dropdown } from './components/Dropdown';

// ## Библиотека компонентов

// Комплексное задание, где нужно будет реализовать разные стандартные компоненты с нуля. По каждому компоненту дам описание ниже.

// Писать все компоненты нужно без использования сторонних библиотек. Исключение — анимации. Я советую не пробовать их реализовать
// самому, так как покрыть все кейсы с анимациями в связке с React — задача не из простых. Можно использовать что-то из следующих
// библиотек — Transition из headless/ui, react-transition-group.

// ### Модалка и Drawer

// С модалкой думаю все знакомы, Drawer — тоже самое, только при открытии/закрытии выпадает со стороны или сверху/снизу
// ([пример из MUI](https://mui.com/material-ui/react-drawer/#anchor))

// Требования:

// - Анимация открытия/закрытия
// - Закрытие по ESC (учесть кейс открытия модалки/дровера в модалке/дровере)
// - Закрытие по клику на оверлей
// - Кастомизация контента происходит самим пользователем

// ### Тултип и Поповер

// Требования:

// - Анимация открытия/закрытия
// - Возможность удобно подсоединиться к элементу, относительно которого будет происходить открытие компонента
// - Контент может передаваться как в виде строки, так и в виде других элементов
// - Поддержать различные позиции открытия

// ### Dropdown

// Требования:

// - Выпадающее окно, которое открывается по триггеру
// - Анимация открытия/закрытия
// - Придерживаться такого API для компонента

// <Dropdown>
//   <Dropdown.Trigger>
//     <button>Menu</button>
//   </Dropdown.Trigger>
//   <Dropdown.Menu>
//     <Dropdown.Item>Item 1</Dropdown.Item>
//     <Dropdown.Item>Item 2</Dropdown.Item>
//   </Dropdown.Menu>
// </Dropdown>

// ### Select

// Требования:

// - Продумать работу, как с асинхронными данными (с бека), так и локальными
// - Поиск по элементам
// - Кастомизация рендеринга опшена внутри селекта
// - Кастомизация рендеринга самой превьюхи (по дефолту как всегда элемент для выбора, а так человек сам там может верстку
// кастомную накрутить)

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  return (
    <main className={styles.main}>
      <section className={styles.component}>
        <Button className={styles.button} onClick={() => setShowModal(true)}>
          Show Modal
        </Button>

        <Modal
          show={showModal}
          title="Title"
          onCloseClick={() => setShowModal(false)}
        >
          <Button className={styles.button} onClick={() => setShowModal2(true)}>
            Show Modal 2
          </Button>
        </Modal>

        <Modal
          show={showModal2}
          title="Title 222"
          onCloseClick={() => setShowModal2(false)}
        >
          <Button className={styles.button} onClick={() => setShowModal3(true)}>
            Show Modal 3
          </Button>
        </Modal>

        <Modal
          show={showModal3}
          title="Title 333"
          onCloseClick={() => setShowModal3(false)}
        >
          <Button className={styles.button} onClick={() => setShowModal4(true)}>
            Show Modal 4
          </Button>
        </Modal>

        <Modal
          show={showModal4}
          title="Title 444"
          onCloseClick={() => setShowModal4(false)}
        >
          <Button className={styles.button} onClick={() => setShowModal5(true)}>
            Show Modal 5
          </Button>
        </Modal>

        <Modal
          show={showModal5}
          title="Title 555"
          onCloseClick={() => setShowModal5(false)}
        >
          Modal 5
        </Modal>
      </section>

      <section className={styles.component}>
        <Dropdown>
          <Dropdown.Trigger>
            {(props) => (
              <Button className={styles.button} {...props}>
                Menu
              </Button>
            )}
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>
              {(props) => (
                <div
                  className={styles.item}
                  onClick={(event) => {
                    console.log('event', event);
                    props.onClick?.(event);
                  }}
                >
                  Item 1
                </div>
              )}
            </Dropdown.Item>
            <Dropdown.Item>
              {(props) => <div {...props}>Item 2</div>}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </section>
    </main>
  );
}

export default App;
