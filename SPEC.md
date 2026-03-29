# EU AI Act Compliance Checker — Product Specification

## 1. Product Overview

### Problem

The EU AI Act (Regulation 2024/1689) is the world's first comprehensive AI regulation. **August 2, 2026** is the critical deadline — most high-risk AI obligations and all transparency obligations become enforceable, with fines up to **7% of global annual turnover** (€35M cap for prohibited practices, €15M/3% for high-risk violations).

Today, organizations face three choices:

1. **Enterprise platforms** (Credo AI, Holistic AI, OneTrust) — $20K–$150K/year, 6-month implementation cycles
2. **Official EU checker** — exists but gives only raw classifications with no actionable guidance, no obligation checklists, no documentation help
3. **Law firms** — $500–$1,000/hour consultations

There is **no free tool** that takes a non-technical user from "I have an AI product" to "here's exactly what I need to do" in under 5 minutes.

### Target Users

Companies building or deploying AI systems that operate in the EU market — from solo developers shipping a chatbot to mid-market SaaS companies with AI features. Not enterprises with dedicated compliance teams (they'll buy Credo AI).

### Differentiators

1. **Free, instant, no signup required** — complete the questionnaire and get results immediately
2. **Actionable output** — not just a risk level, but a specific obligation checklist with article references, documentation templates, and next steps
3. **Shareable compliance badge** — embeddable SVG/PNG showing classification, useful for investor decks, customer trust pages, and partner due diligence
4. **Plain language** — translates legal jargon into developer/PM-friendly language
5. **Saves assessments** — optional account creation to save, update, and track multiple AI systems over time

---

## 2. User Personas

### Persona 1: "Sarah — Startup CTO"

- **Company**: Series A SaaS startup, 30 employees, AI-powered customer support product
- **Goals**: Understand if her product is high-risk, get a checklist she can assign to her team, show investors the company takes compliance seriously
- **Frustrations**: Legal consultations are expensive and slow; the official EU tool gives classifications but no "now what"; enterprise platforms require budget she doesn't have
- **Behavior**: Will Google "EU AI Act compliance check free", complete the tool in one sitting, share results with her co-founder and legal advisor

### Persona 2: "Marcus — Product Manager at a Mid-Market Company"

- **Company**: 500-person B2B company, multiple AI features across products
- **Goals**: Classify all 4 of his team's AI features, generate documentation templates for the high-risk ones, produce a compliance summary for the VP of Engineering
- **Frustrations**: Doesn't understand the legal text; needs to assess multiple systems; wants to export results for internal review meetings
- **Behavior**: Will create an account, run assessments for each AI feature, download PDF reports, revisit monthly to update as products change

### Persona 3: "Elena — Freelance AI Developer"

- **Company**: Solo developer building AI tools for clients in the EU
- **Goals**: Quickly check if a client project falls under high-risk, embed a compliance badge on the project's landing page, demonstrate due diligence
- **Frustrations**: Doesn't want to read 400+ pages of regulation; needs fast answers per-project; clients ask "are we compliant?" and she needs a credible answer
- **Behavior**: Uses the tool per-project, never creates an account, copies the badge URL and pastes it into client deliverables

---

## 3. Core Features

### P0 — Must Have for Launch

#### F1: 12-Question Risk Classification Questionnaire

The core product. A guided, branching questionnaire that classifies an AI system into one of four risk levels.

**User Story**: As a user, I want to answer plain-language questions about my AI system so that I receive an accurate EU AI Act risk classification without reading the regulation.

**Acceptance Criteria**:

- Given a user lands on /checker, When the page loads, Then they see Question 1 with no signup required
- Given a user is on any question, When they select an answer, Then the next relevant question appears (branching logic — not all 12 questions shown to every user)
- Given a user answers a question indicating a prohibited practice (Article 5), When the questionnaire detects this, Then it short-circuits to "Unacceptable Risk" classification immediately with explanation
- Given a user completes all applicable questions, When results are calculated, Then the classification is one of: Unacceptable, High, Limited, or Minimal risk
- Given a user reaches the results page, When results display, Then the specific EU AI Act articles triggering that classification are cited (e.g., "Annex III, Category 5: Essential Services")
- Given a user refreshes the page mid-questionnaire, When the page reloads, Then their progress is preserved via URL state or localStorage

**Questions cover** (branching, not all shown):

1. Is your system an AI system under the Act's definition? (autonomy, inference, output generation)
2. What is your role? (provider / deployer / importer / distributor)
3. Is this a general-purpose AI (GPAI) model?
4. Does it involve any prohibited practices? (subliminal manipulation, exploitation, social scoring, etc.)
5. Is it a safety component of a regulated product? (Annex I)
6. What domain does it operate in? (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice)
7. What specific function does it perform within that domain? (sub-questions per domain from Annex III)
8. Does it perform only a narrow procedural task? (Article 6(3) exception check)
9. Does it profile natural persons? (exception nullifier)
10. Does it interact directly with people? (transparency obligation trigger)
11. Does it generate synthetic content? (deepfake/content marking trigger)
12. Does it perform emotion recognition or biometric categorization? (additional transparency trigger)

#### F2: Obligation Checklist

After classification, display a specific, actionable checklist of what the user must do.

**User Story**: As a user who received a risk classification, I want to see exactly what obligations apply to my AI system so that I know what to implement.

**Acceptance Criteria**:

- Given a user is classified as High Risk, When the results page loads, Then they see a checklist with all applicable obligations: Risk Management System (Art. 9), Data Governance (Art. 10), Technical Documentation (Art. 11), Record-Keeping (Art. 12), Transparency (Art. 13), Human Oversight (Art. 14), Accuracy/Robustness/Cybersecurity (Art. 15), Quality Management (Art. 17), Conformity Assessment (Art. 43), EU Database Registration (Art. 49), Post-Market Monitoring (Art. 72)
- Given a user is classified as Limited Risk, When the results page loads, Then they see only transparency obligations (Art. 50) applicable to their system type
- Given a user is classified as Minimal Risk, When the results page loads, Then they see "No mandatory obligations" with a recommendation to follow voluntary codes of conduct
- Given a user is classified as Unacceptable Risk, When the results page loads, Then they see a clear warning that this AI practice is prohibited in the EU, with the specific Article 5 provision cited
- Given any obligation item, When the user clicks it, Then an expandable section shows a plain-language explanation (2-3 sentences), the exact article reference, and a "what this means in practice" summary
- Given a user is a deployer (not provider), When obligations display, Then only deployer-specific obligations are shown (use per instructions, human oversight, monitoring, incident reporting, FRIA for public bodies)

#### F3: Shareable Compliance Badge

A unique URL that renders an SVG badge showing the AI system's classification.

**User Story**: As a user, I want a shareable badge URL showing my AI system's risk classification so that I can embed it in my website, pitch deck, or documentation.

**Acceptance Criteria**:

- Given a user completes an assessment, When results display, Then a badge preview is shown with the classification level and date
- Given a user clicks "Copy Badge URL", When the URL is copied, Then it points to /api/badge/[assessmentId] which returns an SVG image
- Given a badge URL is requested, When the server responds, Then it returns a valid SVG with: risk level (color-coded), assessment date, and "EU AI Act" label
- Given the badge is embedded in an external site via `<img>` tag, When rendered, Then it displays correctly at any size with crisp text
- Given a user has not created an account, When they generate a badge, Then the badge uses an anonymous assessment ID stored in a cookie/localStorage with a 90-day expiration
- Badge colors: Unacceptable = red (#DC2626), High = orange (#EA580C), Limited = yellow (#CA8A04), Minimal = green (#16A34A)

#### F4: Results Summary & PDF Export

Export the full assessment as a downloadable PDF.

**User Story**: As a user, I want to download my assessment results as a PDF so that I can share it with my team, legal counsel, or auditors.

**Acceptance Criteria**:

- Given a user is on the results page, When they click "Download PDF", Then a PDF is generated and downloaded containing: system description (from answers), risk classification with reasoning, full obligation checklist, applicable article references, and assessment date
- Given the PDF is generated, When opened, Then it includes a header with "EU AI Act Compliance Assessment" and a footer with the tool's URL and disclaimer
- Given the PDF is generated, When reviewed, Then it contains a disclaimer stating this is an informational tool and not legal advice

#### F5: Landing Page & SEO

The marketing/education page that drives organic traffic.

**User Story**: As a potential user searching for EU AI Act compliance help, I want to find a clear, trustworthy landing page so that I understand what this tool does and start using it immediately.

**Acceptance Criteria**:

- Given a user visits /, When the page loads, Then they see: a headline communicating the value prop, a "Start Assessment" CTA above the fold, a brief explanation of the EU AI Act with key deadlines, and social proof (usage count)
- Given search engine crawlers index the page, When /robots.txt and /sitemap.xml are requested, Then they return valid responses including all public pages
- Given a user visits /, When they view the page, Then the meta title is "EU AI Act Compliance Checker — Free Risk Classification Tool" and description mentions key features
- Given a user on mobile visits /, When the page loads, Then all content is readable and the CTA is tappable without horizontal scrolling

---

### P1 — Important, Ship Within 2 Weeks of Launch

#### F6: Documentation Templates

Downloadable/copyable templates for required compliance documentation.

**User Story**: As a user with a high-risk AI system, I want documentation templates so that I have a starting point for my compliance paperwork.

**Acceptance Criteria**:

- Given a user is classified as High Risk, When they view the results page, Then they see a "Documentation Templates" section with downloadable Markdown templates for: Technical Documentation (Annex IV), Risk Management Plan (Art. 9), Data Governance Policy (Art. 10), Human Oversight Protocol (Art. 14), and Post-Market Monitoring Plan (Art. 72)
- Given a user clicks a template, When it downloads, Then it contains structured sections with placeholder text, guidance comments, and references to the relevant articles
- Given a user is classified as Limited Risk, When they view templates, Then only the Transparency Disclosure template is offered
- Given a user is classified as Minimal Risk, When they view templates, Then no templates are shown (only voluntary code of conduct guidance)

#### F7: User Accounts & Saved Assessments

Optional account creation to save and manage multiple assessments.

**User Story**: As a returning user, I want to save my assessments to an account so that I can track compliance across multiple AI systems and update assessments over time.

**Acceptance Criteria**:

- Given a user completes an assessment without an account, When they click "Save Assessment", Then they are prompted to create an account via email/password or Google OAuth
- Given a user creates an account, When they log in, Then they see a dashboard listing all their saved assessments with: system name, classification, date, and last updated
- Given a user clicks an existing assessment, When the detail page loads, Then they can view the full results, re-take the questionnaire (creating a new version), or delete the assessment
- Given a user has multiple assessments, When they view the dashboard, Then assessments are sorted by last updated date (newest first)
- Given a user deletes their account, When the deletion completes, Then all their data is permanently removed within 30 days

#### F8: Assessment Comparison View

Side-by-side comparison of multiple assessments.

**User Story**: As a PM managing multiple AI features, I want to compare assessments side by side so that I can prioritize compliance efforts across my product portfolio.

**Acceptance Criteria**:

- Given a user has 2+ saved assessments, When they select 2-4 assessments and click "Compare", Then a comparison table displays showing: system name, risk level, applicable obligations (checkmarks), and key differences highlighted
- Given the comparison view is displayed, When the user views it, Then obligations present in one assessment but not another are visually highlighted

---

### P2 — Nice to Have, Ship Within 1 Month

#### F9: Compliance Timeline

A visual timeline showing the user when each obligation becomes enforceable.

**User Story**: As a user, I want to see when my specific obligations take effect so that I can plan my compliance roadmap.

**Acceptance Criteria**:

- Given a user views their results, When they click "View Timeline", Then a visual timeline shows key dates (Feb 2025 prohibited practices, Aug 2025 GPAI, Aug 2026 Annex III high-risk, Aug 2027 Annex I products) with the user's relevant dates highlighted
- Given the current date is before a deadline, When the timeline renders, Then the upcoming deadline shows a countdown (e.g., "127 days remaining")
- Given the current date is past a deadline, When the timeline renders, Then that deadline shows "In effect" with a checkmark

#### F10: Email Deadline Reminders

Opt-in email notifications for upcoming compliance deadlines.

**User Story**: As a user, I want to receive email reminders before my compliance deadlines so that I don't miss critical dates.

**Acceptance Criteria**:

- Given a user has an account and a saved assessment, When they toggle "Email Reminders" on, Then they receive emails at 90, 60, 30, and 7 days before each applicable deadline
- Given a user receives a reminder email, When they click the link, Then they are taken to their assessment results page
- Given a user toggles reminders off, When the toggle is saved, Then no further emails are sent

#### F11: Multi-Language Support (EN, DE, FR)

Questionnaire and results in the three most common EU business languages.

**User Story**: As a non-native English speaker, I want to use the tool in my language so that I can accurately understand and answer the questions.

**Acceptance Criteria**:

- Given a user visits the site, When they click the language selector, Then they can choose English, German, or French
- Given a user selects German, When the questionnaire loads, Then all questions, answers, results, and obligation descriptions are displayed in German
- Given a user switches language mid-assessment, When the language changes, Then their progress is preserved and the current question re-renders in the new language

#### F12: API Access

A public API for programmatic access to the classification engine.

**User Story**: As a developer, I want to call the classification engine via API so that I can integrate compliance checking into my CI/CD pipeline or internal tools.

**Acceptance Criteria**:

- Given a developer sends a POST request to /api/v1/classify with valid answers JSON, When the server processes it, Then it returns a JSON response with: risk_level, applicable_obligations[], cited_articles[], and badge_url
- Given a developer sends invalid or incomplete answers, When the server validates, Then it returns a 422 error with specific field-level validation messages
- Given the API is called without an API key, When rate limiting is checked, Then anonymous requests are limited to 10/hour per IP
- Given a developer has an account, When they generate an API key from their dashboard, Then authenticated requests are limited to 100/hour

---

## 4. Non-Functional Requirements

### Performance

- Questionnaire page load: < 1.5 seconds on 3G
- Question transition: < 100ms (no server round-trip — all logic runs client-side)
- PDF generation: < 3 seconds
- Badge SVG response: < 200ms
- Lighthouse score: > 90 on all metrics

### Security

- All traffic over HTTPS
- No PII collected during anonymous assessments (answers stored in localStorage only)
- Accounts: passwords hashed with bcrypt (cost factor 12), sessions via HTTP-only secure cookies
- API keys: hashed before storage, displayed once on creation
- CSRF protection on all state-changing endpoints
- Rate limiting on all API routes (10/min anonymous, 60/min authenticated)
- Input validation via Zod on both client and server

### Browser Support

- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Mobile: iOS Safari 15+, Chrome for Android 90+
- Progressive enhancement — core questionnaire works without JavaScript via URL state (stretch goal)

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigable questionnaire
- Screen reader compatible (proper ARIA labels, live regions for dynamic content)
- Color contrast ratios meet AA standards (4.5:1 for normal text)

### Legal

- Prominent disclaimer on every results page: "This tool provides informational guidance only and does not constitute legal advice. Consult a qualified legal professional for compliance decisions."
- Privacy policy and terms of service pages
- GDPR-compliant data handling (minimal collection, right to deletion, cookie consent for non-essential cookies)

---

## 5. Monetization Model

### Phase 1: Free (Launch — Month 3)

Everything is free. Build traffic, establish credibility, collect usage data.

### Phase 2: Freemium (Month 3+)

| Feature                 | Free         | Pro ($29/mo)   |
| ----------------------- | ------------ | -------------- |
| Risk classification     | Unlimited    | Unlimited      |
| Obligation checklist    | Full         | Full           |
| Badge URL               | 1 system     | Unlimited      |
| PDF export              | 1/month      | Unlimited      |
| Documentation templates | Preview only | Full download  |
| Saved assessments       | Up to 3      | Unlimited      |
| Assessment comparison   | No           | Yes            |
| API access              | No           | 1,000 calls/mo |
| Email reminders         | No           | Yes            |
| Priority support        | No           | Yes            |

### Phase 3: Team Plan (Month 6+)

$99/mo for up to 10 users. Shared dashboard, team assessment library, audit log.

---

## 6. Success Metrics

| Metric                                          | Target (Month 1) | Target (Month 3) | Target (Month 6) |
| ----------------------------------------------- | ---------------- | ---------------- | ---------------- |
| Monthly unique visitors                         | 5,000            | 20,000           | 50,000           |
| Assessments completed                           | 2,000            | 10,000           | 30,000           |
| Completion rate (start to result)               | > 70%            | > 75%            | > 80%            |
| Average time to complete                        | < 4 minutes      | < 3.5 minutes    | < 3 minutes      |
| Badge embeds (external sites)                   | 100              | 1,000            | 5,000            |
| Accounts created                                | 200              | 2,000            | 8,000            |
| Pro conversions                                 | N/A (free phase) | 50               | 300              |
| Monthly recurring revenue                       | $0               | $1,450           | $8,700           |
| SEO: ranking for "EU AI Act compliance checker" | Top 20           | Top 10           | Top 5            |

---

## 7. Out of Scope for V1

- **Real-time regulation monitoring** — tracking amendments and updates to the Act
- **Conformity assessment management** — full workflow for managing the assessment process
- **Integration with GRC platforms** — connections to OneTrust, Vanta, etc.
- **AI system inventory/registry** — full catalog management beyond saved assessments
- **Consulting marketplace** — connecting users with compliance consultants
- **Audit trail for regulators** — evidence collection and submission workflows
- **GPAI-specific deep assessment** — detailed compute threshold analysis, systemic risk evaluation
- **Custom compliance frameworks** — support for non-EU regulations (NIST AI RMF, etc.)
- **White-label/embed version** — embeddable widget for other SaaS platforms
- **Native mobile app**
