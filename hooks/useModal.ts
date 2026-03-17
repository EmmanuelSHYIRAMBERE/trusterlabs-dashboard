import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export function useModal() {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const openModal = useCallback((modalId: string, data?: any) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: { isOpen: true, data },
    }));
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: { isOpen: false, data: undefined },
    }));
  }, []);

  const isOpen = useCallback((modalId: string) => {
    return modals[modalId]?.isOpen ?? false;
  }, [modals]);

  const getModalData = useCallback((modalId: string) => {
    return modals[modalId]?.data;
  }, [modals]);

  return {
    openModal,
    closeModal,
    isOpen,
    getModalData,
  };
}
