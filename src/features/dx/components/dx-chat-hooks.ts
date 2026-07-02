import * as React from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = React.useCallback((): T => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const getServerSnapshot = React.useCallback(
    (): T => initialValue,
    [initialValue]
  )

  const store = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback)
      return () => window.removeEventListener("storage", callback)
    },
    getSnapshot,
    getServerSnapshot
  )

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(getSnapshot()) : value
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        window.dispatchEvent(new Event("storage"))
      } catch (error) {
        console.error(error)
      }
    },
    [key, getSnapshot]
  )

  return [store, setValue]
}
