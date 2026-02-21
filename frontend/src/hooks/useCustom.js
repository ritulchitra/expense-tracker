import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification, removeNotification } from '@/store/slices/uiSlice'

/**
 * Custom hook for managing notifications
 */
export const useNotification = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.ui.notifications)

  const showNotification = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = dispatch(
        addNotification({
          message,
          type,
        })
      )

      if (duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(id.payload.id))
        }, duration)
      }

      return id.payload.id
    },
    [dispatch]
  )

  const dismissNotification = useCallback(
    (id) => {
      dispatch(removeNotification(id))
    },
    [dispatch]
  )

  return {
    notifications,
    showNotification,
    dismissNotification,
  }
}

/**
 * Custom hook for managing local storage
 */
export const useLocalStorage = (key, initialValue) => {
  // Get stored value or return initial value
  const getStoredValue = (key) => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = React.useState(() =>
    getStoredValue(key)
  )

  // Update localStorage when state changes
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

/**
 * Custom hook for API calls with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)

  const execute = useCallback(async (...args) => {
    setStatus('pending')
    setData(null)
    setError(null)
    try {
      const response = await asyncFunction(...args)
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    status,
    data,
    error,
    execute,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  }
}

/**
 * Custom hook for form handling
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState({})
  const [touched, setTouched] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }, [touched])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}
