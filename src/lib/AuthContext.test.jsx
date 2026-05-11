import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

// ── Hoisted mocks (must be defined before vi.mock factories run) ───────────

const { mockAxiosGet, mockMe, mockLogout, mockRedirectToLogin } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
  mockMe: vi.fn(),
  mockLogout: vi.fn(),
  mockRedirectToLogin: vi.fn(),
}))

vi.mock('@/lib/app-params', () => ({
  appParams: { appId: 'test-app', token: null, fromUrl: 'http://localhost/' },
}))

vi.mock('@base44/sdk/dist/utils/axios-client', () => ({
  createAxiosClient: vi.fn(() => ({ get: mockAxiosGet })),
}))

vi.mock('@/api/base44Client', () => ({
  base44: {
    auth: {
      me: mockMe,
      logout: mockLogout,
      redirectToLogin: mockRedirectToLogin,
    },
  },
}))

// ── Helpers ────────────────────────────────────────────────────────────────

function AuthConsumer() {
  const { user, isAuthenticated, isLoadingAuth, authError } = useAuth()
  if (isLoadingAuth) return <div>loading</div>
  if (authError) return <div>error:{authError.type}</div>
  return <div>{isAuthenticated ? `authed:${user?.email}` : 'unauthenticated'}</div>
}

function renderWithAuth(ui = <AuthConsumer />) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading state initially', () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {})) // never resolves
    renderWithAuth()
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('shows unauthenticated state when there is no token', async () => {
    mockAxiosGet.mockResolvedValueOnce({ id: 'test-app' })
    renderWithAuth()
    await waitFor(() => expect(screen.getByText('unauthenticated')).toBeInTheDocument())
    expect(mockMe).not.toHaveBeenCalled()
  })

  it('sets auth_required error on 403 with auth_required reason', async () => {
    mockAxiosGet.mockRejectedValueOnce({
      status: 403,
      data: { extra_data: { reason: 'auth_required' } },
      message: 'Forbidden',
    })
    renderWithAuth()
    await waitFor(() => expect(screen.getByText('error:auth_required')).toBeInTheDocument())
  })

  it('sets user_not_registered error on 403 with user_not_registered reason', async () => {
    mockAxiosGet.mockRejectedValueOnce({
      status: 403,
      data: { extra_data: { reason: 'user_not_registered' } },
      message: 'Forbidden',
    })
    renderWithAuth()
    await waitFor(() => expect(screen.getByText('error:user_not_registered')).toBeInTheDocument())
  })

  it('sets unknown error when the app check throws an unexpected error', async () => {
    mockAxiosGet.mockRejectedValueOnce({ message: 'Network error' })
    renderWithAuth()
    await waitFor(() => expect(screen.getByText('error:unknown')).toBeInTheDocument())
  })
})

describe('logout', () => {
  it('clears auth state and calls base44.auth.logout', async () => {
    mockAxiosGet.mockResolvedValueOnce({ id: 'test-app' })

    function LogoutButton() {
      const { logout, isAuthenticated } = useAuth()
      return (
        <>
          <span>{isAuthenticated ? 'authed' : 'unauthenticated'}</span>
          <button onClick={() => logout(false)}>logout</button>
        </>
      )
    }

    render(<AuthProvider><LogoutButton /></AuthProvider>)
    await waitFor(() => expect(screen.getByText('unauthenticated')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'logout' }))

    expect(mockLogout).toHaveBeenCalledWith()
    expect(screen.getByText('unauthenticated')).toBeInTheDocument()
  })
})

describe('useAuth outside AuthProvider', () => {
  it('throws a descriptive error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Bare() {
      useAuth()
      return null
    }
    expect(() => render(<Bare />)).toThrow('useAuth must be used within an AuthProvider')
    spy.mockRestore()
  })
})
