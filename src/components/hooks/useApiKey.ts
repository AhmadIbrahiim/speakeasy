/**
 * useApiKey
 *
 * Owns the visitor's Cartesia API key lifecycle: read from sessionStorage on
 * mount, expose a synchronous `ensureApiKey` guard the UI can call before
 * making a paid request, persist on save, and (on auth failure) clear the
 * stored key and re-open the dialog with an error message.
 *
 * The key never leaves this hook plus the request body of the generate
 * mutation — it is not logged, not persisted across tabs, and not synced to
 * localStorage.
 */
import { useState } from "react"

export interface UseApiKeyResult {
  cartesiaApiKey: string
  apiKeyError: string
  showApiKeyDialog: boolean
  setShowApiKeyDialog: (open: boolean) => void
  /** Returns true if a key is present; otherwise opens the dialog and returns false. */
  ensureApiKey: () => boolean
  /** Persists a new key to sessionStorage and clears any prior error. */
  saveApiKey: (key: string) => void
  /** Clears the stored key, sets an error, and re-opens the dialog. */
  invalidateKey: (errorMessage: string) => void
}

const STORAGE_KEY = "cartesia_api_key"

const readStoredApiKey = (): string => {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem(STORAGE_KEY) || ""
}

export function useApiKey(): UseApiKeyResult {
  const [cartesiaApiKey, setCartesiaApiKey] = useState<string>(readStoredApiKey)
  const [apiKeyError, setApiKeyError] = useState<string>("")
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false)

  const ensureApiKey = (): boolean => {
    if (!cartesiaApiKey) {
      setShowApiKeyDialog(true)
      return false
    }
    return true
  }

  const saveApiKey = (key: string): void => {
    sessionStorage.setItem(STORAGE_KEY, key)
    setCartesiaApiKey(key)
    setShowApiKeyDialog(false)
    setApiKeyError("")
  }

  const invalidateKey = (errorMessage: string): void => {
    sessionStorage.removeItem(STORAGE_KEY)
    setCartesiaApiKey("")
    setApiKeyError(errorMessage)
    setShowApiKeyDialog(true)
  }

  return {
    cartesiaApiKey,
    apiKeyError,
    showApiKeyDialog,
    setShowApiKeyDialog,
    ensureApiKey,
    saveApiKey,
    invalidateKey,
  }
}
