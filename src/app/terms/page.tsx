import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for EU AI Act Compliance Checker. This tool provides informational guidance only and does not constitute legal advice.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
            <p className="text-sm text-slate-500">
              Last updated: March 29, 2026
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the EU AI Act Compliance Checker
              (&quot;Service&quot;), you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to
              abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              2. Use License
            </h2>
            <p>
              You may use the EU AI Act Compliance Checker to assess your
              organization&apos;s AI systems, share assessment results with your
              team, legal counsel, or auditors, and embed your compliance badge
              on your website or in product documentation. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                Resell, relicense, or redistribute assessment results as your
                own compliance product or service
              </li>
              <li>
                Scrape or programmatically access the Service outside of the
                official API and its documented rate limits
              </li>
              <li>
                Attempt to decompile, reverse engineer, or extract the
                classification logic of the Service
              </li>
              <li>
                Mirror or republish the Service&apos;s content on any other
                domain or platform
              </li>
              <li>
                Remove or obscure any copyright notices, disclaimers, or
                attribution in assessment outputs
              </li>
              <li>
                Use the Service in any manner that could damage, disable, or
                impair its availability for other users
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              3. Disclaimer of Warranties
            </h2>
            <p>
              The materials on the EU AI Act Compliance Checker are provided on
              an &apos;as is&apos; basis. The EU AI Act Compliance Checker makes
              no warranties, expressed or implied, and hereby disclaims and
              negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              4. Limitations of Liability
            </h2>
            <p>
              In no event shall the EU AI Act Compliance Checker or its
              suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the
              materials on the Service, even if the EU AI Act Compliance Checker
              or an authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              5. Not Legal Advice
            </h2>
            <p>
              The information provided by the EU AI Act Compliance Checker is
              for informational purposes only and is not legal advice. This tool
              does not create an attorney-client relationship. For legal advice
              specific to your organization, please consult with a qualified
              legal professional experienced in EU AI Act compliance.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              6. Assessment Results
            </h2>
            <p>
              The assessment results provided are based on the information you
              provide and our understanding of current EU AI Act requirements.
              These results should be reviewed by qualified professionals and
              may change as regulations evolve. We do not guarantee the accuracy
              or completeness of assessment results.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              7. Third-Party Links
            </h2>
            <p>
              The EU AI Act Compliance Checker has not reviewed all of the sites
              linked to its website and is not responsible for the contents of
              any such linked site. The inclusion of any link does not imply
              endorsement by the EU AI Act Compliance Checker of the site. Use
              of any such linked website is at the user&apos;s own risk.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              8. Modifications
            </h2>
            <p>
              The EU AI Act Compliance Checker may revise these terms of service
              for its website at any time without notice. By using this website,
              you are agreeing to be bound by the then current version of these
              terms of service.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              9. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of the European Union, and you
              irrevocably submit to the exclusive jurisdiction of the courts
              located there.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
              10. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p className="text-slate-900 font-medium">
              Email: contact@euaiacompliance.app
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
