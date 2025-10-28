import React, { useState } from "react";
import useTodos from "../hooks/useTodos";
import TodoItem from "./TodoItem";
import "./TodoList.css";

export default function TodoList() {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    currentPage,
    limitPerPage,
    totalTodos,
    goToNextPage,
    goToPrevPage,
    setLimit,
    searchTerm,
    setSearchTerm,
  } = useTodos();

  const [newTask, setNewTask] = useState("");

  const handleAdd = async () => {
    const t = newTask.trim();
    if (!t) return;
    try {
      await addTodo(t);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  return (
    <div
      className="todo-container"
      style={{
        maxWidth: 760,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2 className="title">My To-Do List (extended)</h2>

      {/* Add Task */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          style={{ flex: 1 }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search current page..."
          style={{ width: "100%" }}
        />
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div>
          <button onClick={goToPrevPage} disabled={currentPage <= 1}>
            Previous
          </button>
          <button
            onClick={goToNextPage}
            style={{ marginLeft: 8 }}
            disabled={currentPage * limitPerPage >= totalTodos}
          >
            Next
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div>
            Page {currentPage} • total items: {totalTodos}
          </div>
          <select
            value={limitPerPage}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      {/* Loading/Error */}
      {isLoading && <div className="muted">Loading...</div>}
      {error && <div className="error" style={{ color: "red" }}>Error: {error}</div>}

      {/* Todo List */}
      <ul className="todo-list" style={{ listStyle: "none", padding: 0 }}>
        {!isLoading && todos.length === 0 ? (
          <li className="muted">No tasks on this page.</li>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggleLocal={toggleTodo}
              onEdit={editTodoTitle}
            />
          ))
        )}
      </ul>
    </div>
  );
}