import { useEffect, useState, useCallback } from "react";

const API_BASE = "https://dummyjson.com";

export default function useTodos(initialLimit = 10) {
  const [fetchedTodos, setFetchedTodos] = useState([]);
  const [todos, setTodos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(initialLimit);
  const [totalTodos, setTotalTodos] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const skip = (page = currentPage, limit = limitPerPage) => (page - 1) * limit;

  const fetchPage = useCallback(async (page = currentPage, limit = limitPerPage) => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    try {
      const s = skip(page, limit);
      const res = await fetch(`${API_BASE}/todos?limit=${limit}&skip=${s}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      const normalized = (data.todos || []).map((t) => ({
        id: t.id,
        text: t.todo ?? t.text ?? `Task ${t.id}`,
        completed: !!t.completed,
      }));
      if (!cancelled) {
        setFetchedTodos(normalized);
        setTotalTodos(typeof data.total === "number" ? data.total : normalized.length);
      }
    } catch (err) {
      if (!cancelled) setError(err.message || String(err));
    } finally {
      if (!cancelled) setIsLoading(false);
    }
    return () => (cancelled = true);
  }, [currentPage, limitPerPage]);

  useEffect(() => {
    fetchPage(currentPage, limitPerPage);
  }, [currentPage, limitPerPage, fetchPage]);

  useEffect(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) {
      setTodos(fetchedTodos);
    } else {
      setTodos(
        fetchedTodos.filter((t) => (t.text || "").toLowerCase().includes(term))
      );
    }
  }, [fetchedTodos, searchTerm]);

  const goToNextPage = () => {
    const maxPage = Math.max(1, Math.ceil(totalTodos / limitPerPage));
    setCurrentPage((p) => Math.min(maxPage, p + 1));
  };
  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const setLimit = (limit) => {
    setLimitPerPage(limit);
    setCurrentPage(1);
  };

  const addTodo = useCallback(async (text) => {
    if (!text || !text.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload = { todo: text.trim(), completed: false, userId: 1 };
      const res = await fetch(`${API_BASE}/todos/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Add failed: ${res.status}`);
      const data = await res.json();
      const newItem = {
        id: data.id,
        text: data.todo ?? text.trim(),
        completed: !!data.completed,
      };
      setFetchedTodos((prev) => [newItem, ...prev]);
      setTodos((prev) => [newItem, ...prev]);
      setTotalTodos((prev) => prev + 1);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setFetchedTodos((prev) => prev.filter((t) => t.id !== id));
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setTotalTodos((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTodo = useCallback(async (id, newCompleted) => {
    setError(null);
    const prevFetched = fetchedTodos;
    setFetchedTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)));
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)));

    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      const updated = {
        id: data.id ?? id,
        text: data.todo ?? data.text ?? (fetchedTodos.find(x => x.id === id)?.text ?? ""),
        completed: typeof data.completed === "boolean" ? data.completed : newCompleted,
      };
      setFetchedTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      return updated;
    } catch (err) {
      setFetchedTodos(prevFetched);
      setTodos(prevFetched);
      setError(err.message || String(err));
      throw err;
    }
  }, [fetchedTodos]);

  const editTodoTitle = useCallback(async (id, newTitle) => {
    if (!newTitle || !newTitle.trim()) throw new Error("Title is empty");
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: newTitle.trim() }),
      });
      if (!res.ok) throw new Error(`Edit failed: ${res.status}`);
      const data = await res.json();
      const updated = {
        id: data.id ?? id,
        text: data.todo ?? newTitle.trim(),
        completed: !!data.completed,
      };
      setFetchedTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      return updated;
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => fetchPage(currentPage, limitPerPage), [currentPage, limitPerPage, fetchPage]);

  return {
    todos,
    isLoading,
    error,

    currentPage,
    limitPerPage,
    totalTodos,

    goToNextPage,
    goToPrevPage,
    setLimit,

    searchTerm,
    setSearchTerm,

    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    refetch,
  };
}