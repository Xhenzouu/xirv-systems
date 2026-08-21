import toast from 'react-hot-toast'

export const useToast = () => {
  const success = (message: string, options?: { id?: string }) => {
    if (options?.id) {
      toast.success(message, { id: options.id })
    } else {
      toast.success(message)
    }
  }

  const error = (message: string, options?: { id?: string }) => {
    if (options?.id) {
      toast.error(message, { id: options.id })
    } else {
      toast.error(message)
    }
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