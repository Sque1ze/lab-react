import { useEffect, useState, useCallback } from "react";

const API_BASE = "https://dummyjson.com";

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- GET (initial fetch)
  useEffect(() => {
    let cancelled = false;
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/todos?limit=10`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const normalized = (data.todos || []).map((t) => ({
          id: t.id,
          text: t.todo ?? t.text ?? `Task ${t.id}`,
          completed: !!t.completed,
        }));
        setTodos(normalized);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchTodos();
    return () => (cancelled = true);
  }, []);

  // --- POST (add)
  const addTodo = useCallback(async (text) => {
    const newTodo = { todo: text, completed: false, userId: 1 };
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) throw new Error(`Add failed: ${res.status}`);
      const data = await res.json();
      setTodos((prev) => [...prev, { id: data.id, text: data.todo, completed: data.completed }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- DELETE
  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- PUT (toggle)
  const toggleTodo = useCallback(async (id, newCompleted) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: data.completed } : t))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { todos, isLoading, error, addTodo, deleteTodo, toggleTodo };
}
