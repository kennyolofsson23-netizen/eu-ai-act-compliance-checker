import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { auth } from '@/lib/auth'
import { updateAssessmentSchema } from '@/lib/validation/schemas'

function canAccess(
  assessment: { userId: string | null; anonymousId: string | null },
  userId: string | null,
  anonymousId: string | null
): boolean {
  if (userId && assessment.userId === userId) return true
  if (!userId && anonymousId && assessment.anonymousId === anonymousId) return true
  return false
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const userId = session?.user?.id || null
    const anonymousId = request.cookies.get('eu_ai_anon_id')?.value || null

    const assessment = await prisma.assessment.findUnique({ where: { id } })
    if (!assessment) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!canAccess(assessment, userId, anonymousId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      id: assessment.id,
      systemName: assessment.systemName,
      riskLevel: assessment.riskLevel,
      role: assessment.role,
      isGpai: assessment.isGpai,
      annexCategory: assessment.annexCategory,
      citedArticles: JSON.parse(assessment.citedArticles),
      obligations: JSON.parse(assessment.obligations),
      answers: JSON.parse(assessment.answers),
      emailReminders: assessment.emailReminders,
      badgeUrl: `/api/badge/${assessment.id}`,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessment = await prisma.assessment.findUnique({ where: { id } })
    if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (assessment.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = updateAssessmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
    }

    const updated = await prisma.assessment.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({
      id: updated.id,
      systemName: updated.systemName,
      emailReminders: updated.emailReminders,
      updatedAt: updated.updatedAt,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessment = await prisma.assessment.findUnique({ where: { id } })
    if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (assessment.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.assessment.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
