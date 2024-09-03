import { useState } from 'react';
import { Button } from '@headlessui/react';

import styles from './App.module.css';
import Modal from './components/Modal';

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
  return (
    <main className={styles.main}>
      <section className={styles.component}>
        <Button
          className={styles.button}
          onClick={() => setShowModal((prev) => !prev)}
        >
          Show Modal
        </Button>
        <Modal
          show={showModal}
          title="Title"
          onCloseClick={() => setShowModal(false)}
        >
          Modal 1
        </Modal>
      </section>
    </main>
  );
}

export default App;
