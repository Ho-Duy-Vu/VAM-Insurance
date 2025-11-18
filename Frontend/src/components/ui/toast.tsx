import React, { createContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9998] space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration - 300);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg
        ${getColors()}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
