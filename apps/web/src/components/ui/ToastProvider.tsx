import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--surface, #ffffff)',
          color: 'var(--text-primary, #0F172A)',
          borderRadius: 'var(--radius-md, 10px)',
          padding: 'var(--space-md, 16px) var(--space-lg, 24px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-color, #e5e7eb)',
        },
        success: {
          icon: '✅',
          style: {
            borderLeft: '4px solid #22c55e',
          },
        },
        error: {
          icon: '❌',
          style: {
            borderLeft: '4px solid #ef4444',
          },
        },
        loading: {
          icon: '⏳',
          style: {
            borderLeft: '4px solid #3b82f6',
          },
        },
      }}
    />
  )
}