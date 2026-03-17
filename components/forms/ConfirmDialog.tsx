'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-lg shadow-xl w-full max-w-md"
            >
              {/* Header */}
              <div className="px-6 py-4 flex items-start gap-4">
                {isDangerous && (
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-6 h-6 text-red-critical" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border disabled:opacity-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white disabled:opacity-50 transition-colors ${
                    isDangerous
                      ? 'bg-red-critical hover:bg-red-700'
                      : 'bg-primary hover:bg-teal-primary'
                  }`}
                >
                  {isLoading ? 'Processing...' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
