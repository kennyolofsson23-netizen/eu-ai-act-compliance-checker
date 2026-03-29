# EU AI Act Compliance Checker — Architecture

## 1. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | Already in repo. SSR for SEO, API routes for backend, React for UI. |
| **Language** | TypeScript | Already configured. Type safety for complex questionnaire logic. |
| **Styling** | Tailwind CSS + Radix UI | Already in repo. Radix gives accessible primitives; Tailwind for rapid styling. |
| **Forms** | react-hook-form + zod | Already in repo. Validation shared between client and server. |
| **Database** | SQLite via Prisma (libsql/Turso) | Zero-ops for launch. Turso for production (edge-replicated SQLite). Migrate to Postgres later if needed. |
| **Auth** | NextAuth.js v5 | Handles email/password + Google OAuth. Session strategy: JWT stored in HTTP-only cookie. |
| **PDF Generation** | @react-pdf/renderer | React component-based PDF generation. Runs server-side in API route. |
| **Email** | Resend | Simple API, generous free tier (100 emails/day), good DX. |
| **Hosting** | Vercel | Zero-config for Next.js. Edge functions for badge SVG. Free tier sufficient for launch. |
| **Analytics** | Plausible (self-hosted or cloud) | Privacy-friendly, no cookie consent needed, lightweight. |
| **Rate Limiting** | Vercel KV (Redis) via @upstash/ratelimit | Edge-compatible, serverless-friendly. |
| **Testing** | Vitest + Testing Library + Playwright | Unit/integration with Vitest, E2E with Playwright. |

---

## 2. Database Schema (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── Auth ────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?   // null if OAuth-only
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  assessments Assessment[]
  apiKeys     ApiKey[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth" | "credentials"
  provider          String  // "google" | "credentials"
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core Domain ─────────────────────────────────────────────

model Assessment {
  id              String   @id @default(cuid())
  userId          String?  // null for anonymous assessments
  anonymousId     String?  // cookie-based ID for anonymous users
  systemName      String   @default("Untitled AI System")
  answers         String   // JSON blob of question answers
  riskLevel       String   // "unacceptable" | "high" | "limited" | "minimal"
  role            String   // "provider" | "deployer" | "importer" | "distributor"
  isGpai          Boolean  @default(false)
  annexCategory   String?  // e.g., "biometrics", "employment", null if not high-risk
  citedArticles   String   // JSON array of article references
  obligations     String   // JSON array of obligation objects
  emailReminders  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([anonymousId])
}

model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  name        String   @default("Default")
  keyHash     String   @unique // bcrypt hash of the actual key
  keyPrefix   String   // first 8 chars for identification (e.g., "euai_abc1...")
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// ─── Analytics ───────────────────────────────────────────────

model AssessmentEvent {
  id           String   @id @default(cuid())
  assessmentId String?
  eventType    String   // "started" | "completed" | "abandoned" | "pdf_downloaded" | "badge_copied"
  questionId   String?  // which question they were on (for abandonment tracking)
  metadata     String?  // JSON blob for extra data
  createdAt    DateTime @default(now())

  @@index([eventType])
  @@index([createdAt])
}
```

---

## 3. API Design

### 3.1 Assessment Routes

#### `POST /api/assessments`
Create a new assessment from completed questionnaire answers.

- **Auth**: None required (supports anonymous)
- **Request**:
```json
{
  "systemName": "My AI Chatbot",
  "answers": {
    "isAiSystem": true,
    "role": "provider",
    "isGpai": false,
    "prohibitedPractices": [],
    "isSafetyComponent": false,
    "domain": "essential_services",
    "domainFunction": "creditworthiness",
    "isNarrowTask": false,
    "profilesPersons": true,
    "interactsWithPeople": true,
    "generatesSyntheticContent": false,
    "emotionRecognition": false
  }
}
```
- **Response** (201):
```json
{
  "id": "clx1abc2def",
  "systemName": "My AI Chatbot",
  "riskLevel": "high",
  "role": "provider",
  "isGpai": false,
  "annexCategory": "essential_services",
  "citedArticles": ["Article 6(2)", "Annex III Category 5(a)"],
  "obligations": [
    {
      "id": "risk-management",
      "title": "Risk Management System",
      "article": "Article 9",
      "summary": "Establish and maintain a risk management system throughout the AI system's lifecycle.",
      "practicalMeaning": "Document identified risks, test mitigation measures, and update risk assessments as the system evolves.",
      "appliesToRole": ["provider"]
    }
  ],
  "badgeUrl": "/api/badge/clx1abc2def",
  "createdAt": "2026-03-29T12:00:00Z"
}
```

#### `GET /api/assessments`
List assessments for authenticated user.

- **Auth**: Required (JWT cookie)
- **Response** (200):
```json
{
  "assessments": [
    {
      "id": "clx1abc2def",
      "systemName": "My AI Chatbot",
      "riskLevel": "high",
      "role": "provider",
      "updatedAt": "2026-03-29T12:00:00Z"
    }
  ]
}
```

#### `GET /api/assessments/[id]`
Get full assessment details.

- **Auth**: Owner or anonymous ID match
- **Response** (200): Full assessment object (same as POST response)

#### `DELETE /api/assessments/[id]`
Delete an assessment.

- **Auth**: Required (owner only)
- **Response** (204): No content

#### `PATCH /api/assessments/[id]`
Update assessment name or email reminder preference.

- **Auth**: Required (owner only)
- **Request**:
```json
{
  "systemName": "Updated Name",
  "emailReminders": true
}
```
- **Response** (200): Updated assessment object

### 3.2 Badge Route

#### `GET /api/badge/[assessmentId]`
Returns an SVG badge image.

- **Auth**: None (public endpoint)
- **Response**: SVG image (`Content-Type: image/svg+xml`)
- **Cache**: `Cache-Control: public, max-age=86400, s-maxage=86400`
- **Edge Function**: Yes (for low latency)

### 3.3 PDF Route

#### `GET /api/assessments/[id]/pdf`
Generate and download PDF report.

- **Auth**: Owner or anonymous ID match
- **Response**: PDF file (`Content-Type: application/pdf`, `Content-Disposition: attachment`)

### 3.4 Auth Routes (NextAuth)

#### `POST /api/auth/register`
Create a new account with email/password.

- **Auth**: None
- **Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "Sarah Chen"
}
```
- **Response** (201):
```json
{ "id": "clx1user123", "email": "user@example.com", "name": "Sarah Chen" }
```
- **Validation**: Email format, password min 8 chars with 1 uppercase + 1 number

#### `POST /api/auth/[...nextauth]`
NextAuth catch-all route for login, logout, OAuth callbacks.

#### `GET /api/auth/session`
Get current session.

### 3.5 API Key Routes

#### `POST /api/keys`
Generate a new API key.

- **Auth**: Required
- **Response** (201):
```json
{
  "id": "clx1key123",
  "name": "Default",
  "key": "euai_abc123def456...",
  "keyPrefix": "euai_abc1",
  "createdAt": "2026-03-29T12:00:00Z"
}
```
Note: `key` is only returned on creation, never again.

#### `DELETE /api/keys/[id]`
Revoke an API key.

- **Auth**: Required (owner only)
- **Response** (204): No content

### 3.6 Public API (v1)

#### `POST /api/v1/classify`
Programmatic classification endpoint.

- **Auth**: API key via `Authorization: Bearer euai_xxx` header
- **Rate Limit**: 10/hour anonymous (IP), 100/hour authenticated
- **Request**: Same answers shape as POST /api/assessments
- **Response** (200):
```json
{
  "riskLevel": "high",
  "obligations": [...],
  "citedArticles": [...],
  "badgeUrl": "https://euaicheck.com/api/badge/clx1abc2def"
}
```

### 3.7 Analytics Route

#### `POST /api/events`
Track assessment events (started, completed, abandoned).

- **Auth**: None
- **Request**:
```json
{
  "assessmentId": "clx1abc2def",
  "eventType": "completed",
  "questionId": null,
  "metadata": {}
}
```
- **Response** (201): `{ "ok": true }`

### 3.8 Templates Route

#### `GET /api/templates/[templateId]`
Download a documentation template.

- **Auth**: None (P1 — gated behind Pro in Phase 2)
- **templateId values**: `technical-documentation`, `risk-management`, `data-governance`, `human-oversight`, `post-market-monitoring`, `transparency-disclosure`
- **Response**: Markdown file (`Content-Type: text/markdown`, `Content-Disposition: attachment`)

---

## 4. Page / Route Map

| URL | Page | Auth | Data Requirements |
|-----|------|------|-------------------|
| `/` | Landing page | None | Static + assessment count from DB |
| `/checker` | Questionnaire (12 questions) | None | Questions data (static JSON), localStorage for progress |
| `/checker/results` | Results page (classification + obligations + badge + PDF) | None | Assessment from URL param or localStorage |
| `/checker/results/[id]` | Saved assessment results | Optional (owner or anon match) | Assessment by ID from DB |
| `/dashboard` | User dashboard (list assessments) | Required | User's assessments from DB |
| `/dashboard/compare` | Comparison view | Required | 2-4 assessments by IDs from query params |
| `/dashboard/keys` | API key management | Required | User's API keys from DB |
| `/dashboard/settings` | Account settings | Required | User profile from DB |
| `/auth/login` | Login page | None (redirect if authed) | None |
| `/auth/register` | Registration page | None (redirect if authed) | None |
| `/about` | About page | None | Static |
| `/privacy` | Privacy policy | None | Static |
| `/terms` | Terms of service | None | Static |
| `/api/badge/[id]` | Badge SVG (edge function) | None | Assessment risk level from DB |
| `/api/docs` | API documentation page | None | Static (OpenAPI spec rendered) |

---

## 5. Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (html, body, fonts, analytics)
│   ├── page.tsx                            # Landing page
│   ├── globals.css                         # Tailwind base + custom styles
│   ├── robots.ts                           # SEO robots
│   ├── sitemap.ts                          # SEO sitemap
│   ├── checker/
│   │   ├── page.tsx                        # Questionnaire page
│   │   └── results/
│   │       ├── page.tsx                    # Anonymous results (from localStorage/URL)
│   │       └── [id]/
│   │           └── page.tsx                # Saved assessment results
│   ├── dashboard/
│   │   ├── layout.tsx                      # Dashboard layout (sidebar + auth guard)
│   │   ├── page.tsx                        # Assessment list
│   │   ├── compare/
│   │   │   └── page.tsx                    # Comparison view
│   │   ├── keys/
│   │   │   └── page.tsx                    # API key management
│   │   └── settings/
│   │       └── page.tsx                    # Account settings
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx                    # Login form
│   │   └── register/
│   │       └── page.tsx                    # Registration form
│   ├── about/
│   │   └── page.tsx                        # About page
│   ├── privacy/
│   │   └── page.tsx                        # Privacy policy
│   ├── terms/
│   │   └── page.tsx                        # Terms of service
│   └── api/
│       ├── auth/
│       │   ├── register/
│       │   │   └── route.ts                # POST registration
│       │   └── [...nextauth]/
│       │       └── route.ts                # NextAuth catch-all
│       ├── assessments/
│       │   ├── route.ts                    # GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts                # GET, PATCH, DELETE
│       │       └── pdf/
│       │           └── route.ts            # GET PDF download
│       ├── badge/
│       │   └── [id]/
│       │       └── route.ts                # GET SVG badge (edge)
│       ├── keys/
│       │   ├── route.ts                    # POST create key
│       │   └── [id]/
│       │       └── route.ts                # DELETE revoke key
│       ├── events/
│       │   └── route.ts                    # POST analytics event
│       ├── templates/
│       │   └── [templateId]/
│       │       └── route.ts                # GET template download
│       └── v1/
│           └── classify/
│               └── route.ts                # POST public API
├── components/
│   ├── layout/
│   │   ├── Header.tsx                      # Site header (logo, nav, auth status)
│   │   ├── Footer.tsx                      # Site footer (links, disclaimer)
│   │   ├── DashboardSidebar.tsx            # Dashboard navigation sidebar
│   │   └── AuthGuard.tsx                   # Redirect to login if not authed
│   ├── checker/
│   │   ├── QuestionnaireShell.tsx           # Progress bar, navigation, question container
│   │   ├── QuestionCard.tsx                # Single question renderer (radio, checkbox, info)
│   │   ├── ProgressBar.tsx                 # Step indicator with branching awareness
│   │   └── QuestionnaireProvider.tsx       # Context provider for questionnaire state
│   ├── results/
│   │   ├── RiskClassificationBanner.tsx    # Large colored banner with risk level
│   │   ├── ObligationChecklist.tsx         # Expandable checklist of obligations
│   │   ├── ObligationItem.tsx              # Single obligation with expand/collapse
│   │   ├── BadgePreview.tsx                # Badge preview + copy URL button
│   │   ├── ArticleCitations.tsx            # List of cited EU AI Act articles
│   │   ├── ResultsActions.tsx              # Action buttons (PDF, save, share)
│   │   └── DisclaimerBanner.tsx            # Legal disclaimer
│   ├── dashboard/
│   │   ├── AssessmentList.tsx              # List/grid of saved assessments
│   │   ├── AssessmentCard.tsx              # Single assessment summary card
│   │   ├── ComparisonTable.tsx             # Side-by-side comparison table
│   │   ├── ApiKeyList.tsx                  # List of API keys
│   │   └── ApiKeyCreateDialog.tsx          # Dialog to create new API key
│   ├── sections/
│   │   ├── Hero.tsx                        # Landing page hero section
│   │   ├── HowItWorks.tsx                  # 3-step explanation
│   │   ├── Features.tsx                    # Feature highlights
│   │   ├── DeadlineCountdown.tsx           # Countdown to Aug 2, 2026
│   │   ├── FAQ.tsx                         # Frequently asked questions
│   │   └── SocialProof.tsx                 # Assessment count, trust signals
│   └── ui/
│       ├── button.tsx                      # Button component (already exists)
│       ├── card.tsx                        # Card container
│       ├── dialog.tsx                      # Modal dialog (Radix)
│       ├── dropdown-menu.tsx               # Dropdown menu (Radix)
│       ├── input.tsx                       # Text input
│       ├── label.tsx                       # Form label (Radix)
│       ├── select.tsx                      # Select dropdown (Radix)
│       ├── separator.tsx                   # Visual separator (Radix)
│       ├── tabs.tsx                        # Tab component (Radix)
│       ├── badge.tsx                       # Status badge (not the compliance badge)
│       ├── accordion.tsx                   # Expandable sections for obligations
│       ├── progress.tsx                    # Progress bar
│       ├── toast.tsx                       # Toast notifications
│       └── skeleton.tsx                    # Loading skeleton
└── lib/
    ├── engine/
    │   ├── classifier.ts                   # Core classification logic (pure function)
    │   ├── obligations.ts                  # Obligation data + lookup by risk level and role
    │   ├── questions.ts                    # Question definitions, branching logic, answer options
    │   ├── articles.ts                     # EU AI Act article reference data
    │   └── types.ts                        # TypeScript types for all engine data
    ├── templates/
    │   ├── technical-documentation.ts      # Annex IV template content
    │   ├── risk-management.ts              # Art. 9 template
    │   ├── data-governance.ts              # Art. 10 template
    │   ├── human-oversight.ts              # Art. 14 template
    │   ├── post-market-monitoring.ts       # Art. 72 template
    │   └── transparency-disclosure.ts      # Art. 50 template
    ├── badge/
    │   └── generator.ts                    # SVG badge generation function
    ├── pdf/
    │   └── generator.tsx                   # PDF report React component + generation
    ├── auth/
    │   ├── config.ts                       # NextAuth configuration
    │   ├── providers.ts                    # Auth providers (credentials + Google)
    │   └── helpers.ts                      # Auth utility functions (getSession, requireAuth)
    ├── db/
    │   └── client.ts                       # Prisma client singleton
    ├── email/
    │   └── reminders.ts                    # Email sending functions (Resend)
    ├── validation/
    │   └── schemas.ts                      # Zod schemas for all API inputs
    ├── rate-limit/
    │   └── limiter.ts                      # Rate limiting configuration
    ├── utils.ts                            # General utilities (cn, formatDate, etc.)
    └── constants.ts                        # App-wide constants (colors, deadlines, limits)
```

---

## 6. Data Flow

### 6.1 Anonymous Assessment Flow

```
User opens /checker
  → QuestionnaireProvider initializes state from localStorage (if resuming) or fresh
  → User answers Question 1
    → QuestionCard dispatches answer to QuestionnaireProvider
    → QuestionnaireProvider evaluates branching logic (questions.ts)
    → Next question determined, state saved to localStorage
    → ProgressBar updates
  → ... repeats for each applicable question ...
  → User reaches final question
    → QuestionnaireProvider calls classifier.classify(answers)
    → classifier.ts returns { riskLevel, citedArticles, obligations }
    → User redirected to /checker/results with state in URL params (encoded)
  → Results page renders:
    → RiskClassificationBanner shows risk level
    → ObligationChecklist renders applicable obligations
    → BadgePreview generates preview
    → POST /api/assessments stores the assessment (with anonymousId from cookie)
    → POST /api/events tracks "completed" event
  → User clicks "Download PDF"
    → GET /api/assessments/[id]/pdf
    → Server loads assessment, generates PDF via @react-pdf/renderer
    → PDF streamed back as download
  → User clicks "Copy Badge URL"
    → Badge URL copied to clipboard
    → POST /api/events tracks "badge_copied" event
```

### 6.2 Authenticated Assessment Flow

```
User logs in via /auth/login
  → POST /api/auth/[...nextauth] (credentials or Google OAuth)
  → JWT cookie set
  → Redirect to /dashboard

User clicks "New Assessment"
  → Redirect to /checker (same flow as anonymous)
  → On results page, assessment auto-linked to userId
  → Assessment appears in /dashboard

User views /dashboard
  → GET /api/assessments (server component fetch with cookie auth)
  → AssessmentList renders cards for each assessment
  → User clicks assessment → /checker/results/[id]
  → Full results loaded from DB
```

### 6.3 Badge Embed Flow

```
External site includes <img src="https://euaicheck.com/api/badge/[id]">
  → Edge function receives GET /api/badge/[id]
  → Query assessment from DB (edge-compatible via Turso)
  → generator.ts builds SVG string with:
    - Risk level text
    - Color based on level
    - Assessment date
    - "EU AI Act" label
  → Return SVG with Cache-Control: public, max-age=86400
  → CDN caches for 24 hours
```

### 6.4 Public API Flow

```
Developer sends POST /api/v1/classify
  → Rate limiter checks IP or API key
  → Zod validates request body
  → classifier.classify(answers) runs
  → Assessment stored in DB (linked to API key owner if authenticated)
  → JSON response returned with classification + obligations
```

---

## 7. Security Checklist

### Authentication
- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] JWT tokens in HTTP-only, Secure, SameSite=Lax cookies
- [x] Session expiry: 30 days, sliding window
- [x] Google OAuth via NextAuth (no custom OAuth implementation)
- [x] API keys: SHA-256 hashed before storage, never logged, shown once on creation
- [x] API key prefix stored separately for identification without exposing key

### Input Validation
- [x] All API inputs validated with Zod schemas (shared between client/server)
- [x] Assessment answers validated against known question IDs and allowed values
- [x] String inputs: max length enforced (systemName: 200 chars, email: 254 chars)
- [x] No raw SQL — Prisma parameterized queries only

### Authorization
- [x] Assessment access: owner (userId match) or anonymous (anonymousId cookie match)
- [x] Dashboard routes: AuthGuard redirects to /auth/login if no session
- [x] API routes: middleware checks session or API key before processing
- [x] DELETE operations: owner-only, verified server-side
- [x] No admin routes in V1 (manual DB access for ops)

### CSRF / XSS
- [x] SameSite=Lax cookies prevent CSRF on GET-mutating routes (none exist)
- [x] All state-changing operations use POST/PATCH/DELETE (not GET)
- [x] React's default JSX escaping prevents XSS
- [x] No dangerouslySetInnerHTML usage
- [x] Content-Security-Policy header: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`

### Rate Limiting
- [x] Anonymous API: 10 requests/hour per IP
- [x] Authenticated API: 100 requests/hour per API key
- [x] Assessment creation: 20/hour per IP (anonymous), 60/hour per user (authenticated)
- [x] Auth routes: 5 login attempts/15 minutes per IP (brute force protection)
- [x] Badge endpoint: 1000/hour per IP (CDN cached, so rarely hit)

### Secrets Management
- [x] All secrets in environment variables, never in code
- [x] `.env.local` in `.gitignore`
- [x] Required env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [x] `NEXTAUTH_SECRET`: minimum 32 bytes, randomly generated

### Data Privacy
- [x] Anonymous assessments: no email, no name, only answers + anonymousId
- [x] Account deletion: cascading delete of all user data (assessments, keys, sessions)
- [x] No third-party analytics scripts that set cookies
- [x] Plausible analytics: cookie-free, GDPR-compliant by default
- [x] Assessment answers do not contain PII by design (multiple choice only)
- [x] PDF exports generated server-side, not stored — streamed directly to client

### Infrastructure
- [x] HTTPS enforced (Vercel default)
- [x] HTTP Strict Transport Security header
- [x] X-Frame-Options: DENY (except badge route: ALLOW)
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
