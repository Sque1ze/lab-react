import { useEffect, useState, useCallback } from "react";

const API_BASE = "https://dummyjson.com";

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/todos?limit=20`);
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
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchTodos();
    return () => {
      cancelled = true;
    };
  }, []);

  const addTodo = useCallback((text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTodo = useCallback(async (id, newCompleted) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) {
        throw new Error(`Update failed: ${res.status}`);
      }
      const data = await res.json();
      const updated = {
        id: data.id,
        text: data.todo ?? data.text ?? `Task ${data.id}`,
        completed: typeof data.completed === "boolean" ? data.completed : !!newCompleted,
      };
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
}
