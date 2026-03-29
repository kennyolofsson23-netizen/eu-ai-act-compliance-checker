# TEST_PLAN.md — EU AI Act Compliance Checker

> Generated: 2026-03-29
> Coverage of SPEC.md acceptance criteria: **100%**
> Toolchain: Vitest · React Testing Library · Playwright · fast-check

---

## Table of Contents

1. [Test Strategy & Pyramid](#1-test-strategy--pyramid)
2. [Unit Tests](#2-unit-tests)
3. [Integration Tests](#3-integration-tests)
4. [End-to-End Tests](#4-end-to-end-tests)
5. [Property-Based Tests](#5-property-based-tests)
6. [Coverage Targets](#6-coverage-targets)
7. [SPEC.md Acceptance Criteria Traceability](#7-specmd-acceptance-criteria-traceability)

---

## 1. Test Strategy & Pyramid

### Rationale

The EU AI Act Compliance Checker has three distinct layers of complexity that dictate the pyramid shape:

| Layer | Why it dominates here |
|---|---|
| **Unit (60%)** | The classification engine (`classifier.ts`), obligation mapper (`obligations.ts`), and questionnaire branching (`questions.ts`) are pure-function business logic — the entire legal correctness of the product lives here. Bugs here cause wrong legal advice. |
| **Integration (25%)** | Every API route handles auth, Zod validation, rate-limiting, and DB writes simultaneously. These interactions must be tested together, not mocked into meaninglessness. |
| **E2E (15%)** | Five critical user flows (complete questionnaire, download PDF, copy badge, save to account, share result) must work across real browsers. Kept lean because the UI is thin over the classification engine. |

```
        ▲
       /E2E\          ~15%   Playwright  — 9 flows × ~4 scenarios each
      /──────\
     / Integr \        ~25%   Vitest + supertest — 11 API routes
    /──────────\
   /    Unit    \      ~60%   Vitest — classifier, obligations, questions,
  /──────────────\            validation schemas, badge SVG, PDF builder
  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
```

### Tools & Configuration

```
src/
  __tests__/
    unit/
    integration/
    property/
  e2e/              # Playwright tests
vitest.config.ts    # unit + integration
playwright.config.ts
```

**Vitest config highlights**
- Environment: `jsdom` for component tests, `node` for API route tests
- Setup file: `src/__tests__/setup.ts` — MSW server, Prisma mock, `vi.mock` stubs
- Coverage provider: `v8`

**Playwright config highlights**
- Browsers: Chromium, Firefox, WebKit (covers Chrome/Firefox/Safari/Edge per SPEC §NFR-2)
- Base URL: `http://localhost:3000` (CI) / staging URL (pre-prod)
- `data-testid` selectors preferred over CSS/text selectors

---

## 2. Unit Tests

### 2.1 `src/lib/classifier.ts`

**What to test:** Every branch of the classification decision tree. This is the highest-value module — a wrong output gives legally incorrect advice.

#### Test file: `src/__tests__/unit/classifier.test.ts`

```
classify()
  ├── Prohibited practices (Q4 answers)
  │   ├── returns "unacceptable" for each of the 6 prohibited-practice answers
  │   ├── short-circuits — does NOT evaluate subsequent questions
  │   └── role is irrelevant when prohibited (provider AND deployer both → unacceptable)
  │
  ├── High-risk — Annex II safety component (Q5 = yes)
  │   ├── returns "high-risk" regardless of domain/function
  │   └── all roles (provider / deployer / importer / distributor) → high-risk
  │
  ├── High-risk — Domain × Function matrix (Q6 + Q7)
  │   ├── each of the 8 high-risk domains paired with a qualifying function → high-risk
  │   ├── high-risk domain + non-qualifying function → limited-risk or minimal
  │   └── non-high-risk domain → does NOT trigger high-risk path
  │
  ├── High-risk — profiles individuals (Q9 = yes)
  │   ├── profiling in any domain → high-risk
  │   └── profiling = false + other non-qualifying answers → not high-risk
  │
  ├── Narrow procedural task override (Q8 = yes)
  │   ├── "narrow procedural" overrides domain match → limited or minimal
  │   └── narrow procedural does NOT override prohibited or Annex II
  │
  ├── Limited-risk triggers (Q10, Q11, Q12)
  │   ├── interacts with people (Q10=yes) → limited-risk
  │   ├── generates synthetic content (Q11=yes) → limited-risk
  │   ├── emotion recognition (Q12=yes) → limited-risk
  │   └── all three false → minimal
  │
  ├── "Not an AI system" (Q1 = no)
  │   └── returns "not-applicable" immediately
  │
  └── GPAI model (Q3 = yes)
      ├── no prohibited flags → "gpai" classification
      └── GPAI + prohibited practice → "unacceptable" (prohibited wins)
```

**Edge cases**
- All 12 questions answered with every permutation that straddles two risk levels
- Q4 prohibited answer combined with Q3 GPAI = yes → unacceptable
- Q8 narrow-procedural = yes AND Q5 Annex II = yes → high-risk (Annex II wins)
- Unknown/missing answer keys → throws typed `ClassificationError`, never returns wrong risk
- Role `"distributor"` with high-risk domain → high-risk (distributor is still in scope)

**Mock boundaries:** None. `classify()` is a pure function — zero mocks needed.

---

### 2.2 `src/lib/obligations.ts`

**What to test:** Every risk level × role combination produces the correct obligation set with the right article references.

#### Test file: `src/__tests__/unit/obligations.test.ts`

```
getObligations()
  ├── high-risk + provider
  │   ├── returns exactly 11 obligations
  │   ├── each obligation has: id, title, articleRef, description, priority
  │   └── articleRefs include: Art.9, Art.10, Art.11, Art.12, Art.13, Art.14,
  │                            Art.15, Art.17, Art.43, Art.49, Art.72
  │
  ├── high-risk + deployer
  │   ├── returns exactly 2 obligations
  │   └── articleRefs include: Art.14 (human oversight), Art.27 (FRIA)
  │
  ├── high-risk + importer / distributor
  │   ├── subset of provider obligations (due diligence)
  │   └── does NOT include Art.49 (registration — provider only)
  │
  ├── limited-risk + any role
  │   ├── returns exactly 1 obligation
  │   └── articleRef = Art.50 (transparency to users)
  │
  ├── unacceptable + any role
  │   ├── returns exactly 1 obligation
  │   └── description references Art.5 and cessation requirement
  │
  ├── gpai + provider
  │   ├── returns GPAI-specific obligations (Art.53, Art.55 for systemic-risk models)
  │   └── distinguishes general GPAI from systemic-risk GPAI
  │
  ├── minimal + any role
  │   └── returns empty array (no mandatory obligations)
  │
  └── not-applicable
      └── returns empty array
```

**Edge cases**
- Passing an unknown riskLevel string → throws, never silently returns wrong obligations
- All obligations have non-empty `title`, `description`, and valid `articleRef` format (`/^Art\.\d+/`)
- No duplicate obligation IDs within a single result set

**Mock boundaries:** None. Pure function.

---

### 2.3 `src/lib/questions.ts`

**What to test:** The 12 question definitions and their branching/skip logic.

#### Test file: `src/__tests__/unit/questions.test.ts`

```
Question definitions
  ├── exactly 12 questions defined
  ├── each question has: id (q1–q12), text, options[], helpText
  ├── no duplicate question IDs
  └── all option values are valid string literals (not undefined)

getNextQuestion()
  ├── Q1 = "no" → jumps to result (not-applicable), skips Q2–Q12
  ├── Q4 = any prohibited answer → jumps to result (unacceptable), skips Q5–Q12
  ├── Q3 = "yes" (GPAI) → skips Q5–Q9 (domain/function questions)
  ├── Q8 = "yes" (narrow procedural) → skips Q9
  ├── linear progression when no skip conditions met: Q1→Q2→…→Q12
  └── after Q12 → returns null (questionnaire complete)

isQuestionRequired()
  ├── Q5 skipped when Q3 = "yes"
  ├── Q6–Q9 skipped when Q3 = "yes" OR Q5 = "yes" (safety component)
  ├── Q9 skipped when Q8 = "yes"
  └── Q10–Q12 always shown (limited-risk transparency triggers)

Progress calculation
  ├── 0 answers → 0%
  ├── after Q1 answered → calculates based on expected remaining questions
  ├── Q4 = prohibited → jumps to 100% (terminal state)
  └── Q12 answered → 100%
```

**Edge cases**
- Answering questions out of order (stale localStorage) → state rehydration produces valid next-question
- All options for all questions are answered — no infinite loop in traversal
- `getNextQuestion` called with complete answer set → returns `null`, not an error

**Mock boundaries:** None. Pure data + pure functions.

---

### 2.4 `src/components/checker/QuestionnaireProvider.tsx`

**What to test:** React context state management, localStorage persistence, and branching evaluation in the UI layer.

#### Test file: `src/__tests__/unit/QuestionnaireProvider.test.tsx`

```
State management
  ├── initial state: currentQuestionId = "q1", answers = {}, progress = 0
  ├── answerQuestion(qId, value) → updates answers map correctly
  ├── answerQuestion triggers re-evaluation of nextQuestionId
  ├── goBack() → restores previous question, does NOT clear the answer
  ├── reset() → clears all answers, returns to q1, clears localStorage
  └── isComplete = true only when all required questions are answered

localStorage persistence
  ├── answers written to localStorage after each answerQuestion call
  ├── provider initializes from localStorage on mount (page reload simulation)
  ├── corrupted localStorage JSON → provider initializes fresh, does NOT crash
  └── localStorage cleared on reset()

Context value shape
  ├── useQuestionnaire() outside provider → throws descriptive error
  └── all context values (answers, progress, currentQuestion, goBack, reset) present
```

**Mock boundaries:**
- `localStorage` → `vi.stubGlobal('localStorage', createLocalStorageMock())`
- `classify` / `getObligations` → do NOT mock (real logic keeps tests honest)

---

### 2.5 `src/components/checker/QuestionCard.tsx`

**What to test:** Rendering and interaction for each question type (single-select radio).

#### Test file: `src/__tests__/unit/QuestionCard.test.tsx`

```
Rendering
  ├── renders question text and helpText
  ├── renders all options as radio inputs
  ├── selected option is visually marked (aria-checked or checked)
  └── "Back" button absent on Q1, present on Q2+

Interaction
  ├── clicking an option calls onAnswer(questionId, optionValue)
  ├── clicking Back calls onBack()
  ├── keyboard: Space/Enter on focused option triggers selection
  └── no double-submit: rapid double-click only calls onAnswer once

Accessibility
  ├── fieldset + legend wraps options (screen reader grouping)
  ├── each option has associated label (htmlFor / aria-labelledby)
  ├── focus returns to first option when question changes
  └── role="radiogroup" present
```

**Mock boundaries:**
- `onAnswer` / `onBack` → `vi.fn()` callback props

---

### 2.6 `src/components/results/` — Badge & PDF builders

#### Test file: `src/__tests__/unit/badge.test.ts`

```
generateBadgeSVG()
  ├── returns valid SVG string (starts with <svg, ends with </svg>)
  ├── color matches risk level:
  │     red=unacceptable, orange=high-risk, yellow=limited-risk,
  │     green=minimal, blue=gpai
  ├── contains the risk level label text
  ├── contains the unique assessment ID in the badge URL
  └── SVG is well-formed — parse with DOMParser, assert no parser errors

Badge URL uniqueness
  ├── two different assessmentIds produce two different URLs
  └── URL format: /badge/{assessmentId} (matches ARCHITECTURE route)
```

#### Test file: `src/__tests__/unit/pdf.test.ts`

```
buildPdfDocument()
  ├── returns a valid @react-pdf/renderer Document element (not null/undefined)
  ├── includes company name when provided
  ├── includes risk level and color-coded styling
  ├── includes all obligations (title + articleRef) for high-risk result
  ├── includes disclaimer text
  ├── includes generation date
  └── handles empty obligations array (minimal risk) without crashing
```

**Mock boundaries:**
- Use `@react-pdf/renderer`'s `renderToString()` for content assertions; avoid binary PDF comparison

---

### 2.7 `src/lib/validation/schemas.ts`

#### Test file: `src/__tests__/unit/schemas.test.ts`

```
assessmentCreateSchema
  ├── valid payload → passes, returns typed object
  ├── missing `answers` field → ZodError with path "answers"
  ├── answers with extra unknown keys → stripped (strict mode) or ZodError
  ├── answers.q1 not in allowed enum values → ZodError
  └── companyName > 255 chars → ZodError

registerSchema
  ├── valid email + strong password → passes
  ├── invalid email format → ZodError on "email"
  ├── password < 8 chars → ZodError on "password"
  └── missing fields → ZodError with correct paths

apiKeyCreateSchema
  ├── valid name (1–64 chars) → passes
  ├── empty string name → ZodError
  └── name > 64 chars → ZodError
```

---

## 3. Integration Tests

**Setup for all integration tests:**
- Prisma: use in-memory SQLite (`:memory:`) with `prisma.$disconnect()` teardown; seed fixtures in `beforeEach`
- Auth: inject session via `getServerSession` mock or test-specific JWT
- Rate limiter: mock Upstash Redis client to return non-limited by default; override per test

### 3.1 `POST /api/assessments`

#### Test file: `src/__tests__/integration/api/assessments-create.test.ts`

```
Happy paths
  ├── anonymous user: valid answers payload
  │   → 201, body.id present, body.riskLevel in valid enum,
  │     body.obligations is array, anonymousId cookie set (HttpOnly)
  │
  ├── authenticated user: valid answers + session
  │   → 201, body.userId = session.user.id, stored in DB with userId
  │
  └── GPAI model answers
      → 201, riskLevel = "gpai", correct GPAI obligations returned

Auth & authorization
  ├── no session (anonymous) → 201 (anonymous assessments allowed)
  └── malformed Authorization header → ignored, treated as anonymous

Validation errors
  ├── missing `answers` field → 400, body.error describes field
  ├── q1 = "not-a-real-option" → 400 ZodError
  ├── extra unknown fields in body → 400 or stripped (per schema config)
  └── body is not JSON → 400

Rate limiting
  ├── 11th request within window from same IP → 429, Retry-After header set
  └── requests from different IPs are not cross-limited

Database
  ├── assessment record created with correct answers JSON blob
  ├── AssessmentEvent record created (analytics) with eventType="created"
  └── DB write failure → 500, error not leaked in response body
```

---

### 3.2 `GET /api/assessments`

#### Test file: `src/__tests__/integration/api/assessments-list.test.ts`

```
Happy paths
  ├── authenticated user with 3 assessments → 200, returns array of 3
  ├── authenticated user with 0 assessments → 200, returns []
  └── pagination: ?page=2&limit=10 → correct slice returned

Auth
  ├── unauthenticated → 401
  └── user A cannot see user B's assessments (isolation check)

Response shape
  └── each item has: id, riskLevel, createdAt, companyName (nullable)
      — does NOT include raw answers (PII protection)
```

---

### 3.3 `GET /api/assessments/[id]`

#### Test file: `src/__tests__/integration/api/assessments-get.test.ts`

```
Happy paths
  ├── owner (authenticated) fetching own assessment → 200, full detail
  ├── anonymous assessment via matching anonymousId cookie → 200
  └── response includes riskLevel, obligations, answers, createdAt

Auth & authorization
  ├── authenticated user fetching another user's assessment → 403
  ├── anonymous user without matching cookie → 403
  ├── unauthenticated + no cookie → 403
  └── non-existent assessmentId → 404

Response shape
  └── obligations array items have: id, title, articleRef, description
```

---

### 3.4 `PATCH /api/assessments/[id]`

#### Test file: `src/__tests__/integration/api/assessments-update.test.ts`

```
Happy paths
  └── owner updates companyName → 200, updated record returned

Auth & authorization
  ├── unauthenticated → 401
  └── non-owner → 403

Validation
  ├── companyName > 255 chars → 400
  └── attempting to overwrite riskLevel directly → field ignored or 400
```

---

### 3.5 `DELETE /api/assessments/[id]`

#### Test file: `src/__tests__/integration/api/assessments-delete.test.ts`

```
Happy paths
  └── owner deletes own assessment → 204, record gone from DB

Auth & authorization
  ├── unauthenticated → 401
  └── non-owner → 403

Edge cases
  └── already deleted (double-delete) → 404
```

---

### 3.6 `GET /api/badge/[id]`

#### Test file: `src/__tests__/integration/api/badge.test.ts`

```
Happy paths
  ├── valid assessmentId → 200, Content-Type: image/svg+xml
  ├── response SVG contains correct risk-level color
  └── Cache-Control header present (edge caching per ARCHITECTURE)

Error cases
  └── non-existent assessmentId → 404

Response validation
  ├── SVG is parseable XML (no malformed markup)
  └── no user PII embedded in SVG (only risk level + ID)

SPEC §F3 traceability
  ├── color coding: unacceptable=red, high-risk=orange,
  │   limited-risk=yellow, minimal=green, gpai=blue
  └── badge URL is stable (same assessmentId → same SVG structure on re-request)
```

---

### 3.7 `GET /api/assessments/[id]/pdf`

#### Test file: `src/__tests__/integration/api/pdf.test.ts`

```
Happy paths
  ├── owner requests PDF → 200, Content-Type: application/pdf
  ├── binary response is a valid PDF (starts with %PDF-)
  └── response time < 3000ms (SPEC §NFR-1 performance requirement)

Auth & authorization
  ├── unauthenticated → 401
  └── non-owner → 403

Error cases
  └── non-existent assessmentId → 404

SPEC §F4 traceability
  └── PDF generation completes within 3s SLA
```

---

### 3.8 `POST /api/auth/register`

#### Test file: `src/__tests__/integration/api/auth-register.test.ts`

```
Happy paths
  ├── valid email + password → 201, user created in DB
  ├── password stored as bcrypt hash (not plaintext) in DB
  └── response does NOT include password or hash

Validation
  ├── duplicate email → 409 Conflict
  ├── invalid email format → 400
  ├── password < 8 chars → 400
  └── missing fields → 400

Security
  ├── password never appears in response body
  └── duplicate email check doesn't reveal timing difference
         (bcrypt compare used regardless to prevent user enumeration)
```

---

### 3.9 `POST /api/keys` & `DELETE /api/keys/[id]`

#### Test file: `src/__tests__/integration/api/api-keys.test.ts`

```
POST /api/keys
  ├── authenticated user creates key → 201, returns { id, key, name, createdAt }
  ├── raw key value returned ONLY at creation time (not retrievable later)
  ├── key stored as hash in DB
  └── unauthenticated → 401

DELETE /api/keys/[id]
  ├── owner deletes key → 204
  ├── non-owner → 403
  └── non-existent → 404
```

---

### 3.10 `POST /api/v1/classify` (Public API)

#### Test file: `src/__tests__/integration/api/public-classify.test.ts`

```
Happy paths
  ├── valid API key in Authorization: Bearer header + valid answers
  │   → 200, { riskLevel, obligations }
  └── minimal answers (Q1=no) → 200, riskLevel="not-applicable"

Authentication
  ├── missing Authorization header → 401
  ├── invalid/revoked API key → 401
  └── malformed Bearer token → 401

Validation
  ├── missing answers → 400
  └── invalid answer values → 400

Rate limiting
  ├── 101st request within window (100 req/min per ARCHITECTURE)
  │   → 429, X-RateLimit-Remaining: 0, Retry-After header present
  └── different API keys have independent rate-limit buckets

SPEC §F12 traceability (parity test)
  └── public API returns same riskLevel as the UI questionnaire
      for equivalent answer sets (same inputs → same output)
```

---

### 3.11 `GET /api/templates/[templateId]`

#### Test file: `src/__tests__/integration/api/templates.test.ts`

```
Happy paths
  ├── valid templateId → 200, Content-Disposition: attachment; filename="*.md"
  ├── body is valid Markdown (non-empty, contains headings)
  └── covers: risk-management-system, technical-documentation,
              data-governance, transparency-notice

Error cases
  ├── unknown templateId → 404
  └── unauthenticated (if Pro-gated) → 401 or 403

SPEC §F6 traceability
  └── at least one template per major high-risk obligation category
```

---

## 4. End-to-End Tests

**Tooling:** Playwright with `data-testid` selectors.
**Fixtures:** Seeded test DB; test account (`test@example.com` / `TestPass123!`)
**Viewport:** 1280×800 desktop default; mobile (`375×812`) noted where required.

### Required `data-testid` attributes

These must be added to components before E2E tests can run:

| Component | `data-testid` |
|---|---|
| Hero heading | `hero-heading` |
| Question card container | `question-card` |
| Question text | `question-text` |
| Option button/radio | `option-{value}` |
| Back button | `back-button` |
| Progress bar | `progress-bar` |
| Results container | `results-container` |
| Risk level badge | `risk-level-badge` |
| Obligation list | `obligations-list` |
| Obligation item | `obligation-item` |
| Download PDF button | `btn-download-pdf` |
| Copy badge URL button | `btn-copy-badge` |
| Share URL field | `share-url-input` |
| Save to account button | `btn-save-assessment` |
| Dashboard assessment row | `assessment-row-{id}` |

---

### 4.1 E2E Flow 1 — Anonymous Assessment → Minimal Risk

**SPEC coverage:** F1 (questionnaire), F2 (obligations), F5 (landing page CTA)

```
File: e2e/flows/anonymous-minimal.spec.ts

Scenario: "Solo developer builds narrow NLP tool, gets minimal risk"

Steps:
  1.  Navigate to /
      → data-testid="hero-heading" visible
      → "Start Free Assessment" CTA button visible
  2.  Click CTA → URL changes to /checker
  3.  Q1 (Is it an AI system?): click option-yes
      → Q2 appears, progress-bar width > 0%
  4.  Q2 (Role?): click option-provider
  5.  Q3 (GPAI?): click option-no
  6.  Q4 (Prohibited practices?): click option-none-of-the-above
  7.  Q5 (Safety component?): click option-no
  8.  Q6 (Domain?): click option-other (non-high-risk)
  9.  Q7 (Function?): click option-recommendation
  10. Q8 (Narrow procedural?): click option-yes
  11. Q10 (Interacts with people?): click option-no
  12. Q11 (Synthetic content?): click option-no
  13. Q12 (Emotion recognition?): click option-no
      → progress-bar = 100%
      → results-container visible
  14. Assert risk-level-badge text contains "Minimal"
  15. Assert obligations-list has 0 items
  16. Assert no error messages visible

Mobile variant (375×812):
  → Repeat steps 1–16
  → All interactive elements reachable without horizontal scroll (no overflow-x)
```

---

### 4.2 E2E Flow 2 — High-Risk Assessment → Full Obligation Checklist

**SPEC coverage:** F1 (branching), F2 (obligations with article refs)

```
File: e2e/flows/high-risk-obligations.spec.ts

Scenario: "HR software company gets high-risk classification"

Steps:
  1.  Navigate to /checker
  2.  Q1: option-yes
  3.  Q2: option-provider
  4.  Q3: option-no
  5.  Q4: option-none-of-the-above
  6.  Q5: option-no
  7.  Q6: option-employment  (high-risk domain)
  8.  Q7: option-decision-making  (qualifying function)
  9.  Q8: option-no  (not narrow procedural)
  10. Q9: option-yes  (profiles individuals)
  11. Q10–Q12: any values  (already high-risk)
      → results-container visible
  12. Assert risk-level-badge contains "High Risk"
  13. Assert obligations-list has ≥ 11 obligation-item elements
  14. Assert at least one obligation-item text contains "Art.9"
  15. Assert at least one obligation-item text contains "Art.14"
  16. Assert at least one obligation-item text contains "Art.49"
  17. Assert each obligation-item has a non-empty plain-language description
      (text length > article reference alone)

Back navigation:
  18. Navigate back to /checker fresh
  19. Answer through to Q7, then press back-button
      → Q6 re-appears with previous answer still selected
```

---

### 4.3 E2E Flow 3 — Prohibited Practice → Hard Stop

**SPEC coverage:** F1 (prohibited practice short-circuit)

```
File: e2e/flows/prohibited-practice.spec.ts

Scenario: "Social scoring system gets immediate unacceptable classification"

Steps:
  1. Navigate to /checker
  2. Q1: option-yes
  3. Q2: option-provider
  4. Q3: option-no
  5. Q4: click a prohibited practice option (e.g., option-social-scoring)
     → Q5 does NOT appear (short-circuit confirmed: no question-card with id q5)
     → progress-bar = 100%
     → results-container visible immediately
  6. Assert risk-level-badge contains "Unacceptable"
  7. Assert obligations-list contains 1 item referencing "Art.5"
  8. Assert risk-level-badge has red color styling
     (CSS class or computed color matches constants.ts RISK_COLORS.unacceptable)
  9. Assert btn-download-pdf is visible
     (prohibited systems still get a PDF for documentation)
```

---

### 4.4 E2E Flow 4 — PDF Download

**SPEC coverage:** F4 (PDF export, < 3s)

```
File: e2e/flows/pdf-download.spec.ts

Scenario: "User completes high-risk assessment and downloads PDF"

Setup: Use Flow 2 steps to reach results page with high-risk result

Steps:
  1. Locate btn-download-pdf on results page
  2. Set up Playwright download listener
  3. Click btn-download-pdf
     → Loading/spinner indicator appears
  4. Wait for download event (timeout: 3000ms — SPEC §NFR-1)
  5. Assert downloaded file:
     - Filename matches /compliance-report.*\.pdf/i
     - File size > 5 KB (not empty/truncated)
     - File first bytes = "%PDF-" (valid PDF magic number)
  6. Assert no error toast appeared during download

Performance assertion:
  → Record timestamp before click; assert download-start within 3000ms
```

---

### 4.5 E2E Flow 5 — Badge Generation & Sharing

**SPEC coverage:** F3 (shareable badge, color coding, stable URL, publicly accessible)

```
File: e2e/flows/badge-sharing.spec.ts

Scenario: "User copies badge URL after completing assessment"

Setup: Complete any assessment to reach results page

Steps:
  1. Locate badge preview SVG on results page
  2. Assert SVG is visible and uses correct color for the risk level
     (check fill attribute matches RISK_COLORS constant)
  3. Click btn-copy-badge
     → Playwright reads clipboard
  4. Assert clipboard content matches: /https?:\/\/.*\/badge\/[a-z0-9-]+/
  5. Navigate to the badge URL directly (new page)
     → Response status 200
     → Content-Type includes "image/svg+xml"
     → SVG renders in browser (svg element in DOM)
  6. Reload badge URL → identical SVG content (deterministic/cached)
  7. Assert badge URL requires no authentication
     (open in incognito context → still 200)
```

---

### 4.6 E2E Flow 6 — Registration & Saved Assessments

**SPEC coverage:** F7 (user accounts), F8 (comparison view)

```
File: e2e/flows/auth-save-assessment.spec.ts

Scenario: "New user registers, saves assessment, finds it in dashboard"

Steps:
  1.  Navigate to /register
  2.  Fill email (unique: `test+${Date.now()}@example.com`) and password
  3.  Submit → redirect to /dashboard or /checker, no error
  4.  Complete a high-risk assessment (via questionnaire or API seed)
  5.  Click btn-save-assessment on results page
      → Success toast: "Assessment saved"
  6.  Navigate to /dashboard
  7.  Assert assessment-row-{id} appears in the list
  8.  Assert row displays: risk level, creation date
  9.  Click the row → navigates to /assessments/{id}
  10. Assert full results restored (same risk-level-badge, same obligations count)

Persistence across sessions:
  11. Log out
  12. Log back in with same credentials
  13. Navigate to /dashboard → same assessment row still present

SPEC §F8 — Comparison View (P1):
  14. Complete a second (different risk level) assessment and save
  15. Select both assessment rows via checkboxes
  16. Click "Compare" button
  17. Assert side-by-side comparison table visible with both risk levels
```

---

### 4.7 E2E Flow 7 — Accessibility Audit

**SPEC coverage:** NFR-3 (WCAG 2.1 AA)

```
File: e2e/accessibility/wcag.spec.ts

Pages audited:
  - / (landing)
  - /checker (each of: fresh, mid-questionnaire, results)
  - /dashboard (authenticated)

Per page:
  1. Run @axe-core/playwright
  2. Assert 0 violations with impact "critical" or "serious"
  3. Assert all images have alt text (axe rule: image-alt)
  4. Assert color contrast ≥ 4.5:1 for normal text (axe rule: color-contrast)
  5. Assert all form controls have associated labels

Keyboard-only navigation:
  1. Navigate to /checker — mouse disabled (keyboard only)
  2. Tab to first option → Space to select → assert Q2 appears
  3. Complete full questionnaire keyboard-only → results page reached
  4. Tab to btn-download-pdf → Enter → download initiates
```

---

### 4.8 E2E Flow 8 — SEO & Structured Data

**SPEC coverage:** F5 (landing page SEO, page load < 1.5s)

```
File: e2e/seo/landing-seo.spec.ts

Steps:
  1.  Navigate to / and capture performance timing
  2.  Assert DOMContentLoaded < 1500ms (SPEC §NFR-1)
  3.  Assert <title> contains "EU AI Act" (case-insensitive)
  4.  Assert meta[name="description"] content length 50–160 chars
  5.  Assert og:title, og:description, og:url meta tags present
  6.  Assert canonical <link rel="canonical"> tag present
  7.  Assert exactly one <h1> on the page
  8.  Assert JSON-LD <script type="application/ld+json"> present
  9.  Parse JSON-LD → assert @type is "WebApplication" or "SoftwareApplication"
  10. Assert no broken internal links (all href hrefs return 200)
```

---

### 4.9 E2E Flow 9 — Multi-Language Support (P2 / F11 — stub)

```
File: e2e/flows/i18n.spec.ts
Status: PENDING — stub until F11 is implemented

Scenario: "German user switches to DE locale"

Steps (to implement when F11 ships):
  1. Navigate to /?locale=de
  2. Assert <html lang="de">
  3. Assert questionnaire text is in German
  4. Assert risk level labels translated (e.g., "Hohes Risiko")
  5. Complete questionnaire in DE → results in German
  6. Download PDF → PDF content in German
```

---

## 5. Property-Based Tests

**Tooling:** `fast-check` via Vitest

#### Test file: `src/__tests__/property/classifier-properties.test.ts`

```
Property 1 — Classification is total (never throws on valid inputs)
  Arbitrary: all 12 questions answered with valid option values
  ∀ such answers → classify(answers) returns a value in RiskLevel enum

Property 2 — Prohibited answers always dominate
  ∀ answers where answers.q4 ∈ PROHIBITED_OPTIONS
  → classify(answers).riskLevel === "unacceptable"

Property 3 — Q1 = "no" always short-circuits to not-applicable
  ∀ answers where answers.q1 === "no"
  → classify(answers).riskLevel === "not-applicable"
  (regardless of all other answer values)

Property 4 — Adding a prohibited answer never lowers the risk classification
  If classify(answers) = R  and  answers' differs only by q4 = prohibitedValue
  → classify(answers').riskLevel === "unacceptable"

Property 5 — Obligation set is deterministic (same inputs → same output)
  ∀ (riskLevel, role) pairs
  → getObligations(riskLevel, role) called twice returns arrays with identical
     IDs in identical order (no random/time-based mutation)
```

#### Test file: `src/__tests__/property/serialization.test.ts`

```
Property 6 — AssessmentAnswers JSON roundtrip
  ∀ answers: AssessmentAnswers (fast-check record arbitrary)
  → JSON.parse(JSON.stringify(answers)) deep-equals answers
  (no data lost through the DB storage cycle)

Property 7 — Zod schema parse is idempotent
  ∀ valid payload matching assessmentCreateSchema
  → assessmentCreateSchema.parse(assessmentCreateSchema.parse(payload))
     deep-equals the first parse result

Property 8 — Badge SVG is always well-formed XML
  ∀ riskLevel in RiskLevel enum, ∀ assessmentId (UUID-shaped string)
  → DOMParser().parseFromString(generateBadgeSVG(riskLevel, id), "image/svg+xml")
     produces a document with zero parser errors
```

#### Test file: `src/__tests__/property/questions-properties.test.ts`

```
Property 9 — Questionnaire always terminates
  ∀ complete answer maps (all questions answered with valid values)
  → traverseQuestionnaire(answers) completes in ≤ 12 hops (no infinite loop)

Property 10 — Progress is monotonically non-decreasing
  ∀ answer sequences where the user only moves forward (no goBack)
  → each successive answerQuestion call produces progress ≥ previous progress
```

---

## 6. Coverage Targets

Coverage measured by Vitest `v8` provider. **CI fails if any target is not met.**

| Module | Line % | Branch % | Notes |
|---|---|---|---|
| `src/lib/classifier.ts` | **95%** | **95%** | Legal correctness — highest priority |
| `src/lib/obligations.ts` | **95%** | **90%** | Legal correctness |
| `src/lib/questions.ts` | **90%** | **90%** | Branching logic |
| `src/lib/validation/schemas.ts` | **90%** | **85%** | All schema paths |
| `src/components/checker/QuestionnaireProvider.tsx` | **85%** | **80%** | State + persistence |
| `src/components/checker/QuestionCard.tsx` | **85%** | **80%** | Interaction + a11y |
| `src/components/results/` (badge + PDF) | **80%** | **75%** | SVG + PDF builders |
| `src/app/api/assessments/route.ts` | **85%** | **80%** | POST + GET |
| `src/app/api/assessments/[id]/route.ts` | **85%** | **80%** | GET / PATCH / DELETE |
| `src/app/api/badge/[id]/route.ts` | **85%** | **80%** | SVG edge response |
| `src/app/api/assessments/[id]/pdf/route.ts` | **80%** | **75%** | PDF stream |
| `src/app/api/auth/register/route.ts` | **90%** | **85%** | Auth correctness |
| `src/app/api/v1/classify/route.ts` | **90%** | **85%** | Public API |
| `src/app/api/keys/route.ts` | **85%** | **80%** | Key lifecycle |
| `src/app/api/templates/[templateId]/route.ts` | **80%** | **75%** | Template delivery |
| `src/lib/constants.ts` | **70%** | n/a | Config data only |
| **Overall project** | **≥ 85%** | **≥ 80%** | **CI gate** |

> **Excluded from coverage:** `src/app/**/page.tsx` layout shells (covered by E2E), `src/components/ui/` (shadcn vendor components), generated Prisma client, `*.config.ts` files.

---

## 7. SPEC.md Acceptance Criteria Traceability

Every acceptance criterion from SPEC.md is mapped to ≥ 1 test. Tests labelled `[AC:Fxx]` in CI output.

| # | SPEC Criterion | Covered By |
|---|---|---|
| **F1 — 12-Question Risk Classification Questionnaire** | | |
| F1-1 | Exactly 12 questions with branching logic | `unit/questions.test.ts` — "exactly 12 questions"; branching paths |
| F1-2 | Q4 prohibited answer → immediate unacceptable | `unit/classifier.test.ts` — prohibited short-circuit; E2E Flow 3 |
| F1-3 | Q3 GPAI = yes → skip domain/function questions | `unit/questions.test.ts` — GPAI skip; `unit/classifier.test.ts` — GPAI path |
| F1-4 | Q8 narrow procedural overrides domain match | `unit/classifier.test.ts` — narrow procedural override |
| F1-5 | Progress indicator updates on each answer | `unit/QuestionnaireProvider.test.tsx` — progress calc; E2E Flow 1 step 3 |
| F1-6 | Back navigation restores previous answer | `unit/QuestionnaireProvider.test.tsx` — `goBack()`; E2E Flow 2 step 18 |
| F1-7 | State persists on page reload | `unit/QuestionnaireProvider.test.tsx` — localStorage init; E2E Flow 1 reload variant |
| F1-8 | Question transition < 100ms | E2E Flow 1 — Playwright `toBeVisible({ timeout: 100 })` on next question-card |
| **F2 — Obligation Checklist** | | |
| F2-1 | High-risk provider: 11 obligations | `unit/obligations.test.ts`; E2E Flow 2 step 13 |
| F2-2 | Each obligation has article reference | `unit/obligations.test.ts` — articleRef format; E2E Flow 2 steps 14–16 |
| F2-3 | Plain-language descriptions (not just codes) | `unit/obligations.test.ts` — description non-empty; E2E Flow 2 step 17 |
| F2-4 | High-risk deployer: 2 obligations (Art.14, Art.27) | `unit/obligations.test.ts` — high-risk + deployer |
| F2-5 | Limited-risk: Art.50 transparency obligation | `unit/obligations.test.ts` — limited-risk + any role |
| F2-6 | Unacceptable: Art.5 cessation obligation | `unit/obligations.test.ts`; E2E Flow 3 step 7 |
| F2-7 | Minimal risk: no mandatory obligations | `unit/obligations.test.ts` — minimal; E2E Flow 1 step 15 |
| **F3 — Shareable Compliance Badge** | | |
| F3-1 | Badge is SVG with correct risk color | `unit/badge.test.ts`; `integration/api/badge.test.ts`; E2E Flow 5 step 2 |
| F3-2 | Badge has unique stable URL | `unit/badge.test.ts` — URL uniqueness; E2E Flow 5 step 6 |
| F3-3 | Badge URL is publicly accessible (no auth) | `integration/api/badge.test.ts`; E2E Flow 5 step 7 |
| F3-4 | Color coding per risk level | `integration/api/badge.test.ts` — each riskLevel color |
| F3-5 | Copy badge URL to clipboard | E2E Flow 5 steps 3–4 |
| **F4 — PDF Export** | | |
| F4-1 | PDF contains full assessment results | `unit/pdf.test.ts` — content assertions |
| F4-2 | PDF generation < 3s | `integration/api/pdf.test.ts` — timing; E2E Flow 4 performance assertion |
| F4-3 | Valid PDF output | `integration/api/pdf.test.ts` — %PDF- magic number |
| F4-4 | PDF includes disclaimer | `unit/pdf.test.ts` — disclaimer present |
| F4-5 | Only assessment owner can download PDF | `integration/api/pdf.test.ts` — 401/403 auth scenarios |
| **F5 — Landing Page & SEO** | | |
| F5-1 | Page load < 1.5s | E2E Flow 8 — DOMContentLoaded timing |
| F5-2 | JSON-LD structured data | E2E Flow 8 steps 8–9 |
| F5-3 | Meta description 50–160 chars | E2E Flow 8 step 4 |
| F5-4 | OG tags present | E2E Flow 8 step 5 |
| F5-5 | Canonical URL tag | E2E Flow 8 step 7 |
| **F6 — Documentation Templates (P1)** | | |
| F6-1 | Templates downloadable as Markdown | `integration/api/templates.test.ts` — content-type + body |
| F6-2 | Templates cover major obligation categories | `integration/api/templates.test.ts` — templateId coverage list |
| **F7 — User Accounts & Saved Assessments (P1)** | | |
| F7-1 | Registration with email + password | `integration/api/auth-register.test.ts`; E2E Flow 6 steps 1–3 |
| F7-2 | Password stored as bcrypt hash | `integration/api/auth-register.test.ts` — DB hash check |
| F7-3 | Saved assessments tied to account | `integration/api/assessments-list.test.ts`; E2E Flow 6 steps 4–10 |
| F7-4 | Assessments persist across sessions | E2E Flow 6 steps 11–13 |
| F7-5 | User cannot see other users' assessments | `integration/api/assessments-list.test.ts` — isolation; `assessments-get.test.ts` — 403 |
| **F8 — Assessment Comparison View (P1)** | | |
| F8-1 | Compare two assessments side-by-side | E2E Flow 6 step 14–17 (pending F8 impl) |
| **F9 — Compliance Timeline (P2)** | | |
| F9-1 | Countdown to Aug 2, 2026 enforcement deadline | `unit/constants.test.ts` — DEADLINES values; E2E stub |
| **F10 — Email Deadline Reminders (P2)** | | |
| F10-1 | Email sent via Resend before deadline | Integration test for email route (stub — pending F10 impl) |
| **F11 — Multi-Language Support (P2)** | | |
| F11-1 | EN/DE/FR questionnaire and results | E2E Flow 9 (stub — pending F11 impl) |
| **F12 — Public API (P2)** | | |
| F12-1 | API key authentication | `integration/api/public-classify.test.ts` — auth scenarios |
| F12-2 | Same result as UI for same inputs | `integration/api/public-classify.test.ts` — parity test |
| F12-3 | Rate limited at 100 req/min | `integration/api/public-classify.test.ts` — 429 test |
| **NFR — Non-Functional Requirements** | | |
| NFR-1: Page load < 1.5s | E2E Flow 8 |
| NFR-1: Question transition < 100ms | E2E Flow 1 — Playwright timing |
| NFR-1: PDF < 3s | E2E Flow 4; `integration/api/pdf.test.ts` |
| NFR-2: Chrome/Firefox/Safari/Edge | Playwright multi-browser: chromium, firefox, webkit |
| NFR-3: WCAG 2.1 AA | E2E Flow 7 — axe-core per page |
| NFR-4: HTTPS / HSTS | Staging deploy pipeline (infra-level, outside test scope) |
| NFR-5: bcrypt passwords | `integration/api/auth-register.test.ts` |
| NFR-6: HTTP-only cookies | `integration/api/assessments-create.test.ts` — cookie flags |
| NFR-7: CSRF protection | NextAuth handles; integration tests use same-origin fetch |
| NFR-8: Rate limiting on public endpoints | `integration/api/assessments-create.test.ts`; `public-classify.test.ts` |
| NFR-9: GDPR — no PII in anonymous assessments | `integration/api/assessments-get.test.ts` — response shape excludes PII; `unit/badge.test.ts` — SVG has no PII |

---

*All tests that map to an acceptance criterion are annotated with `[AC:Fxx]` in their `describe` or `it` description strings, enabling automated traceability reports in CI output.*
