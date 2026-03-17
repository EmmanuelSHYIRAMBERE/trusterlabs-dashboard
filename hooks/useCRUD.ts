import { useState, useCallback } from 'react';

export interface CRUDState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export function useCRUD<T extends { id: string | number }>(initialData: T[]) {
  const [state, setState] = useState<CRUDState<T>>({
    items: initialData,
    loading: false,
    error: null,
  });

  const create = useCallback((newItem: T) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      error: null,
    }));
  }, []);

  const update = useCallback((id: string | number, updatedItem: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
      error: null,
    }));
  }, []);

  const remove = useCallback((id: string | number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
      error: null,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading,
    }));
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    create,
    update,
    remove,
    setError,
    setLoading,
  };
}
