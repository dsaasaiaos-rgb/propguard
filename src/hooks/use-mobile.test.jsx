import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

const BREAKPOINT = 768

function mockMatchMedia(matches) {
  const listeners = []
  const mql = {
    matches,
    addEventListener: vi.fn((event, cb) => listeners.push(cb)),
    removeEventListener: vi.fn((event, cb) => {
      const idx = listeners.indexOf(cb)
      if (idx !== -1) listeners.splice(idx, 1)
    }),
    // Expose so tests can fire resize events
    _fire: () => listeners.forEach(cb => cb()),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mql))
  return mql
}

beforeEach(() => {
  vi.stubGlobal('innerWidth', BREAKPOINT) // default: exactly at boundary = not mobile
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsMobile', () => {
  it('returns false when window.innerWidth is at the breakpoint', () => {
    vi.stubGlobal('innerWidth', BREAKPOINT)
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns false when window.innerWidth is above the breakpoint', () => {
    vi.stubGlobal('innerWidth', 1024)
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when window.innerWidth is below the breakpoint', () => {
    vi.stubGlobal('innerWidth', 375)
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('updates when a matchMedia change event fires with a narrower window', () => {
    vi.stubGlobal('innerWidth', 1024)
    const mql = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      vi.stubGlobal('innerWidth', 375)
      mql._fire()
    })

    expect(result.current).toBe(true)
  })

  it('removes the matchMedia listener on unmount', () => {
    vi.stubGlobal('innerWidth', 1024)
    const mql = mockMatchMedia(false)
    const { unmount } = renderHook(() => useIsMobile())
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalledOnce()
  })
})
