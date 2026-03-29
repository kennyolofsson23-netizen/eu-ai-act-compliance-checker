export type RiskLevel = "unacceptable" | "high" | "limited" | "minimal";
export type UserRole = "provider" | "deployer" | "importer" | "distributor";

export interface QuestionAnswer {
  questionId: string;
  value: string | string[] | boolean;
}

export interface AssessmentAnswers {
  isAiSystem?: boolean;
  role?: UserRole;
  isGpai?: boolean;
  prohibitedPractices?: string[];
  isSafetyComponent?: boolean;
  domain?: string;
  domainFunction?: string;
  isNarrowTask?: boolean;
  profilesPersons?: boolean;
  interactsWithPeople?: boolean;
  generatesSyntheticContent?: boolean;
  emotionRecognition?: boolean;
}

export interface ClassificationResult {
  riskLevel: RiskLevel;
  citedArticles: string[];
  obligations: Obligation[];
  annexCategory?: string;
  prohibitedPractice?: string;
  reasoning: string;
}

export interface Obligation {
  id: string;
  title: string;
  article: string;
  summary: string;
  practicalMeaning: string;
  appliesToRole: UserRole[];
  riskLevels: RiskLevel[];
  deadline?: string;
}

export interface ArticleReference {
  id: string;
  number: string;
  title: string;
  summary: string;
  url?: string;
}

export interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "info";
  options?: QuestionOption[];
  required?: boolean;
  next?: (answer: string | string[]) => string | null;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface AssessmentData {
  id: string;
  systemName: string;
  riskLevel: RiskLevel;
  role: UserRole;
  isGpai: boolean;
  annexCategory?: string;
  citedArticles: string[];
  obligations: Obligation[];
  answers: AssessmentAnswers;
  badgeUrl?: string;
  createdAt: string;
  updatedAt?: string;
}
