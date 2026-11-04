'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeConfig: Record<
  ToastType,
  { icon: React.ElementType; bg: string; text: string; border: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  info: {
    icon: Info,
    bg: 'bg-editorial-blue/5',
    text: 'text-editorial-blue',
    border: 'border-editorial-blue/20',
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { icon: Icon, bg, text, border } = typeConfig[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={cn(
        'flex items-start gap-3 w-80 max-w-full rounded-xl px-4 py-3.5 shadow-lg border',
        bg,
        border,
      )}
    >
      <Icon size={18} className={cn('shrink-0 mt-0.5', text)} />
      <p className={cn('flex-1 text-sm font-medium leading-snug', text)}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss"
        className={cn('shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity', text)}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const baseId = useId();
  let counter = 0;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = `${baseId}-${Date.now()}-${counter++}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [baseId, removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 items-end"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastProvider;
