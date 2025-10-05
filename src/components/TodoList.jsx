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

      <AddTodoForm onAdd={addTodo} />

      {isLoading && <div className="muted">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

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
