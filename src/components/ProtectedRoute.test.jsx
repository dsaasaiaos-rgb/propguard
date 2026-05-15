import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// NOTE: AuthContext currently does not expose `authChecked` from AuthProvider,
// so ProtectedRoute always falls through to the fallback spinner in production.
// These tests exercise every branch by supplying `authChecked` explicitly via
// the mocked hook, mirroring the intended interface.

vi.mock('@/lib/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/components/UserNotRegisteredError', () => ({
  default: () => <div>user-not-registered</div>,
}))

import { useAuth } from '@/lib/AuthContext'

function makeAuth(overrides = {}) {
  return {
    isAuthenticated: false,
    isLoadingAuth: false,
    authChecked: true,
    authError: null,
    checkUserAuth: vi.fn(),
    ...overrides,
  }
}

function renderRoute(authOverrides = {}, { unauthEl = <div>login</div> } = {}) {
  useAuth.mockReturnValue(makeAuth(authOverrides))
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<ProtectedRoute unauthenticatedElement={unauthEl} />}>
          <Route path="/protected" element={<div>protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProtectedRoute', () => {
  it('renders the fallback spinner while auth is loading', () => {
    renderRoute({ isLoadingAuth: true, authChecked: false })
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
    expect(screen.queryByText('login')).not.toBeInTheDocument()
  })

  it('renders the fallback when authChecked is false and loading is done', () => {
    renderRoute({ authChecked: false, isLoadingAuth: false })
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('calls checkUserAuth when not yet checked and not loading', () => {
    const checkUserAuth = vi.fn()
    renderRoute({ authChecked: false, isLoadingAuth: false, checkUserAuth })
    expect(checkUserAuth).toHaveBeenCalledOnce()
  })

  it('does not call checkUserAuth when still loading', () => {
    const checkUserAuth = vi.fn()
    renderRoute({ authChecked: false, isLoadingAuth: true, checkUserAuth })
    expect(checkUserAuth).not.toHaveBeenCalled()
  })

  it('renders the unauthenticated element when not authenticated', () => {
    renderRoute({ isAuthenticated: false })
    expect(screen.getByText('login')).toBeInTheDocument()
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('renders protected content when authenticated', () => {
    renderRoute({ isAuthenticated: true })
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('renders UserNotRegisteredError for user_not_registered auth error', () => {
    renderRoute({ authError: { type: 'user_not_registered' } })
    expect(screen.getByText('user-not-registered')).toBeInTheDocument()
    expect(screen.queryByText('login')).not.toBeInTheDocument()
  })

  it('renders the unauthenticated element for other auth errors', () => {
    renderRoute({ authError: { type: 'auth_required' } })
    expect(screen.getByText('login')).toBeInTheDocument()
  })
})
