import { useState } from "react";

export default function TodoItem({ todo, onDelete, onToggleLocal }) {
  const [isCompleted, setIsCompleted] = useState(!!todo.completed);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const next = !isCompleted;
    setIsCompleted(next); 
    setLoading(true);
    try {
      await onToggleLocal(todo.id, next);
    } catch (err) {
      console.error("Toggle error:", err); 
      setIsCompleted(!next); 
      alert("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await onDelete(todo.id);
    } catch (err) {
      console.error("Delete error:", err); 
      alert("Failed to delete task.");
    }
  };

  return (
    <li className={`todo-item ${isCompleted ? "completed" : ""}`}>
      <label className="todo-left">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          disabled={loading}
        />
        <span className="todo-text">{todo.text}</span>
      </label>

      <button className="delete-btn" onClick={handleDelete} disabled={loading}>
        ❌
      </button>
    </li>
  );
}