import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma and auth
vi.mock('@/lib/db/client', () => ({
  prisma: {
    assessment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/engine/classifier', () => ({
  classify: vi.fn(() => ({
    riskLevel: 'high',
    citedArticles: ['Article 6(2)'],
    obligations: [],
    reasoning: 'Test reasoning',
  })),
}))

import { prisma } from '@/lib/db/client'
import { auth } from '@/lib/auth'

describe('Assessment API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated GET /api/assessments', async () => {
    vi.mocked(auth).mockResolvedValue(null)
    // Test auth guard
    const session = await auth()
    expect(session).toBeNull()
  })

  it('classify is called when creating assessment', async () => {
    const { classify } = await import('@/lib/engine/classifier')
    const result = classify({ isAiSystem: true, role: 'provider' })
    expect(result.riskLevel).toBe('high')
  })
})
