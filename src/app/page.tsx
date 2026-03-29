import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DeadlineCountdown from "@/components/sections/DeadlineCountdown";
import FAQ from "@/components/sections/FAQ";
import SocialProof from "@/components/sections/SocialProof";
import { APP_NAME, APP_URL, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "EU AI Act Compliance Checker — Free Risk Classification Tool",
  description: APP_DESCRIPTION,
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "EU AI Act Compliance Checker — Free Risk Classification Tool",
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the EU AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The EU AI Act (Regulation 2024/1689) is the world's first comprehensive AI regulation. It establishes a risk-based framework that classifies AI systems into four categories — Unacceptable, High, Limited, and Minimal risk — each with different obligations. It applies to any organization that develops, deploys, imports, or distributes AI systems that affect people in the EU.",
        },
      },
      {
        "@type": "Question",
        name: "Who does the EU AI Act apply to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The EU AI Act applies to providers (developers), deployers, importers, and distributors of AI systems whose outputs are used within the EU — regardless of where the organization is based. If your AI system affects EU residents, the Act likely applies to you.",
        },
      },
      {
        "@type": "Question",
        name: "What are the key deadlines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prohibited AI practices became enforceable on February 2, 2025. GPAI model obligations (including large language models) apply from August 2, 2025. High-risk AI system obligations and transparency requirements are fully enforceable from August 2, 2026.",
        },
      },
      {
        "@type": "Question",
        name: "What are the fines for non-compliance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fines can reach up to 7% of global annual turnover (capped at €35M) for deploying prohibited AI practices, 3% (€15M cap) for violating high-risk AI obligations, and 1.5% (€7.5M cap) for providing incorrect information to authorities.",
        },
      },
      {
        "@type": "Question",
        name: "Is this tool free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — the core questionnaire, risk classification, obligation checklist, and compliance badge are completely free. No credit card required, no account needed to complete an assessment.",
        },
      },
      {
        "@type": "Question",
        name: "Is the result of this tool legally binding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This tool provides educational guidance based on publicly available information about the EU AI Act. The results are not legal advice. You should consult qualified legal counsel for compliance decisions affecting your business.",
        },
      },
      {
        "@type": "Question",
        name: "What is a High-Risk AI system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "High-risk AI systems are those that could significantly impact people's lives, safety, or fundamental rights. They include AI systems used in employment decisions, credit scoring, education assessment, biometric identification, law enforcement, and more (listed in Annex III). They also include AI that serves as a safety component in products regulated by EU harmonised legislation.",
        },
      },
      {
        "@type": "Question",
        name: 'What does "GPAI" mean?',
        acceptedAnswer: {
          "@type": "Answer",
          text: "GPAI stands for General Purpose AI — AI models trained on large amounts of data to perform a wide range of tasks, such as large language models (GPT, Claude, Llama). GPAI providers have specific obligations under the EU AI Act including technical documentation, copyright compliance, and transparency with downstream providers.",
        },
      },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <DeadlineCountdown />
      <FAQ />
    </>
  );
}
