import toast from 'react-hot-toast'

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message)
  }

  const error = (message: string) => {
    toast.error(message)
  }

  const info = (message: string) => {
    toast(message)
  }

  const loading = (message: string) => {
    return toast.loading(message)
  }

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId)
  }

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  }

  return {
    success,
    error,
    info,
    loading,
    dismiss,
    promise,
  }
}