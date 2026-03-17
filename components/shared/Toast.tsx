'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-success" />,
    error: <AlertCircle size={20} className="text-red-critical" />,
    warning: <AlertTriangle size={20} className="text-orange-accent" />,
    info: <Info size={20} className="text-primary" />,
  };

  const backgrounds = {
    success: 'bg-green-success/10 border-green-success/30',
    error: 'bg-red-critical/10 border-red-critical/30',
    warning: 'bg-orange-accent/10 border-orange-accent/30',
    info: 'bg-primary/10 border-primary/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg border ${backgrounds[type]} flex items-center gap-3 z-50`}
    >
      {icons[type]}
      <p className="text-sm text-foreground flex-1">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="p-0.5 hover:bg-muted rounded transition-colors"
      >
        <X size={16} className="text-muted-foreground" />
      </button>
    </motion.div>
  );
}
