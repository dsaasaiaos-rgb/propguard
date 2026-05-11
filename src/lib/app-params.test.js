import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// toSnakeCase and getAppParamValue are tested before the module-level appParams
// side-effect runs, so we import them directly.
import { toSnakeCase, getAppParamValue } from './app-params'

describe('toSnakeCase', () => {
  it('converts a camelCase word', () => {
    expect(toSnakeCase('appId')).toBe('app_id')
  })

  it('converts a multi-hump camelCase word', () => {
    expect(toSnakeCase('accessToken')).toBe('access_token')
  })

  it('leaves an already-lowercase string unchanged', () => {
    expect(toSnakeCase('token')).toBe('token')
  })

  it('handles a leading uppercase letter', () => {
    expect(toSnakeCase('MyParam')).toBe('_my_param')
  })
})

describe('getAppParamValue', () => {
  const STORAGE_KEY = 'base44_app_id'

  beforeEach(() => {
    localStorage.clear()
    // Reset the URL to a clean state
    window.history.replaceState({}, '', '/')
    vi.spyOn(window.history, 'replaceState')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a value present in the URL search params', () => {
    window.history.replaceState({}, '', '/?app_id=abc123')
    expect(getAppParamValue('app_id')).toBe('abc123')
  })

  it('persists a URL param value to localStorage', () => {
    window.history.replaceState({}, '', '/?app_id=abc123')
    getAppParamValue('app_id')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('abc123')
  })

  it('falls back to localStorage when no URL param is present', () => {
    localStorage.setItem(STORAGE_KEY, 'stored_value')
    expect(getAppParamValue('app_id')).toBe('stored_value')
  })

  it('returns the defaultValue when nothing is in the URL or storage', () => {
    expect(getAppParamValue('app_id', { defaultValue: 'default_app' })).toBe('default_app')
  })

  it('returns null when no value and no default exist', () => {
    expect(getAppParamValue('app_id')).toBeNull()
  })

  it('removes the param from the URL when removeFromUrl is true', () => {
    window.history.replaceState({}, '', '/?app_id=abc123&other=x')
    getAppParamValue('app_id', { removeFromUrl: true })
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      document.title,
      '/?other=x'
    )
  })
})
