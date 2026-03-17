import { useState, useCallback, useEffect, useRef } from 'react';

export interface CRUDState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export function useCRUD<T extends { id: string | number }>(
  apiPath: string,
  options?: { params?: Record<string, string> }
) {
  // Serialize params once to a stable string — avoids new object ref on every render
  const paramString = options?.params ? new URLSearchParams(options.params).toString() : '';

  const [state, setState] = useState<CRUDState<T>>({
    items: [],
    loading: true,
    error: null,
  });

  // Prevent re-fetch after a terminal error (e.g. 401) from causing an infinite loop
  const hasFetched = useRef(false);

  const buildUrl = (base: string, qs?: string) => (qs ? `${base}?${qs}` : base);

  const fetchAll = useCallback(async (overrideParams?: Record<string, string>) => {
    const qs = overrideParams ? new URLSearchParams(overrideParams).toString() : paramString;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(buildUrl(apiPath, qs));
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.message ?? `Request failed: ${res.status}`;
        // Set error but do NOT keep loading — stops the render→effect→fetch cycle
        setState((prev) => ({ ...prev, loading: false, error: msg }));
        return;
      }
      const json = await res.json();
      setState({ items: json.data ?? [], loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath, paramString]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchAll();
  }, [fetchAll]);

  const apiCreate = useCallback(async (body: Omit<T, 'id'>): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Create failed');
      }
      const json = await res.json();
      const item: T = json.data;
      setState((prev) => ({ ...prev, items: [...prev.items, item], loading: false }));
      return item;
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Unknown error' }));
      return null;
    }
  }, [apiPath]);

  const apiUpdate = useCallback(async (id: string | number, body: Partial<T>): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${apiPath}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Update failed');
      }
      const json = await res.json();
      const updated: T = json.data;
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === id ? updated : item)),
        loading: false,
      }));
      return updated;
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Unknown error' }));
      return null;
    }
  }, [apiPath]);

  const apiDelete = useCallback(async (id: string | number): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? 'Delete failed');
      }
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Unknown error' }));
      return false;
    }
  }, [apiPath]);

  // Local-state helpers (optimistic / offline use)
  const create = useCallback((newItem: T) => {
    setState((prev) => ({ ...prev, items: [...prev.items, newItem], error: null }));
  }, []);

  const update = useCallback((id: string | number, updatedItem: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
      error: null,
    }));
  }, []);

  const remove = useCallback((id: string | number) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id), error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    fetchAll,
    apiCreate,
    apiUpdate,
    apiDelete,
    create,
    update,
    remove,
    setError,
    setLoading,
  };
}
