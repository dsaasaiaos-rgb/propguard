import { describe, it, expect, vi, beforeAll } from 'vitest'

// Prevent the module-level `window.self !== window.top` side-effect from
// crashing the import when window is fully defined in jsdom.
beforeAll(() => {
  Object.defineProperty(window, 'self', { value: window, writable: true })
  Object.defineProperty(window, 'top', { value: window, writable: true })
})

import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('resolves conflicting Tailwind classes (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('ignores falsy values', () => {
    expect(cn('px-4', false, null, undefined, 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional objects', () => {
    expect(cn('base', { 'font-bold': true, italic: false })).toBe('base font-bold')
  })

  it('returns an empty string when given no arguments', () => {
    expect(cn()).toBe('')
  })
})
