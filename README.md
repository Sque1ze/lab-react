# 📝 React Todo List — Лабораторна робота №4  
**Автор:** Власенко Андрій  
**Група:** КН-311  
**GitHub:** [https://github.com/Sque1ze/lab-react.git](https://github.com/Sque1ze/lab-react.git)  
**Vercel:** [https://lab-react-beta.vercel.app/](https://lab-react-beta.vercel.app/)  

---

## 🎯 Мета роботи
Розробити вебзастосунок **Todo List** з використанням **React** та **кастомного хука `useTodos`**, який реалізує логіку CRUD-операцій через фейковий REST API **DummyJSON**.

---

## ⚙️ Використані технології
- **React 19 + Vite**
- **JavaScript (ES6+)**
- **CSS3 (Flexbox, сучасне оформлення)**
- **DummyJSON REST API**

---

## 📦 Структура проєкту
📁 src/
┣ 📁 components/
┃ ┣ 📄 AddTodoForm.jsx
┃ ┣ 📄 TodoItem.jsx
┃ ┗ 📄 TodoList.jsx
┣ 📁 hooks/
┃ ┗ 📄 useTodos.js
┣ 📁 assets/
┃ ┗ 📄 A_diagram_created_digitally_showcases_the_componen.png
┣ 📄 App.jsx
┣ 📄 main.jsx
┗ 📄 index.css

## 🧠 Компонентна структура та потік даних

![Data Flow Diagram](./src/assets/діаграма.jpg)

### 🔍 Опис
App — це “корінь” програми, звідси все починається.

TodoList отримує дані через useTodos, і розподіляє їх між підкомпонентами.

AddTodoForm викликає onAdd() → додає нове завдання.

TodoItem викликає onToggle() або onDelete() → змінює або видаляє задачу.

useTodos — виконує запити до Fake REST API (DummyJSON).

Дані повертаються назад у TodoList, і React оновлює інтерфейс.

### 🔄 Потік даних
- ⬇️ **Пропси вниз:** від `TodoList` → до `TodoItem` та `AddTodoForm`  
- ⬆️ **Події вгору:** колбеки (onAdd, onToggle, onDelete) передаються назад у хук  
- 🔁 **useTodos** — центральна логіка управління станом і взаємодії з API  

---

## 🚀 Як запустити проєкт локально

```bash
# 1. Клонувати репозиторій
git clone https://github.com/Sque1ze/lab-react.git

# 2. Перейти в папку проєкту
cd lab-react

# 3. Встановити залежності
npm install

# 4. Запустити застосунок
npm run dev