import { useState } from "react";
import "./AddTodoForm.css";

export default function AddTodoForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-todo-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new task..."
      />
      <button className="add-todo-btn" type="submit">
        ➕ Add
      </button>
    </form>
  );
}
