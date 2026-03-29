# EU AI Act Compliance Checker — User Flows

---

## Persona 1: Sarah — Startup CTO

### Entry Point
Sarah Googles "EU AI Act compliance check free" and clicks the organic result to `/`. Alternatively, she sees a compliance badge on a competitor's site, clicks it, and lands on the badge detail page which links back to `/`.

### First Impression (5 seconds)
She sees:
- **Headline**: "Is Your AI Product EU Compliant? Find Out in 3 Minutes — Free"
- **Subhead**: "Answer 12 questions. Get your risk classification, obligation checklist, and shareable compliance badge."
- **Countdown**: "127 days until EU AI Act enforcement (Aug 2, 2026)" in an orange banner
- **CTA**: Large green button — "Start Free Assessment"
- **Trust signals**: "12,847 assessments completed" counter, "No signup required"

She immediately understands: free tool, fast, tells me what I need to do.

### Core Flow

**Step 1: Landing → Checker**
- Page: `/`
- Action: Clicks "Start Free Assessment"
- Result: Redirected to `/checker`
- Sees: Question 1 with progress bar at 0%, clean card layout, back button disabled

**Step 2: Question 1 — AI System Check**
- Page: `/checker`
- Action: Reads "Does your system use machine learning, operate with autonomy, and generate outputs that influence environments?" — selects "Yes"
- Result: Smooth transition to Question 2, progress bar advances
- Sees: Question 2 appears, progress bar at ~15%

**Step 3: Questions 2-4 — Role & Prohibited Practices**
- Action: Selects "Provider" (she builds the product), confirms no prohibited practices
- Result: Branching logic skips directly to domain questions (questions 5-7)
- Sees: Progress bar jumps (some questions were skipped by branching)

**Step 4: Questions 5-7 — Domain Classification**
- Action: Her AI customer support product doesn't fall under Annex I (not a safety component), but she selects "Essential Services" as domain and then "Evaluating customer eligibility" as function
- Result: Engine flags potential high-risk classification
- Sees: Question 8 — narrow task exception check

**Step 5: Questions 8-9 — Exception Check**
- Action: Selects "No" (not a narrow procedural task), and "Yes" (it profiles customer behavior)
- Result: Profiling nullifies any exception. Branching skips to transparency questions.
- Sees: Question 10

**Step 6: Questions 10-12 — Transparency**
- Action: Confirms it interacts with customers directly (chatbot), does not generate synthetic media, no emotion recognition
- Result: Assessment complete — all applicable questions answered
- Sees: "Calculating your results..." spinner (< 500ms)

**Step 7: Results Page**
- Page: `/checker/results`
- Sees:
  - **Large orange banner**: "HIGH RISK — Your AI system is classified as high-risk under the EU AI Act"
  - **Cited articles**: "Article 6(2), Annex III Category 5(a) — Essential Services: Evaluating eligibility"
  - **Obligation checklist**: 11 items, each expandable (Risk Management, Data Governance, etc.)
  - **Badge preview**: Orange shield SVG with "HIGH RISK · EU AI Act · Mar 2026"
  - **Action buttons**: "Download PDF", "Copy Badge URL", "Save Assessment"
  - **Disclaimer**: Gray banner at bottom with legal notice

**Step 8: Explore Obligations**
- Action: Clicks "Risk Management System (Art. 9)"
- Result: Section expands
- Sees: Plain-language summary, "What this means in practice: Document all identified risks for your customer support AI, implement testing procedures, and update risk assessments quarterly."

**Step 9: Download PDF**
- Action: Clicks "Download PDF"
- Result: Loading spinner on button (< 3 seconds), PDF downloads
- Sees: Button changes to "Downloaded ✓" for 3 seconds, then resets

**Step 10: Copy Badge**
- Action: Clicks "Copy Badge URL"
- Result: URL copied to clipboard
- Sees: Toast notification "Badge URL copied! Embed it with: `<img src=\"...\"`"

**Step 11: Save Assessment (triggers account creation)**
- Action: Clicks "Save Assessment"
- Result: Modal appears prompting signup
- Sees: "Save your assessment to track compliance over time" with email/password form and "Continue with Google" button
- Action: Clicks "Continue with Google", completes OAuth
- Result: Assessment linked to new account, redirected to `/checker/results/[id]`
- Sees: Same results page, now with "Saved ✓" badge, nav shows her name and dashboard link

### Loading States
- Question transitions: Instant (< 100ms, client-side only)
- Results calculation: Centered spinner with "Analyzing your AI system..." text
- PDF generation: Button shows spinner, text changes to "Generating PDF..."
- Badge copy: Button briefly shows checkmark icon

### Error States
- **Network error during assessment save**: Toast "Failed to save. Your results are still available locally." + retry button
- **PDF generation fails**: Toast "PDF generation failed. Try again." + retry button
- **OAuth popup blocked**: Inline message "Pop-up blocked. Please allow pop-ups for this site or use email/password instead."
- **Session expired on dashboard**: Redirect to `/auth/login` with message "Session expired. Please log in again." + redirect back after login

### Return Visit
Sarah returns 2 weeks later via `/dashboard`:
- Sees her saved assessment with "HIGH RISK" badge
- Can click to review full results
- "New Assessment" button to classify her second AI feature
- Assessment card shows "Last updated 14 days ago"

---

## Persona 2: Marcus — Product Manager at Mid-Market Company

### Entry Point
Marcus receives a link from his VP of Engineering in Slack: "Use this to classify our AI features before the August deadline." He clicks the link to `/`.

### First Impression (5 seconds)
Same landing page as Sarah. He focuses on "Answer 12 questions" (fast), "obligation checklist" (actionable), "documentation templates" (deliverable for his team).

### Core Flow

**Step 1: Create Account First**
- Page: `/`
- Action: Clicks "Start Free Assessment", then immediately notices "Save multiple assessments" mentioned, decides to create an account first
- Action: Clicks "Sign Up" in header
- Page: `/auth/register`
- Sees: Email/password form, "Continue with Google" button
- Action: Uses company Google account (SSO)
- Result: Account created, redirected to `/dashboard`

**Step 2: Empty Dashboard**
- Page: `/dashboard`
- Sees: Empty state — illustration of a clipboard with a checkmark, text: "No assessments yet. Classify your first AI system to get started.", large "New Assessment" button
- Action: Clicks "New Assessment"
- Result: Redirected to `/checker`

**Step 3: First Assessment — Resume Feature**
- Completes first assessment for "AI-Powered Search Ranking" — classified as **Minimal Risk**
- Page: `/checker/results/[id1]`
- Sees: Green banner "MINIMAL RISK", short obligation list (voluntary only), badge preview in green

**Step 4: Back to Dashboard, Second Assessment**
- Action: Clicks "Dashboard" in nav
- Page: `/dashboard`
- Sees: One assessment card — "AI-Powered Search Ranking · Minimal Risk · Just now"
- Action: Clicks "New Assessment"
- Completes for "AI Credit Scoring Module" — classified as **High Risk**
- Saves automatically (logged in)

**Step 5: Third and Fourth Assessments**
- Repeats for "AI Customer Churn Predictor" (Limited Risk) and "AI Recruitment Screener" (High Risk)
- Dashboard now shows 4 assessments

**Step 6: Compare Assessments**
- Page: `/dashboard`
- Action: Selects checkboxes on the two High Risk assessments + one Limited Risk, clicks "Compare"
- Page: `/dashboard/compare?ids=id2,id4,id3`
- Sees: Side-by-side table:
  - Columns: system name, risk level, each obligation as a row
  - High-risk systems have checkmarks for Art. 9-15, 17, 43, 49, 72
  - Limited risk system has checkmark only for Art. 50
  - Cells where obligations differ between systems are highlighted in yellow

**Step 7: Download Documentation Templates**
- Action: From the High Risk assessment detail page, scrolls to "Documentation Templates"
- Sees: 5 template cards with download buttons
- Action: Downloads "Technical Documentation (Annex IV)" template
- Result: Markdown file downloads with structured sections, placeholders, and article references

**Step 8: Generate PDF Reports for VP**
- Action: Downloads PDF for each High Risk assessment
- Result: Two PDFs ready to attach to Slack/email

### Loading States
- Dashboard: Skeleton cards while assessments load
- Comparison table: Skeleton grid while data loads
- Template download: Button spinner for 1-2 seconds

### Error States
- **Comparison with < 2 assessments selected**: Button disabled with tooltip "Select at least 2 assessments to compare"
- **Comparison with > 4 assessments**: Toast "Maximum 4 assessments for comparison. Please deselect some."
- **Template download fails**: Toast with retry

### Return Visit
Marcus returns monthly to check if anything has changed:
- Dashboard shows all 4 assessments with last-updated dates
- He re-runs the "AI Recruitment Screener" assessment to see if recent product changes affect the classification
- New assessment version created (old one preserved for audit trail)

---

## Persona 3: Elena — Freelance AI Developer

### Entry Point
Elena sees a compliance badge on a GitHub README: `![EU AI Act](https://euaicheck.com/api/badge/abc123)`. She clicks it, which opens `/checker/results/abc123` (the badge links to the assessment). She thinks "I need one of these for my client project."

### First Impression (5 seconds)
She's on someone else's results page (public badge view — shows only the risk level and a brief summary, not full details). She sees a CTA: "Check your own AI system — Start Free Assessment."

### Core Flow

**Step 1: Quick Assessment**
- Action: Clicks "Start Free Assessment" from the badge landing page
- Page: `/checker`
- Completes the questionnaire in 2 minutes (her client's chatbot is straightforward)
- Classification: **Limited Risk** (chatbot that interacts with people)

**Step 2: Results — Badge Focus**
- Page: `/checker/results`
- She scrolls past the obligation checklist (only transparency requirements — simple)
- Focuses on the badge section
- Sees: Yellow badge preview "LIMITED RISK · EU AI Act · Mar 2026"

**Step 3: Copy Badge**
- Action: Clicks "Copy Badge URL"
- Result: URL copied
- Sees: Toast with embed instructions: `<img src="https://euaicheck.com/api/badge/xyz789" alt="EU AI Act: Limited Risk">`
- Action: Also copies the Markdown version shown below: `![EU AI Act: Limited Risk](https://euaicheck.com/api/badge/xyz789)`

**Step 4: Done — No Account**
- Elena pastes the badge into her client's README and project landing page
- She does not create an account
- Her assessment is stored anonymously (linked to anonymousId cookie, expires in 90 days)

**Step 5: Badge Lives On**
- The badge URL is cached by CDN for 24 hours
- Even after Elena's cookie expires, the badge remains accessible (assessment persists in DB)
- Anyone viewing the client's landing page sees the yellow "Limited Risk" badge

### Loading States
- Badge preview: Skeleton shimmer for 200ms while SVG generates
- Copy button: Checkmark icon for 2 seconds after copy

### Error States
- **Cookie/localStorage cleared**: Anonymous assessment still accessible via direct URL `/checker/results` (data encoded in URL params for anonymous flow)
- **Badge URL for deleted assessment**: Returns a generic gray "Assessment Not Found" SVG (not a 404 error page — since it's in an `<img>` tag)

### Return Visit
Elena returns for a new client project 3 weeks later:
- No account, so dashboard is not available
- She simply navigates to `/checker` again and completes a new assessment
- Previous assessment is still accessible via the badge URL she already shared

---

## Empty States

### `/dashboard` — No Assessments
```
┌─────────────────────────────────────────┐
│                                         │
│         📋 (clipboard illustration)     │
│                                         │
│     No assessments yet                  │
│                                         │
│     Classify your first AI system       │
│     to see your compliance status       │
│     and obligations.                    │
│                                         │
│     [ Start New Assessment →  ]         │
│                                         │
│     Takes about 3 minutes               │
│                                         │
└─────────────────────────────────────────┘
```

### `/dashboard/compare` — No Query Params
```
┌─────────────────────────────────────────┐
│                                         │
│     Select assessments to compare       │
│                                         │
│     Go to your dashboard and select     │
│     2-4 assessments, then click         │
│     "Compare" to see them side by side. │
│                                         │
│     [ Go to Dashboard →  ]              │
│                                         │
└─────────────────────────────────────────┘
```

### `/dashboard/keys` — No API Keys
```
┌─────────────────────────────────────────┐
│                                         │
│     🔑 No API keys yet                 │
│                                         │
│     Create an API key to integrate      │
│     compliance checking into your       │
│     CI/CD pipeline or internal tools.   │
│                                         │
│     [ Generate API Key ]                │
│                                         │
│     Rate limit: 100 requests/hour       │
│                                         │
└─────────────────────────────────────────┘
```

### `/checker/results` — Direct Visit (No Assessment Data)
```
┌─────────────────────────────────────────┐
│                                         │
│     No assessment found                 │
│                                         │
│     Complete the questionnaire first    │
│     to get your EU AI Act risk          │
│     classification and obligations.     │
│                                         │
│     [ Start Assessment →  ]             │
│                                         │
└─────────────────────────────────────────┘
```

### Badge for Deleted/Missing Assessment
Returns an SVG (not an HTML error page):
```svg
<!-- Gray badge: "EU AI Act · Assessment Not Found" -->
```

---

## Error Recovery

### Authentication Failures
| Error | What User Sees | Recovery |
|-------|---------------|----------|
| Wrong password | Inline error: "Invalid email or password" | Clear password field, focus on it |
| OAuth popup blocked | Inline message: "Pop-up was blocked. Allow pop-ups or use email/password." | Link to email/password form |
| Session expired | Redirect to `/auth/login` with flash: "Your session expired. Log in to continue." | After login, redirect to previous page |
| Account already exists (OAuth) | Auto-link OAuth to existing account if email matches | Seamless — user doesn't notice |
| Email already registered | Inline error: "An account with this email already exists. Log in instead?" | Link to login page |

### Payment Failures (Phase 2+)
| Error | What User Sees | Recovery |
|-------|---------------|----------|
| Card declined | Modal: "Payment failed. Please check your card details." | Update card form in modal |
| Subscription expired | Banner on dashboard: "Your Pro plan expired. Free plan limits apply." | "Resubscribe" button in banner |

### API/Network Errors
| Error | What User Sees | Recovery |
|-------|---------------|----------|
| Assessment save fails | Toast: "Failed to save. Your results are available locally." | Retry button in toast; data preserved in localStorage |
| PDF generation timeout | Toast: "PDF is taking longer than expected. Try again." | Retry button |
| Rate limit hit | Toast: "Too many requests. Please wait a moment." | Auto-retry after backoff (displayed as countdown) |
| Server error (500) | Toast: "Something went wrong. We've been notified." | Retry button; error logged to monitoring |

### Data Loss Prevention
- **Mid-questionnaire refresh**: Progress restored from localStorage
- **Mid-questionnaire close**: Progress persisted; on return to `/checker`, prompt: "You have an assessment in progress. Resume or start over?"
- **Anonymous assessment + cookie clear**: Assessment still accessible via direct results URL (state encoded in URL params); badge URL still works (stored in DB)

---

## Seed Data

Pre-populated example assessments that appear on the landing page as "Example Classifications" and can be viewed (read-only) to demonstrate the tool's output.

### Seed Assessment 1: "Customer Support Chatbot"
- **Risk Level**: Limited
- **Role**: Provider
- **Domain**: N/A (not Annex III)
- **Key answers**: Is AI system (yes), provider, not GPAI, no prohibited practices, not safety component, no high-risk domain, interacts directly with people (yes), no synthetic content, no emotion recognition
- **Obligations**: Transparency disclosure (Art. 50) — must inform users they're interacting with AI
- **Use**: Landing page example, "See example" link

### Seed Assessment 2: "AI Resume Screening Tool"
- **Risk Level**: High
- **Role**: Provider
- **Domain**: Employment (Annex III, Category 4)
- **Key answers**: Is AI system (yes), provider, not GPAI, no prohibited practices, not safety component, domain = employment, function = recruitment screening, not narrow task, profiles persons (yes)
- **Obligations**: Full high-risk checklist (Art. 9-15, 17, 43, 49, 72)
- **Use**: Landing page example showing high-risk output

### Seed Assessment 3: "Spam Email Filter"
- **Risk Level**: Minimal
- **Role**: Deployer
- **Domain**: N/A
- **Key answers**: Is AI system (yes), deployer, not GPAI, no prohibited practices, not safety component, no high-risk domain, no direct interaction, no synthetic content, no emotion recognition
- **Obligations**: None mandatory; voluntary codes of conduct
- **Use**: Landing page example showing minimal risk — reassuring for users with simple AI

### Seed Assessment 4: "Facial Recognition for Building Access"
- **Risk Level**: High
- **Role**: Provider
- **Domain**: Biometrics (Annex III, Category 1)
- **Key answers**: Is AI system (yes), provider, not GPAI, no prohibited practices, not safety component, domain = biometrics, function = remote biometric identification, not narrow task, profiles persons (yes)
- **Obligations**: Full high-risk checklist + biometrics-specific notes
- **Use**: Demonstrates biometrics classification

### Seed Assessment 5: "AI Social Scoring System"
- **Risk Level**: Unacceptable (Prohibited)
- **Role**: Provider
- **Domain**: N/A (prohibited before domain reached)
- **Key answers**: Is AI system (yes), provider, prohibited practice = social scoring
- **Obligations**: BANNED — cannot be deployed in the EU
- **Use**: Demonstrates prohibited classification; educational purpose

### Seed Assessment 6: "AI-Generated Marketing Content Tool"
- **Risk Level**: Limited
- **Role**: Provider
- **Domain**: N/A
- **Key answers**: Is AI system (yes), provider, not GPAI, no prohibited practices, not safety component, no high-risk domain, interacts with people (yes), generates synthetic content (yes), no emotion recognition
- **Obligations**: Transparency (Art. 50) — must mark AI-generated content in machine-readable format
- **Use**: Common use case for startups

### Seed Assessment 7: "Medical Device AI Diagnostics"
- **Risk Level**: High
- **Role**: Provider
- **Domain**: Safety component (Annex I — medical devices)
- **Key answers**: Is AI system (yes), provider, not GPAI, no prohibited practices, IS safety component of regulated product (medical device)
- **Obligations**: Full high-risk checklist + conformity assessment per medical device regulation
- **Use**: Demonstrates Annex I pathway to high-risk

### Implementation Notes
- Seed assessments stored in `prisma/seed.ts` and loaded via `npx prisma db seed`
- Each has a stable, human-readable ID (e.g., `seed-chatbot`, `seed-resume-screener`)
- Displayed on landing page in a carousel/grid under "Example Classifications"
- Clicking an example opens `/checker/results/seed-chatbot` in read-only mode (no edit/delete buttons)
- Seed assessments are never counted in the "assessments completed" metric
