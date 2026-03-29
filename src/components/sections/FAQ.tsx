'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is the EU AI Act?',
      answer: 'The EU AI Act is a comprehensive regulatory framework for artificial intelligence that establishes rules based on risk levels. It went into force on December 12, 2024, with full applicability by August 2, 2026.'
    },
    {
      question: 'How long does the assessment take?',
      answer: 'The assessment takes approximately 5-10 minutes depending on how familiar you are with your AI system. All 12 questions must be answered for accurate classification.'
    },
    {
      question: 'Is this tool free forever?',
      answer: 'Yes! The EU AI Act Compliance Checker is completely free and will remain free. There are no hidden costs, subscription fees, or premium features.'
    },
    {
      question: 'What risk categories are there?',
      answer: 'The EU AI Act defines four risk levels: (1) Unacceptable Risk - prohibited systems, (2) High Risk - systems requiring extensive compliance, (3) Limited Risk - transparency requirements, and (4) Minimal Risk - minimal requirements.'
    },
    {
      question: 'Can I use this assessment for official documentation?',
      answer: 'This tool provides guidance and templates to help you understand your obligations. For official compliance documentation, we recommend consulting with legal experts familiar with the EU AI Act.'
    },
    {
      question: 'How often is this tool updated?',
      answer: 'We continuously monitor EU AI Act guidance documents and update our assessment criteria to reflect the latest regulatory interpretation from the European Commission and regulatory bodies.'
    }
  ]

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-600">
            Have questions about EU AI Act compliance?
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-slate-50 border-t text-slate-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  )
}
