import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'info' | 'success' | 'error' | 'warning'

export interface Toast {
  id: string
  message: string
  type?: ToastType
  duration?: number
}

interface ToastContextValue {
  showToast: (message: string, options?: { type?: ToastType; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, options?: { type?: ToastType; duration?: number }) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = {
      id,
      message,
      type: options?.type || 'info',
      duration: options?.duration ?? 3500,
    }
    setToasts((prev) => [...prev, toast])

    // Auto dismiss
    window.setTimeout(() => removeToast(id), toast.duration)
  }, [removeToast])

  const value = useMemo(() => ({ showToast }), [showToast])

  const typeStyles: Record<ToastType, string> = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`text-white shadow-lg rounded-lg px-4 py-3 min-w-[260px] ${typeStyles[t.type || 'info']}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 text-sm">{t.message}</div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-white/80 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
