import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About EU AI Act Compliance Checker",
  description:
    "Learn about the EU AI Act Compliance Checker, our mission, and why we built this free tool for the AI community.",
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
              The EU AI Act Compliance Checker is a free tool designed to help
              organizations quickly assess their AI systems&apos; compliance with the
              European Union&apos;s groundbreaking AI Act.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Our Mission
            </h2>
            <p>
              We believe that compliance with the EU AI Act should be accessible
              to all organizations, regardless of size or budget. Enterprise
              compliance solutions cost $20K-100K annually, putting them out of
              reach for startups and smaller companies.
            </p>
            <p>
              Our mission is to democratize AI compliance by providing free,
              accurate, and actionable guidance to help your organization:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                Understand the EU AI Act requirements applicable to your AI
                system
              </li>
              <li>
                Classify your system by risk level (Unacceptable, High, Limited,
                Minimal)
              </li>
              <li>Access specific obligation checklists</li>
              <li>Download documentation templates</li>
              <li>Get started on the path to compliance</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Why We Built This
            </h2>
            <p>
              The EU AI Act represents a watershed moment in AI regulation. With
              full enforcement coming by August 2, 2026, organizations need
              clear guidance now. We noticed that:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Most guidance is fragmented across multiple documents</li>
              <li>Enterprise tools are prohibitively expensive</li>
              <li>Organizations need fast, practical answers to get started</li>
              <li>The compliance landscape is evolving rapidly</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              How It Works
            </h2>
            <p>
              Our assessment asks 12 evidence-based questions about your AI
              system, designed by reviewing:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>The official EU AI Act text (Regulation 2024/1689)</li>
              <li>European Commission guidance documents</li>
              <li>AI Office and national regulatory interpretations</li>
              <li>Industry standards and best practices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              What You Get
            </h2>
            <p>After answering 12 questions (takes ~5 minutes), you receive:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Risk Classification:</strong> Unacceptable, High,
                Limited, or Minimal Risk
              </li>
              <li>
                <strong>Obligation Checklist:</strong> Specific requirements for
                your system
              </li>
              <li>
                <strong>Documentation Templates:</strong> Ready-to-use
                compliance documents
              </li>
              <li>
                <strong>Compliance Badge:</strong> Share your compliance status
              </li>
              <li>
                <strong>Expert Guidance:</strong> Links to official regulations
                and guidance
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Important Disclaimer
            </h2>
            <p>
              This tool is designed to provide general guidance based on the EU
              AI Act. It is not legal advice. For legal questions specific to
              your organization, please consult with a qualified legal expert
              familiar with EU AI Act compliance.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              Always Free
            </h2>
            <p>
              We believe that compliance guidance should be free and accessible.
              The EU AI Act Compliance Checker will remain completely free
              forever. No hidden costs, no upsells, no premium features.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
