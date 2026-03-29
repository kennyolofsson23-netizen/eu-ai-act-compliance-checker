import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the EU AI Act?",
    answer:
      "The EU AI Act (Regulation 2024/1689) is the world's first comprehensive AI regulation. It establishes a risk-based framework that classifies AI systems into four categories — Unacceptable, High, Limited, and Minimal risk — each with different obligations. It applies to any organization that develops, deploys, imports, or distributes AI systems that affect people in the EU.",
  },
  {
    question: "Who does the EU AI Act apply to?",
    answer:
      "The EU AI Act applies to providers (developers), deployers, importers, and distributors of AI systems whose outputs are used within the EU — regardless of where the organization is based. If your AI system affects EU residents, the Act likely applies to you.",
  },
  {
    question: "What are the key deadlines?",
    answer:
      "Prohibited AI practices became enforceable on February 2, 2025. GPAI model obligations (including large language models) apply from August 2, 2025. High-risk AI system obligations and transparency requirements are fully enforceable from August 2, 2026.",
  },
  {
    question: "What are the fines for non-compliance?",
    answer:
      "Fines can reach up to 7% of global annual turnover (capped at €35M) for deploying prohibited AI practices, 3% (€15M cap) for violating high-risk AI obligations, and 1.5% (€7.5M cap) for providing incorrect information to authorities.",
  },
  {
    question: "Is this tool free to use?",
    answer:
      "Yes — the core questionnaire, risk classification, obligation checklist, and compliance badge are completely free. No credit card required, no account needed to complete an assessment.",
  },
  {
    question: "Is the result of this tool legally binding?",
    answer:
      "No. This tool provides educational guidance based on publicly available information about the EU AI Act. The results are not legal advice. You should consult qualified legal counsel for compliance decisions affecting your business.",
  },
  {
    question: "What is a High-Risk AI system?",
    answer:
      "High-risk AI systems are those that could significantly impact people's lives, safety, or fundamental rights. They include AI systems used in employment decisions, credit scoring, education assessment, biometric identification, law enforcement, and more (listed in Annex III). They also include AI that serves as a safety component in products regulated by EU harmonised legislation.",
  },
  {
    question: 'What does "GPAI" mean?',
    answer:
      "GPAI stands for General Purpose AI — AI models trained on large amounts of data to perform a wide range of tasks, such as large language models (GPT, Claude, Llama). GPAI providers have specific obligations under the EU AI Act including technical documentation, copyright compliance, and transparency with downstream providers.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 md:py-32 bg-slate-50"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about EU AI Act compliance.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border border-slate-200 px-4"
            >
              <AccordionTrigger className="text-left font-medium text-slate-900 no-underline hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <p className="text-slate-600">
            Still have questions?{" "}
            <Link
              href="/about"
              className="text-blue-600 hover:underline font-medium"
            >
              Learn more about the EU AI Act
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
