import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for EU AI Act Compliance Checker. We collect minimal data, use privacy-first analytics, and never store anonymous assessment responses on our servers.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
            <p className="text-sm text-slate-500">
              Last updated: March 29, 2026
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              The EU AI Act Compliance Checker (&quot;we,&quot; &quot;us,&quot;
              or &quot;our&quot;) operates the euaiacompliance.app website. This
              page informs you of our policies regarding the collection, use,
              and disclosure of personal data when you use our Service and the
              choices you have associated with that data.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              2. Data Collection
            </h2>
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
              Information You Provide
            </h3>
            <p>
              When you use our Compliance Checker, we collect the information
              you voluntarily provide through your assessment responses. This
              data is used solely to generate your compliance report and is
              never stored permanently or shared with third parties.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
              Automatically Collected Information
            </h3>
            <p>
              We use Plausible Analytics, a privacy-focused analytics platform,
              to understand how users interact with our website. Plausible does
              not use cookies, does not track across sites, and is GDPR
              compliant.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              3. Data Usage
            </h2>
            <p>We use collected data to:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Generate your personalized compliance assessment</li>
              <li>Improve our service through anonymous analytics</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              4. Data Retention
            </h2>
            <p>
              Assessment responses are processed in real-time and are not
              permanently stored on our servers. Any data retained for analytics
              purposes is anonymized and cannot be traced back to you.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              5. Your Rights
            </h2>
            <p>Under the GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data</li>
              <li>Restrict processing</li>
              <li>Port your data</li>
              <li>Object to processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us at
              contact@euaiacompliance.app.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              6. Third-Party Services
            </h2>
            <p>
              We use Plausible Analytics for website analytics. Plausible is
              GDPR compliant and does not track users across the web. You can
              learn more about their privacy practices at{" "}
              <a
                href="https://plausible.io/privacy"
                className="text-blue-600 underline hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://plausible.io/privacy
              </a>.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              7. Security
            </h2>
            <p>
              We take data security seriously. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure. We implement appropriate technical and organizational
              measures to protect your data.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <p className="text-slate-900 font-medium">
              Email: contact@euaiacompliance.app
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              9. Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
