import React, { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface ToastContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    })
  }

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '500',
      },
      icon: '⚠️',
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
      },
      icon: 'ℹ️',
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      />
    </ToastContext.Provider>
  )
} 