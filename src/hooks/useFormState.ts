import { useCallback, useState } from 'react'

type Updater<T> = T | ((prev: T) => T)

export function useFormState<T extends Record<string, any>>(initial: T) {
  const [form, setForm] = useState<T>(initial)

  const setField = useCallback(
    <K extends keyof T>(key: K, value: Updater<T[K]>) => {
      setForm((prev) => ({
        ...prev,
        [key]: typeof value === 'function' ? (value as any)(prev[key]) : value,
      }))
    },
    []
  )

  const reset = useCallback(() => setForm(initial), [initial])

  return { form, setForm, setField, reset }
}
