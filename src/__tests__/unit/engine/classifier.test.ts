import { describe, it, expect } from 'vitest'
import { classify } from '@/lib/engine/classifier'

describe('classifier', () => {
  it('returns minimal risk for non-AI systems', () => {
    const result = classify({ isAiSystem: false })
    expect(result.riskLevel).toBe('minimal')
  })

  it('returns unacceptable risk for prohibited practices', () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ['social_scoring'],
    })
    expect(result.riskLevel).toBe('unacceptable')
    expect(result.citedArticles).toContain('Article 5')
  })

  it('returns high risk for safety component', () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ['none'],
      isSafetyComponent: true,
    })
    expect(result.riskLevel).toBe('high')
  })

  it('returns high risk for employment + decision making', () => {
    const result = classify({
      isAiSystem: true,
      role: 'provider',
      prohibitedPractices: ['none'],
      isSafetyComponent: false,
      domain: 'employment',
      domainFunction: 'decision_making',
      isNarrowTask: false,
    })
    expect(result.riskLevel).toBe('high')
  })

  it('returns limited risk for chatbot', () => {
    const result = classify({
      isAiSystem: true,
      role: 'provider',
      prohibitedPractices: ['none'],
      isSafetyComponent: false,
      domain: 'other',
      domainFunction: 'recommendation',
      isNarrowTask: false,
      profilesPersons: false,
      interactsWithPeople: true,
      generatesSyntheticContent: false,
      emotionRecognition: false,
    })
    expect(result.riskLevel).toBe('limited')
  })

  it('returns minimal risk for simple recommendation tool', () => {
    const result = classify({
      isAiSystem: true,
      role: 'provider',
      prohibitedPractices: ['none'],
      isSafetyComponent: false,
      domain: 'other',
      domainFunction: 'recommendation',
      isNarrowTask: false,
      profilesPersons: false,
      interactsWithPeople: false,
      generatesSyntheticContent: false,
      emotionRecognition: false,
    })
    expect(result.riskLevel).toBe('minimal')
  })
})
