import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "EU AI Act Compliance Checker is a free tool that classifies AI systems by risk level and generates actionable obligation checklists. Built for developers and PMs, not lawyers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <h1 className="text-4xl font-bold mb-8">
            About EU AI Act Compliance Checker
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
            <p>
              EU AI Act Compliance Checker is a free AI risk classification tool
              that takes any organization from &ldquo;I have an AI product&rdquo;
              to &ldquo;here&apos;s exactly what I need to do&rdquo; in under
              3 minutes. Unlike enterprise GRC platforms that cost $20K–$150K
              per year, the core assessment requires no account and no credit
              card.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Why We Built This
            </h2>
            <p>
              The EU AI Act (Regulation 2024/1689) is the world&apos;s first
              comprehensive AI regulation. Full enforcement begins August 2,
              2026, with fines up to 7% of global annual turnover. Yet the
              gap between &ldquo;regulation exists&rdquo; and &ldquo;my team
              knows what to do&rdquo; is enormous for anyone outside a large
              enterprise with a dedicated compliance team.
            </p>
            <p>We built this tool because:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                The official EU checker gives raw classifications with no
                actionable guidance or obligation checklists
              </li>
              <li>
                Enterprise compliance platforms require budget and
                implementation timelines most companies don&apos;t have
              </li>
              <li>
                Legal consultations at $500–$1,000/hour are inaccessible for
                early-stage teams answering a basic scoping question
              </li>
              <li>
                Developers and PMs need plain language — not legal text — to
                understand what they must build
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              How the Assessment Works
            </h2>
            <p>
              The questionnaire uses branching logic based on the official EU AI
              Act text (Regulation 2024/1689), covering the Article 5 prohibited
              practices checklist, Annex III high-risk categories, and Article
              50 transparency triggers. Questions were designed by reviewing:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>The official EU AI Act text and recitals</li>
              <li>European Commission guidance documents</li>
              <li>EU AI Office interpretive materials</li>
              <li>
                Annex I (regulated products), Annex III (high-risk use cases),
                and Annex IV (technical documentation requirements)
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              What You Receive
            </h2>
            <p>
              After answering up to 12 questions (typically 3 minutes), you
              receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Risk Classification:</strong> Unacceptable, High,
                Limited, or Minimal — with the specific articles that triggered
                the result
              </li>
              <li>
                <strong>Obligation Checklist:</strong> Every applicable
                requirement for your role (provider or deployer), in plain
                language with article citations
              </li>
              <li>
                <strong>Documentation Templates:</strong> Ready-to-edit Markdown
                templates for Technical Documentation (Annex IV), Risk
                Management Plan, Data Governance Policy, and more
              </li>
              <li>
                <strong>Compliance Badge:</strong> An embeddable SVG badge
                showing your classification, suitable for investor decks,
                customer trust pages, and GitHub READMEs
              </li>
              <li>
                <strong>PDF Report:</strong> A downloadable assessment summary
                for your team, legal counsel, or auditors
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Free to Start
            </h2>
            <p>
              The core assessment — risk classification, obligation checklist,
              and compliance badge — is free with no signup required. For teams
              managing multiple AI systems, we offer a Pro plan with unlimited
              saved assessments, full documentation templates, PDF exports, API
              access, and deadline reminders.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Disclaimer
            </h2>
            <p>
              This tool provides informational guidance based on publicly
              available EU AI Act text and does not constitute legal advice.
              Results reflect our interpretation of Regulation 2024/1689 and
              may not account for implementing acts, delegated regulations, or
              jurisdiction-specific guidance issued after our last update.
              Consult a qualified legal professional before making compliance
              decisions that affect your organization.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
