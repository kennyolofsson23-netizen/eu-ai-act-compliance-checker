import { Question } from "./types";

export const QUESTIONS_PART1: Question[] = [
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
];
