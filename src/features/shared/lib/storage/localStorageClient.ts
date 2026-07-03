function isBrowser() {
  return typeof window !== "undefined"
}

export function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null

  const raw = window.localStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key: string): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(key)
}
