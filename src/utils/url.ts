import { useCallback, useEffect, useState } from 'react'

export function useSearchQuery<T>(
  key: string,
  defaultValue?: T,
  alwaysInclude?: boolean,
): [T | undefined, (value: T | ((prev: T) => T)) => void] {
  const getValue = (): T | undefined => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(key)

    if (value === null) {
      return defaultValue
    }

    try {
      return JSON.parse(value) as T
    } catch {
      return defaultValue
    }
  }

  const [value, setValue] = useState<T | undefined>(getValue)

  // One-time initialize: ensure default value is in URL when alwaysInclude is true
  useEffect(() => {
    if (alwaysInclude && defaultValue !== undefined) {
      const params = new URLSearchParams(window.location.search)
      if (!params.has(key)) {
        params.set(key, JSON.stringify(defaultValue))
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [alwaysInclude, key, defaultValue])

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof newValue === 'function'
          ? (newValue as (prev: T | undefined) => T)(value)
          : newValue

      setValue(resolvedValue)

      const params = new URLSearchParams(window.location.search)
      params.set(key, JSON.stringify(resolvedValue))

      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState(null, '', newUrl)
    },
    [key, value],
  )

  useEffect(() => {
    const handlePopState = () => {
      setValue(getValue())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps This behavior is needed for managing 'back' and 'forward' for mouse with extra buttons
  }, [])

  return [value, updateValue]
}

export function encodeGameConfig(config: Record<string, unknown>): string {
  return btoa(JSON.stringify(config))
}

export function decodeGameConfig<T>(encoded: string): T | null {
  try {
    return JSON.parse(atob(encoded)) as T
  } catch {
    return null
  }
}

export function parseSearchParams(
  search: URLSearchParams,
): Record<string, string> {
  const result: Record<string, string> = {}
  search.forEach((value, key) => {
    result[key] = value
  })
  return result
}
