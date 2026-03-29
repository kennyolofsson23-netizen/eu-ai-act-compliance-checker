export const APP_NAME = "EU AI Act Compliance Checker";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://euaiacompliance.app";
export const APP_DESCRIPTION =
  "EU AI Act Compliance Checker is a free AI risk classification tool. Get your EU AI Act risk level, obligation checklist, and compliance badge in 3 minutes.";

export const EU_AI_ACT_ENFORCEMENT_DATE = new Date("2026-08-02T00:00:00Z");
export const EU_AI_ACT_PROHIBITED_DATE = new Date("2025-02-02T00:00:00Z");
export const EU_AI_ACT_GPAI_DATE = new Date("2025-08-02T00:00:00Z");

export const RISK_LEVELS = {
  UNACCEPTABLE: "unacceptable",
  HIGH: "high",
  LIMITED: "limited",
  MINIMAL: "minimal",
} as const;

export const RISK_COLORS = {
  unacceptable: {
    badge: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    bannerBg: "#FEE2E2",
    heading: "#7F1D1D",
    body: "#991B1B",
    icon: "#DC2626",
    tailwind: {
      bg: "bg-red-50",
      border: "border-red-200",
      bannerBg: "bg-red-100",
      heading: "text-red-900",
      body: "text-red-800",
      icon: "text-red-600",
      pillBorder: "border-red-300",
      badge: "bg-red-100 text-red-800 border-red-300",
    },
  },
  high: {
    badge: "#EA580C",
    bg: "#FFF7ED",
    border: "#FED7AA",
    bannerBg: "#FFEDD5",
    heading: "#431407",
    body: "#9A3412",
    icon: "#EA580C",
    tailwind: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      bannerBg: "bg-orange-100",
      heading: "text-orange-950",
      body: "text-orange-800",
      icon: "text-orange-600",
      pillBorder: "border-orange-300",
      badge: "bg-orange-100 text-orange-800 border-orange-300",
    },
  },
  limited: {
    badge: "#CA8A04",
    bg: "#FEFCE8",
    border: "#FEF08A",
    bannerBg: "#FEF9C3",
    heading: "#713F12",
    body: "#854D0E",
    icon: "#CA8A04",
    tailwind: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      bannerBg: "bg-yellow-100",
      heading: "text-yellow-900",
      body: "text-yellow-800",
      icon: "text-yellow-600",
      pillBorder: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
  },
  minimal: {
    badge: "#16A34A",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    bannerBg: "#DCFCE7",
    heading: "#14532D",
    body: "#166534",
    icon: "#16A34A",
    tailwind: {
      bg: "bg-green-50",
      border: "border-green-200",
      bannerBg: "bg-green-100",
      heading: "text-green-900",
      body: "text-green-800",
      icon: "text-green-600",
      pillBorder: "border-green-300",
      badge: "bg-green-100 text-green-800 border-green-300",
    },
  },
};

export const RISK_LEVEL_LABELS: Record<string, string> = {
  unacceptable: "Unacceptable Risk",
  high: "High Risk",
  limited: "Limited Risk",
  minimal: "Minimal Risk",
};

export const ANONYMOUS_ID_COOKIE = "eu_ai_anon_id";
export const ANONYMOUS_ASSESSMENT_COOKIE = "eu_ai_assessment";
export const MAX_COMPARISON_COUNT = 4;

export const EU_AI_ACT_DEADLINES = [
  {
    id: "prohibited",
    date: "2025-02-02",
    title: "Prohibited AI Practices",
    description:
      "Practices banned under Article 5 — including subliminal manipulation, social scoring, and real-time biometric identification in public spaces — are now enforceable.",
    articles: ["Article 5"],
  },
  {
    id: "gpai",
    date: "2025-08-02",
    title: "GPAI Model Obligations",
    description:
      "General-purpose AI model providers — including LLM developers — must now comply with transparency, technical documentation, and copyright policy obligations.",
    articles: ["Article 53", "Article 55"],
  },
  {
    id: "high_risk",
    date: "2026-08-02",
    title: "High-Risk AI Obligations",
    description:
      "Full enforcement of all Annex III obligations: risk management, data governance, technical documentation, conformity assessment, and EU database registration.",
    articles: [
      "Article 6",
      "Article 9-15",
      "Article 43",
      "Article 49",
      "Article 72",
    ],
  },
  {
    id: "transparency",
    date: "2026-08-02",
    title: "Transparency Obligations",
    description:
      "AI systems that interact with people or generate synthetic content must clearly disclose their AI nature to users. AI-generated media must be labelled.",
    articles: ["Article 50"],
  },
];
