import { AssessmentAnswers, ClassificationResult, RiskLevel, UserRole } from './types'
import { getObligationsForLevel } from './obligations'

const HIGH_RISK_DOMAINS = new Set([
  'biometrics', 'critical_infrastructure', 'education', 'employment',
  'essential_services', 'law_enforcement', 'migration', 'justice',
])

const HIGH_RISK_FUNCTIONS = new Set([
  'decision_making', 'risk_assessment', 'profiling', 'monitoring',
])

const PROHIBITED_PRACTICES_LABELS: Record<string, string> = {
  subliminal: 'subliminal manipulation techniques (Article 5(1)(a))',
  vulnerability: 'exploitation of vulnerabilities of specific groups (Article 5(1)(b))',
  social_scoring: 'social scoring by public authorities (Article 5(1)(c))',
  realtime_biometric: 'real-time remote biometric identification in public spaces (Article 5(1)(h))',
  emotion_workplace: 'emotion recognition in workplace or educational settings (Article 5(1)(f))',
  biometric_categorisation: 'biometric categorisation inferring sensitive attributes (Article 5(1)(g))',
}

const DOMAIN_LABELS: Record<string, string> = {
  biometrics: 'Biometrics',
  critical_infrastructure: 'Critical Infrastructure',
  education: 'Education & Training',
  employment: 'Employment & HR',
  essential_services: 'Essential Services',
  law_enforcement: 'Law Enforcement',
  migration: 'Migration & Asylum',
  justice: 'Justice & Democracy',
}

const FUNCTION_LABELS: Record<string, string> = {
  decision_making: 'automated decision-making',
  risk_assessment: 'risk/eligibility assessment',
  profiling: 'behavioural profiling',
  monitoring: 'real-time monitoring',
}

const DOMAIN_ANNEX_ARTICLES: Record<string, string[]> = {
  biometrics: ['Annex III Category 1'],
  critical_infrastructure: ['Annex III Category 2'],
  education: ['Annex III Category 3'],
  employment: ['Annex III Category 4'],
  essential_services: ['Annex III Category 5'],
  law_enforcement: ['Annex III Category 6'],
  migration: ['Annex III Category 7'],
  justice: ['Annex III Category 8'],
}

function classifyProhibited(prohibited: string[], role: UserRole): ClassificationResult {
  const practices = prohibited
    .filter(p => p !== 'none' && p !== '')
    .map(p => PROHIBITED_PRACTICES_LABELS[p] ?? p)
  return {
    riskLevel: 'unacceptable',
    citedArticles: ['Article 5'],
    obligations: getObligationsForLevel('unacceptable', role),
    prohibitedPractice: practices.join('; '),
    reasoning: `Your AI system involves ${practices.join(' and ')}, which is prohibited under Article 5 of the EU AI Act. This practice must be discontinued immediately.`,
  }
}

function classifyHighRisk(opts: { role: UserRole; articles: string[]; reasoning: string; domain?: string }): ClassificationResult {
  return {
    riskLevel: 'high',
    citedArticles: opts.articles,
    obligations: getObligationsForLevel('high', opts.role),
    reasoning: opts.reasoning,
    annexCategory: opts.domain,
  }
}

function classifyLimitedRisk(answers: AssessmentAnswers, role: UserRole): ClassificationResult {
  const reasons: string[] = []
  if (answers.interactsWithPeople) reasons.push('directly interacts with natural persons')
  if (answers.generatesSyntheticContent) reasons.push('generates or manipulates media content')
  if (answers.emotionRecognition) reasons.push('performs emotion recognition')
  return {
    riskLevel: 'limited',
    citedArticles: ['Article 50'],
    obligations: getObligationsForLevel('limited', role),
    reasoning: `Your AI system ${reasons.join(' and ')}, triggering transparency obligations under Article 50. Users must be informed they are interacting with AI.`,
  }
}

function resolveRole(answers: AssessmentAnswers): UserRole {
  return (answers.role as UserRole) ?? 'provider'
}

function checkHighRiskByDomainAndFunction(answers: AssessmentAnswers, role: UserRole): ClassificationResult | null {
  const domain = answers.domain ?? 'other'
  const isHighRiskDomain = HIGH_RISK_DOMAINS.has(domain)
  const isHighRiskFunction = HIGH_RISK_FUNCTIONS.has(answers.domainFunction ?? '')
  const isNarrowTask = answers.isNarrowTask === true

  if (isHighRiskDomain && isHighRiskFunction && !isNarrowTask) {
    const domainArticles = DOMAIN_ANNEX_ARTICLES[domain] ?? []
    return classifyHighRisk({
      role,
      articles: ['Article 6(2)', 'Annex III', ...domainArticles],
      reasoning: `Your AI system operates in a high-risk domain (${DOMAIN_LABELS[domain] ?? domain}) and performs ${FUNCTION_LABELS[answers.domainFunction ?? ''] ?? answers.domainFunction}. It falls under Annex III of the EU AI Act as a high-risk AI system.`,
      domain,
    })
  }

  const profilesPersons = answers.profilesPersons === true
  if (isHighRiskDomain && profilesPersons && !isNarrowTask) {
    return classifyHighRisk({
      role,
      articles: ['Article 6(2)', 'Annex III'],
      reasoning: `Your AI system operates in a high-risk domain (${DOMAIN_LABELS[domain] ?? domain}) and profiles individuals, meeting the criteria for high-risk classification under Annex III.`,
      domain,
    })
  }

  return null
}

export function classify(answers: AssessmentAnswers): ClassificationResult {
  if (answers.isAiSystem === false) {
    return {
      riskLevel: 'minimal',
      citedArticles: [],
      obligations: [],
      reasoning: 'Your system does not meet the definition of an AI system under Article 3(1) of the EU AI Act and is therefore out of scope.',
    }
  }

  const role = resolveRole(answers)

  const prohibited = answers.prohibitedPractices ?? []
  const hasProhibited = prohibited.some(p => p !== 'none' && p !== '')
  if (hasProhibited) return classifyProhibited(prohibited, role)

  if (answers.isSafetyComponent === true) {
    return classifyHighRisk({
      role,
      articles: ['Article 6(1)', 'Annex II'],
      reasoning: 'Your AI system is a safety component of a product regulated under EU harmonised legislation, making it high-risk under Article 6(1) of the EU AI Act.',
      domain: 'safety_component',
    })
  }

  const highRiskResult = checkHighRiskByDomainAndFunction(answers, role)
  if (highRiskResult) return highRiskResult

  const isLimitedRisk =
    answers.interactsWithPeople === true ||
    answers.generatesSyntheticContent === true ||
    answers.emotionRecognition === true

  if (isLimitedRisk) return classifyLimitedRisk(answers, role)

  return {
    riskLevel: 'minimal',
    citedArticles: [],
    obligations: getObligationsForLevel('minimal', role),
    reasoning: 'Your AI system does not fall into any of the prohibited, high-risk, or limited-risk categories. No mandatory obligations apply, though voluntary adherence to codes of conduct is encouraged under Article 95.',
  }
}
