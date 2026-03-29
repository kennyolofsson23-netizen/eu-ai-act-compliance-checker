import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "q1_is_ai",
    text: "Does your system use machine learning, operate with autonomy, or generate outputs that influence decisions or environments?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes",
        description:
          "The system uses ML, neural networks, statistical modeling, or similar AI techniques",
      },
      {
        value: "no",
        label: "No",
        description:
          "The system uses only rule-based logic or deterministic algorithms",
      },
    ],
    next: (answer) => (answer === "no" ? null : "q2_role"),
  },
  {
    id: "q2_role",
    text: "What is your role in relation to this AI system?",
    type: "radio",
    options: [
      {
        value: "provider",
        label: "Provider",
        description: "You develop and/or place the AI system on the EU market",
      },
      {
        value: "deployer",
        label: "Deployer",
        description:
          "You use the AI system under your own authority in a professional context",
      },
      {
        value: "importer",
        label: "Importer",
        description:
          "You bring an AI system from outside the EU onto the EU market",
      },
      {
        value: "distributor",
        label: "Distributor",
        description:
          "You make an AI system available on the EU market (but did not develop it)",
      },
    ],
    next: () => "q3_gpai",
  },
  {
    id: "q3_gpai",
    text: "Is this a General Purpose AI (GPAI) model — a model trained on large amounts of data capable of serving multiple different purposes (e.g., LLMs like GPT, Claude, Llama)?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes — this is a GPAI model" },
      { value: "no", label: "No — this is a purpose-specific AI system" },
    ],
    next: () => "q4_prohibited",
  },
  {
    id: "q4_prohibited",
    text: "Does your AI system involve any of the following practices prohibited under Article 5 of the EU AI Act?",
    type: "checkbox",
    options: [
      {
        value: "subliminal",
        label: "Subliminal manipulation",
        description:
          "Techniques that subliminally manipulate a person's behavior beyond their awareness",
      },
      {
        value: "vulnerability",
        label: "Exploiting vulnerabilities",
        description:
          "Exploiting vulnerabilities of specific groups (age, disability, social situation)",
      },
      {
        value: "social_scoring",
        label: "Social scoring by public authorities",
        description:
          "Social scoring of natural persons by public authorities or on their behalf",
      },
      {
        value: "realtime_biometric",
        label: "Real-time remote biometric identification in public spaces",
        description:
          "For law enforcement purposes with very limited exceptions",
      },
      {
        value: "emotion_workplace",
        label: "Emotion recognition in workplace/education",
        description: "Inferring emotions in workplace or educational settings",
      },
      {
        value: "biometric_categorisation",
        label: "Biometric categorisation for sensitive attributes",
        description:
          "Inferring political views, religious beliefs, sexual orientation, race from biometrics",
      },
      { value: "none", label: "None of the above" },
    ],
    next: (answer) => {
      const answers = Array.isArray(answer) ? answer : [answer];
      if (answers.some((a) => a !== "none" && a !== "")) return null;
      return "q5_safety_component";
    },
  },
  {
    id: "q5_safety_component",
    text: "Is your AI system a safety component of a product regulated under EU harmonised legislation (e.g., medical devices, machinery, vehicles, aviation, rail)?",
    type: "radio",
    options: [
      {
        value: "yes",
        label: "Yes — it is a safety component of a regulated product",
      },
      {
        value: "no",
        label: "No — it is a standalone AI system or non-safety component",
      },
    ],
    next: () => "q6_domain",
  },
  {
    id: "q6_domain",
    text: "Which area does your AI system operate in? (Select the best match)",
    type: "radio",
    options: [
      {
        value: "biometrics",
        label: "Biometrics",
        description:
          "Identification, authentication, or emotion recognition via biometric data",
      },
      {
        value: "critical_infrastructure",
        label: "Critical infrastructure",
        description:
          "Water, gas, heating, electricity, road traffic, transport networks",
      },
      {
        value: "education",
        label: "Education & vocational training",
        description:
          "Student access, evaluation, scoring, or monitoring in educational settings",
      },
      {
        value: "employment",
        label: "Employment & HR",
        description:
          "Recruitment, selection, promotion, task allocation, performance monitoring",
      },
      {
        value: "essential_services",
        label: "Essential private/public services",
        description:
          "Credit scoring, insurance, social benefits, emergency services",
      },
      {
        value: "law_enforcement",
        label: "Law enforcement",
        description:
          "Individual risk assessment, lie detection, crime analytics, evidence evaluation",
      },
      {
        value: "migration",
        label: "Migration & asylum",
        description:
          "Risk assessment, document authenticity, application processing, security screening",
      },
      {
        value: "justice",
        label: "Justice & democratic processes",
        description: "Legal research, dispute resolution, election influence",
      },
      {
        value: "other",
        label: "None of the above",
        description: "The system operates in another domain",
      },
    ],
    next: () => "q7_function",
  },
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

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
export const FIRST_QUESTION_ID = "q1_is_ai";
export const TOTAL_QUESTIONS = QUESTIONS.length;
