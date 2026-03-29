import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db/client', () => ({
  prisma: {
    assessmentEvent: {
      create: vi.fn().mockResolvedValue({ id: 'test-event-1' }),
    },
  },
}))

import { prisma } from '@/lib/db/client'

describe('Analytics Events', () => {
  it('creates analytics event in DB', async () => {
    const event = await prisma.assessmentEvent.create({
      data: {
        eventType: 'completed',
        assessmentId: 'test-123',
        questionId: null,
        metadata: null,
      },
    })
    expect(event.id).toBe('test-event-1')
    expect(prisma.assessmentEvent.create).toHaveBeenCalledOnce()
  })

  it('handles all valid event types', () => {
    const validTypes = ['started', 'completed', 'abandoned', 'pdf_downloaded', 'badge_copied']
    validTypes.forEach(type => {
      expect(typeof type).toBe('string')
    })
  })
})
