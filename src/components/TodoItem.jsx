import { useState, useEffect } from "react";

export default function TodoItem({ todo, onDelete, onToggleLocal, onEditTitle }) {
  const [isCompleted, setIsCompleted] = useState(!!todo.completed);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsCompleted(!!todo.completed);
  }, [todo.completed]);

  useEffect(() => {
    setEditValue(todo.text || "");
  }, [todo.text]);

  const handleToggle = async () => {
    const next = !isCompleted;
    setIsCompleted(next);
    setLoading(true);
    try {
      await onToggleLocal(todo.id, next);
    } catch {
      setIsCompleted(!next);
      alert("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } catch {
      alert("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = () => {
    setEditValue(todo.text || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue(todo.text || "");
  };

  const saveEdit = async () => {
    const trimmed = (editValue || "").trim();
    if (!trimmed) return alert("Title cannot be empty");
    setSaving(true);
    try {
      await onEditTitle(todo.id, trimmed);
      setIsEditing(false);
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <li className={`todo-item ${isCompleted ? "completed" : ""}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid #eee" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <input type="checkbox" checked={isCompleted} onChange={handleToggle} disabled={loading || saving} />
        {!isEditing ? (
          <span style={{ textDecoration: isCompleted ? "line-through" : "none", color: isCompleted ? "#888" : "#222" }}>
            {todo.text}
          </span>
        ) : (
          <input value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={onKeyDown} style={{ flex: 1 }} disabled={saving} />
        )}
      </label>

      {!isEditing ? (
        <>
          <button onClick={startEdit} disabled={loading || saving}>Edit</button>
          <button onClick={handleDelete} disabled={loading || saving}>❌</button>
        </>
      ) : (
        <>
          <button onClick={saveEdit} disabled={saving}>Save</button>
          <button onClick={cancelEdit} disabled={saving}>Cancel</button>
        </>
      )}
    </li>
  );
}
