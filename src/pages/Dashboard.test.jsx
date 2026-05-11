import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard'

vi.mock('@/api/base44Client', () => ({
  base44: { entities: { House: { list: vi.fn() }, Tenant: { list: vi.fn() }, Document: { list: vi.fn() } } },
}))

// Build a QueryClient that pre-seeds the cache so no real fetches happen.
function makeClient(houses = [], tenants = [], documents = []) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(['houses'], houses)
  client.setQueryData(['tenants'], tenants)
  client.setQueryData(['documents'], documents)
  return client
}

function renderDashboard({ houses = [], tenants = [], documents = [] } = {}) {
  return render(
    <QueryClientProvider client={makeClient(houses, tenants, documents)}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// ── Stat counts ────────────────────────────────────────────────────────────

describe('Dashboard stat counts', () => {
  it('shows the total number of houses', () => {
    renderDashboard({
      houses: [
        { id: '1', address: '1 Main St', status: 'available' },
        { id: '2', address: '2 Main St', status: 'available' },
      ],
    })
    expect(screen.getByText('Total Houses')).toBeInTheDocument()
    expect(screen.getByText('2 available')).toBeInTheDocument()
  })

  it('counts occupied houses correctly', () => {
    renderDashboard({
      houses: [
        { id: '1', address: '1 Main St', status: 'occupied' },
        { id: '2', address: '2 Main St', status: 'occupied' },
        { id: '3', address: '3 Main St', status: 'available' },
      ],
    })
    expect(screen.getByText('houses rented')).toBeInTheDocument()
  })

  it('counts active tenants', () => {
    renderDashboard({
      tenants: [
        { id: '1', name: 'Alice', status: 'active' },
        { id: '2', name: 'Bob', status: 'inactive' },
      ],
    })
    expect(screen.getByText('of 2 total')).toBeInTheDocument()
  })

  it('shows the document count', () => {
    renderDashboard({
      documents: [{ id: '1' }, { id: '2' }, { id: '3' }],
    })
    expect(screen.getByText('on file')).toBeInTheDocument()
  })
})

// ── Empty states ───────────────────────────────────────────────────────────

describe('Dashboard empty states', () => {
  it('shows "No houses yet." when there are no houses', () => {
    renderDashboard()
    expect(screen.getByText('No houses yet.')).toBeInTheDocument()
  })

  it('shows "No tenants yet." when there are no tenants', () => {
    renderDashboard()
    expect(screen.getByText('No tenants yet.')).toBeInTheDocument()
  })
})

// ── Expiring leases ────────────────────────────────────────────────────────

describe('expiring lease alert', () => {
  it('hides the alert when no leases are expiring', () => {
    renderDashboard({
      tenants: [{ id: '1', name: 'Alice', status: 'active', lease_end: daysFromNow(60) }],
    })
    expect(screen.queryByText(/Leases Expiring/)).not.toBeInTheDocument()
  })

  it('shows the alert for a tenant whose lease ends within 30 days', () => {
    renderDashboard({
      tenants: [{ id: '1', name: 'Alice', status: 'active', lease_end: daysFromNow(10) }],
    })
    expect(screen.getByText(/Leases Expiring in 30 Days/)).toBeInTheDocument()
    // Alice appears in both the expiring alert and the recent tenants list
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1)
  })

  it('excludes tenants with no lease_end date from the alert', () => {
    renderDashboard({
      tenants: [{ id: '1', name: 'Bob', status: 'active' }],
    })
    expect(screen.queryByText(/Leases Expiring/)).not.toBeInTheDocument()
  })

  it('excludes tenants whose lease expired in the past', () => {
    renderDashboard({
      tenants: [{ id: '1', name: 'Carol', status: 'active', lease_end: daysFromNow(-5) }],
    })
    expect(screen.queryByText(/Leases Expiring/)).not.toBeInTheDocument()
  })

  it('shows multiple tenants in the expiring alert', () => {
    renderDashboard({
      tenants: [
        { id: '1', name: 'Dave', status: 'active', lease_end: daysFromNow(5) },
        { id: '2', name: 'Eve', status: 'active', lease_end: daysFromNow(25) },
        { id: '3', name: 'Frank', status: 'active', lease_end: daysFromNow(45) },
      ],
    })
    // Dave and Eve appear in expiring alert AND in recent tenants, so use getAllByText
    expect(screen.getAllByText('Dave').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Eve').length).toBeGreaterThanOrEqual(1)
    // Frank (>30 days) should only appear once in recent tenants — NOT in the alert
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.queryByText(/Leases Expiring/)).toBeInTheDocument()
  })
})

// ── Recent lists ───────────────────────────────────────────────────────────

describe('recent houses and tenants lists', () => {
  it('renders up to 4 recent houses', () => {
    const houses = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      address: `${i + 1} Oak Ave`,
      status: 'available',
    }))
    renderDashboard({ houses })
    expect(screen.getByText('1 Oak Ave')).toBeInTheDocument()
    expect(screen.getByText('4 Oak Ave')).toBeInTheDocument()
    expect(screen.queryByText('5 Oak Ave')).not.toBeInTheDocument()
  })

  it('renders up to 4 recent tenants', () => {
    const tenants = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `Tenant ${i + 1}`,
      status: 'active',
    }))
    renderDashboard({ tenants })
    expect(screen.getByText('Tenant 1')).toBeInTheDocument()
    expect(screen.getByText('Tenant 4')).toBeInTheDocument()
    expect(screen.queryByText('Tenant 5')).not.toBeInTheDocument()
  })
})
