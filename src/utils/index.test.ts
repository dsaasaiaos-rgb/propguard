import { describe, it, expect } from 'vitest'
import { createPageUrl } from './index'

describe('createPageUrl', () => {
  it('converts spaces to dashes', () => {
    expect(createPageUrl('My Page')).toBe('/My-Page')
  })

  it('leaves a name with no spaces unchanged', () => {
    expect(createPageUrl('Dashboard')).toBe('/Dashboard')
  })

  it('converts multiple spaces to multiple dashes', () => {
    expect(createPageUrl('A B C')).toBe('/A-B-C')
  })

  it('returns a bare slash for an empty string', () => {
    expect(createPageUrl('')).toBe('/')
  })

  it('preserves casing', () => {
    expect(createPageUrl('MainApp')).toBe('/MainApp')
  })
})
