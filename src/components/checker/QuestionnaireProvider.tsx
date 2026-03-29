'use client'
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { AssessmentAnswers, ClassificationResult } from '@/lib/engine/types'
import { QUESTIONS, FIRST_QUESTION_ID, QUESTION_MAP } from '@/lib/engine/questions'
import { classify } from '@/lib/engine/classifier'

export interface QuestionnaireState {
  currentQuestionId: string
  answers: AssessmentAnswers
  questionHistory: string[]
  isComplete: boolean
  result: ClassificationResult | null
  systemName: string
}

type Action =
  | { type: 'ANSWER_QUESTION'; questionId: string; answer: string | string[] | boolean }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }
  | { type: 'SET_SYSTEM_NAME'; name: string }
  | { type: 'RESTORE'; state: QuestionnaireState }

const initialState: QuestionnaireState = {
  currentQuestionId: FIRST_QUESTION_ID,
  answers: {},
  questionHistory: [FIRST_QUESTION_ID],
  isComplete: false,
  result: null,
  systemName: '',
}

const STORAGE_KEY = 'eu_ai_questionnaire_state'

export function getAnswerKey(questionId: string): keyof AssessmentAnswers {
  const map: Record<string, keyof AssessmentAnswers> = {
    q1_is_ai: 'isAiSystem',
    q2_role: 'role',
    q3_gpai: 'isGpai',
    q4_prohibited: 'prohibitedPractices',
    q5_safety_component: 'isSafetyComponent',
    q6_domain: 'domain',
    q7_function: 'domainFunction',
    q8_narrow_task: 'isNarrowTask',
    q9_profiles_persons: 'profilesPersons',
    q10_interacts_people: 'interactsWithPeople',
    q11_synthetic_content: 'generatesSyntheticContent',
    q12_emotion_recognition: 'emotionRecognition',
  }
  return (map[questionId] ?? questionId) as keyof AssessmentAnswers
}

function handleAnswerQuestion(
  state: QuestionnaireState,
  questionId: string,
  answer: string | string[] | boolean,
): QuestionnaireState {
  const question = QUESTION_MAP.get(questionId)
  if (!question) return state

  const answerKey = getAnswerKey(questionId)
  const newAnswers = { ...state.answers, [answerKey]: answer }

  if (questionId === 'q1_is_ai' && answer === 'no') {
    return { ...state, answers: newAnswers, isComplete: true, result: classify({ isAiSystem: false }) }
  }

  if (questionId === 'q4_prohibited') {
    const arr = Array.isArray(answer) ? answer : [answer as string]
    if (arr.some(a => a !== 'none' && a !== '')) {
      const mergedAnswers = { ...newAnswers, prohibitedPractices: arr }
      return { ...state, answers: mergedAnswers, isComplete: true, result: classify(mergedAnswers) }
    }
  }

  const answerStr = Array.isArray(answer) ? (answer as string[])[0] : String(answer)
  const nextId = question.next ? question.next(answerStr) : null

  if (!nextId) {
    return { ...state, answers: newAnswers, isComplete: true, result: classify(newAnswers), questionHistory: [...state.questionHistory] }
  }

  return { ...state, answers: newAnswers, currentQuestionId: nextId, questionHistory: [...state.questionHistory, nextId] }
}

function reducer(state: QuestionnaireState, action: Action): QuestionnaireState {
  switch (action.type) {
    case 'ANSWER_QUESTION':
      return handleAnswerQuestion(state, action.questionId, action.answer)
    case 'GO_BACK': {
      if (state.questionHistory.length <= 1) return state
      const newHistory = state.questionHistory.slice(0, -1)
      return { ...state, currentQuestionId: newHistory[newHistory.length - 1], questionHistory: newHistory, isComplete: false, result: null }
    }
    case 'RESET':
      return { ...initialState }
    case 'SET_SYSTEM_NAME':
      return { ...state, systemName: action.name }
    case 'RESTORE':
      return action.state
    default:
      return state
  }
}

export interface QuestionnaireContextValue {
  state: QuestionnaireState
  answerQuestion: (questionId: string, answer: string | string[] | boolean) => void
  goBack: () => void
  reset: () => void
  setSystemName: (name: string) => void
  progress: number
  totalQuestions: number
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null)

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: QuestionnaireState = JSON.parse(saved)
        if (parsed?.currentQuestionId) dispatch({ type: 'RESTORE', state: parsed })
      }
    } catch (_err) {
      // Ignore malformed stored state
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (_err) {
      // Ignore storage errors (e.g. private browsing quota)
    }
  }, [state])

  const answerQuestion = useCallback((questionId: string, answer: string | string[] | boolean) => {
    dispatch({ type: 'ANSWER_QUESTION', questionId, answer })
  }, [])

  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
    try { localStorage.removeItem(STORAGE_KEY) } catch (_err) {
      // Ignore storage errors
    }
  }, [])

  const setSystemName = useCallback((name: string) => dispatch({ type: 'SET_SYSTEM_NAME', name }), [])
  const progress = Math.round((state.questionHistory.length / QUESTIONS.length) * 100)

  return (
    <QuestionnaireContext.Provider value={{ state, answerQuestion, goBack, reset, setSystemName, progress, totalQuestions: QUESTIONS.length }}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire(): QuestionnaireContextValue {
  const ctx = useContext(QuestionnaireContext)
  if (!ctx) throw new Error('useQuestionnaire must be used within QuestionnaireProvider')
  return ctx
}
