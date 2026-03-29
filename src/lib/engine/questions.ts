import { Question } from "./types";
import { QUESTIONS_PART1 } from "./questions-data";

const QUESTIONS_PART2: Question[] = [
  {
    id: "q7_function",
    text: "What is the primary function of your AI system?",
    type: "radio",
    options: [
      {
        value: "decision_making",
        label: "Automated decision-making about people",
        description:
          "Makes or significantly assists decisions that affect individuals",
      },
      {
        value: "risk_assessment",
        label: "Risk or eligibility assessment",
        description:
          "Evaluates creditworthiness, insurance risk, employee performance, student scores",
      },
      {
        value: "profiling",
        label: "Behavioural profiling",
        description:
          "Creates profiles of individuals based on their behaviour, preferences, or characteristics",
      },
      {
        value: "monitoring",
        label: "Real-time monitoring/surveillance",
        description:
          "Monitors people in real time, including remote monitoring",
      },
      {
        value: "recommendation",
        label: "Recommendation or content generation",
        description: "Recommends content, products, or actions to users",
      },
      {
        value: "content_generation",
        label: "Synthetic content generation",
        description: "Generates text, images, audio, or video content",
      },
      {
        value: "other",
        label: "Other function",
        description: "Performs a different function not listed above",
      },
    ],
    next: () => "q8_narrow_task",
  },
  {
    id: "q8_narrow_task",
    text: "Is your AI system intended for a narrow procedural task with no significant impact on the assessment of relevant facts, and poses a low risk of harm?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes — it is a narrow, low-impact procedural tool",
      },
      {
        value: "no",
        label: "No — it influences assessments of relevant facts or outcomes",
      },
    ],
    next: () => "q9_profiles_persons",
  },
  {
    id: "q9_profiles_persons",
    text: "Does your AI system profile individuals (i.e., automatically process personal data to evaluate, analyse, or predict aspects of their personal behaviour, characteristics, or preferences)?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes — it profiles individuals based on their data",
      },
      {
        value: "no",
        label: "No — it does not create or use individual profiles",
      },
    ],
    next: () => "q10_interacts_people",
  },
  {
    id: "q10_interacts_people",
    text: "Does your AI system directly interact with natural persons (e.g., as a chatbot, virtual assistant, or automated customer service)?",
    type: "radio",
    options: [
      {
        value: "yes",
        label:
          "Yes — it communicates with users in natural language or via voice",
      },
      {
        value: "no",
        label:
          "No — it operates in the background without direct user interaction",
      },
    ],
    next: () => "q11_synthetic_content",
  },
  {
    id: "q11_synthetic_content",
    text: "Does your AI system generate or manipulate image, audio, or video content (e.g., deepfakes, AI-generated images, voice cloning, synthetic media)?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes — it generates or manipulates media content",
      },
      { value: "no", label: "No — it does not generate or manipulate media" },
    ],
    next: () => "q12_emotion_recognition",
  },
  {
    id: "q12_emotion_recognition",
    text: "Does your AI system infer or attempt to detect the emotional state of natural persons based on biometric data (facial expressions, voice, physiological signals)?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes — it performs emotion recognition from biometric signals",
      },
      {
        value: "no",
        label: "No — it does not infer emotional states from biometrics",
      },
    ],
    next: () => null,
  },
];

export const QUESTIONS: Question[] = [...QUESTIONS_PART1, ...QUESTIONS_PART2];

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
export const FIRST_QUESTION_ID = "q1_is_ai";
export const TOTAL_QUESTIONS = QUESTIONS.length;
