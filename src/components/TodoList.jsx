import React from "react";
import useTodos from "../hooks/useTodos";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import "./TodoList.css";

export default function TodoList() {
  const { todos, isLoading, error, addTodo, deleteTodo, toggleTodo } = useTodos();

  return (
    <div className="todo-container">
      <h2 className="title">My To-Do List</h2>

      {/* Форма додавання задач */}
      <AddTodoForm onAdd={addTodo} />

      {/* Стан завантаження та помилки */}
      {isLoading && <div className="muted">Loading...</div>}
      {error && <div className="error">Error: {String(error)}</div>}

      {/* Список задач */}
      <ul className="todo-list">
        {todos.length === 0 && !isLoading ? (
          <li className="muted">No tasks yet — add one!</li>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggleLocal={toggleTodo}
            />
          ))
        )}
      </ul>
    </div>
  );
}
