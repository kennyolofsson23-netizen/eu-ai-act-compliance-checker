# TEST_PLAN.md — EU AI Act Compliance Checker

> Generated: 2026-03-29
> Spec version: SPEC.md (F1–F5 P0 launch scope)
> Architecture version: ARCHITECTURE.md
> Test runner: Vitest (unit/integration) · Playwright (E2E) · fast-check (property)

---

## 0. Acceptance Criterion → Test Traceability Matrix

Every `F`-tagged acceptance criterion from SPEC.md is mapped to at least one test ID below.
Tests are prefixed: `U` = unit, `I` = integration, `E` = E2E, `P` = property-based.

| Spec Criterion | Test IDs |
|---|---|
| F1 – 12-question questionnaire renders all questions | E-QUEST-01, U-QUEST-01 |
| F1 – Branching: Q1 "no" → instant minimal result | U-CLS-01, E-QUEST-02 |
| F1 – Branching: Q4 prohibited → instant unacceptable result | U-CLS-02, E-QUEST-03 |
| F1 – Branching: safety component → high risk | U-CLS-03, E-QUEST-04 |
| F1 – Branching: high-risk domain + function → high risk | U-CLS-04, E-QUEST-05 |
| F1 – Branching: narrow task overrides high-risk domain | U-CLS-05 |
| F1 – Branching: interacts with humans → limited risk | U-CLS-06, E-QUEST-06 |
| F1 – Branching: synthetic content → limited risk | U-CLS-07 |
| F1 – Branching: emotion recognition → limited risk | U-CLS-08 |
| F1 – Branching: simple recommendation → minimal risk | U-CLS-09 |
| F1 – Progress bar advances correctly | E-QUEST-07, U-QUEST-02 |
| F1 – Back navigation restores previous answer | E-QUEST-08, U-QUEST-03 |
| F1 – State persists on page refresh (localStorage) | E-QUEST-09 |
| F1 – System name captured and stored | I-ASSESS-01, E-QUEST-10 |
| F2 – Obligation checklist shown after classification | E-RES-01, U-OBL-01 |
| F2 – Obligations filtered by risk level and role | U-OBL-02, U-OBL-03 |
| F2 – Article references link to EU-Lex | E-RES-02, U-ART-01 |
| F2 – Unacceptable risk shows cease-practice obligation | U-OBL-04, E-RES-03 |
| F2 – High-risk provider: 11 obligations displayed | U-OBL-05, E-RES-04 |
| F2 – High-risk deployer: 2 obligations displayed | U-OBL-06 |
| F2 – Limited risk: 1 transparency obligation | U-OBL-07 |
| F2 – Minimal risk: 0 obligations | U-OBL-08, E-RES-05 |
| F3 – Badge SVG generated for any completed assessment | I-BADGE-01, E-RES-06 |
| F3 – Badge URL is shareable (public, no auth) | I-BADGE-02 |
| F3 – Badge reflects correct risk level color | I-BADGE-03, U-CONST-01 |
| F3 – Badge embed code copyable | E-RES-07 |
| F4 – PDF export downloads for completed assessment | I-PDF-01, E-RES-10 |
| F4 – PDF contains system name, risk level, obligations | I-PDF-02 |
| F4 – PDF export requires valid assessment ID | I-PDF-03 |
| F5 – Landing page loads with valid SEO metadata | E-LAND-01, U-SEO-01 |
| F5 – FAQ section present with JSON-LD schema | E-LAND-02 |
| F5 – Deadline countdown shows correct days | U-UTIL-01, E-LAND-03 |
| F5 – CTA links to /checker | E-LAND-04 |
| NFR – Page load < 1.5 s (LCP) | E-PERF-01 |
| NFR – WCAG 2.1 AA: keyboard navigation | E-A11Y-01, E-A11Y-05 |
| NFR – WCAG 2.1 AA: color contrast | E-A11Y-02 |
| NFR – WCAG 2.1 AA: screen reader labels | E-A11Y-03 |
| NFR – Rate limiting: anon 20/hr, auth 60/hr | I-RATE-01, I-RATE-02 |
| NFR – Passwords hashed with bcrypt cost 12 | U-AUTH-01, I-AUTH-02 |
| NFR – JWT stored in HTTP-only cookie | I-AUTH-09 |
| NFR – Anonymous assessments work without login | I-ASSESS-02, E-QUEST-01 |
| NFR – Assessment saved to DB for auth user | I-ASSESS-03, E-DASH-01 |
| NFR – Input validation rejects malformed requests | I-ASSESS-04, I-AUTH-04 |

---

## 1. Test Strategy & Pyramid

### 1.1 Rationale

The compliance checker has a **pure-function engine core** (classifier, obligations, questions) that is
deterministic and easily unit-tested. The UI is a relatively linear wizard. The primary risk is in the
**classification logic** (legal correctness) and the **API contract** (data integrity across save/load).
This drives a **bottom-heavy pyramid** with 100% branch coverage mandated on the engine.

```
         ┌─────────────┐
         │   E2E (≈15%)│  ~25 scenarios · Playwright
         ├─────────────┤
         │  Intg (≈25%)│  ~45 cases · Vitest + direct route handlers
         ├─────────────┤
         │  Unit (≈60%)│  ~120 cases · Vitest
         └─────────────┘
           Property: ~12 candidates woven throughout all layers
```

Key principle: **the engine is a pure function with no I/O — no mocks are needed and 100% branch
coverage is mandatory.** API-layer tests exercise real Zod validation, real rate-limit logic, and a
real in-memory SQLite DB. E2E tests are reserved for cross-layer flows and accessibility.

### 1.2 Toolchain

| Layer | Tool | Config file |
|---|---|---|
| Unit + Integration | Vitest | `vitest.config.ts` |
| Component | Vitest + @testing-library/react | same |
| E2E | Playwright | `playwright.config.ts` |
| Property | fast-check (via Vitest) | co-located with unit tests |
| Coverage | Vitest v8 | thresholds in `vitest.config.ts` |
| Accessibility | @axe-core/playwright | inside Playwright tests |

### 1.3 Test Environments

| Environment | DB | Auth | Notes |
|---|---|---|---|
| Unit | in-memory / mocked | mocked | No I/O |
| Integration | SQLite `:memory:` | real NextAuth logic, mocked JWT sign | Prisma `migrate reset` before suite |
| E2E | SQLite file `.test.db` | seeded test users | `playwright/global-setup.ts` seeds DB |

### 1.4 CI Pipeline Order

```
lint → typecheck → unit → integration → e2e (chromium) → e2e (firefox) → coverage-gate
```

---

## 2. Unit Tests

### 2.1 `src/lib/engine/classifier.ts`

**File:** `src/__tests__/unit/engine/classifier.test.ts`

**Strategy:** Exhaustive decision-tree coverage using table-driven tests. Every branch path must be
exercised. The classifier is a pure function — zero mocks required.

#### 2.1.1 Decision-tree happy paths

| Test ID | Input summary | Expected `riskLevel` | Key articles |
|---|---|---|---|
| U-CLS-01 | `isAiSystem: "no"` | `minimal` | none |
| U-CLS-02 | prohibited practice flag set | `unacceptable` | Article 5 |
| U-CLS-03 | `safetyComponent: "yes"` | `high` | Article 6 |
| U-CLS-04 | domain=employment, function=decision, narrowTask=`"no"` | `high` | Article 6, Annex III |
| U-CLS-05 | domain=employment, function=decision, narrowTask=`"yes"` | `minimal` | — |
| U-CLS-06 | `interactsWithPeople: "yes"` | `limited` | Article 50 |
| U-CLS-07 | `syntheticContent: "yes"` | `limited` | Article 50 |
| U-CLS-08 | `emotionRecognition: "yes"` | `limited` | Article 50 |
| U-CLS-09 | all negative/non-qualifying flags | `minimal` | — |

#### 2.1.2 Edge cases

| Test ID | Scenario |
|---|---|
| U-CLS-10 | All 8 high-risk domains — each returns `high` when paired with a decision function |
| U-CLS-11 | GPAI flag set — does NOT short-circuit tree; continues evaluation |
| U-CLS-12 | `role: "deployer"` with high risk — obligations list differs from `"provider"` list |
| U-CLS-13 | `answers` object entirely `undefined` fields — does not throw; returns `minimal` |
| U-CLS-14 | `safetyComponent="yes"` AND prohibited practice set — `unacceptable` takes precedence |
| U-CLS-15 | Multiple high-risk domains selected simultaneously — any one is sufficient for `high` |

#### 2.1.3 Output shape contract

| Test ID | Assertion |
|---|---|
| U-CLS-16 | `citedArticles` is always a non-empty `ArticleReference[]` |
| U-CLS-17 | Each item in `obligations` has `id`, `title`, `description`, `articleRef`, `deadline` |
| U-CLS-18 | `reasoning` is a non-empty string for every classification path |
| U-CLS-19 | `riskLevel` is strictly one of `"unacceptable" \| "high" \| "limited" \| "minimal"` |

**Mock boundaries:** None — pure function.

---

### 2.2 `src/lib/engine/obligations.ts`

**File:** `src/__tests__/unit/engine/obligations.test.ts`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-OBL-01 | `getObligationsForLevel("high", "provider")` | Exactly 11 obligations |
| U-OBL-02 | `getObligationsForLevel("high", "deployer")` | Exactly 2 obligations |
| U-OBL-03 | `getObligationsForLevel("limited", "provider")` | Exactly 1 transparency obligation |
| U-OBL-04 | `getObligationsForLevel("unacceptable", "provider")` | 1 cease-practice obligation |
| U-OBL-05 | `getObligationsForLevel("minimal", "provider")` | Empty array |
| U-OBL-06 | `getObligationsForLevel("minimal", "deployer")` | Empty array |
| U-OBL-07 | Each obligation's `articleRef` resolves to a known article | No dangling references |
| U-OBL-08 | `deadline` on high-risk obligations is ISO date string `"2026-08-02"` | Enforcement date |
| U-OBL-09 | Obligation IDs are unique within each returned list | No duplicates |

---

### 2.3 `src/lib/engine/articles.ts`

**File:** `src/__tests__/unit/engine/articles.test.ts`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-ART-01 | All 15 `ArticleReference` objects exported | `count === 15` |
| U-ART-02 | Every `url` starts with `https://eur-lex.europa.eu` | URL validity |
| U-ART-03 | Article numbers unique across the array | No duplicates |
| U-ART-04 | Articles 5, 6, 9–15, 17, 43, 49, 50, 53, 55, 72 all present | Spec-required set |

---

### 2.4 `src/lib/engine/questions.ts`

**File:** `src/__tests__/unit/engine/questions.test.ts`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-QUEST-01 | Questions array has exactly 12 items | `questions.length === 12` |
| U-QUEST-02 | Each question has `id`, `text`, `type`, `options`, `next` | Shape contract |
| U-QUEST-03 | `getAnswerKey(id)` maps all 12 IDs to unique `AssessmentAnswers` keys | No duplicates, no `undefined` |
| U-QUEST-04 | `next()` on Q1 with `"no"` returns `null` (terminal) | Early exit |
| U-QUEST-05 | `next()` on Q4 with a prohibited-practice value returns `null` | Early exit |
| U-QUEST-06 | `next()` on Q12 returns `null` (last question) | End of chain |
| U-QUEST-07 | All non-terminal `next()` calls return a valid question ID | No broken links |
| U-QUEST-08 | Checkbox questions `type === "checkbox"`, radio questions `type === "radio"` | Type consistency |
| U-QUEST-09 | Branching from Q6 with each high-risk domain routes to Q7 | Domain branch intact |

---

### 2.5 `src/lib/validation/schemas.ts`

**File:** `src/__tests__/unit/validation/schemas.test.ts`

| Test ID | Schema | Valid input | Invalid input | Assertion |
|---|---|---|---|---|
| U-VAL-01 | `registerSchema` | `{email:"a@b.com", password:"Passw0rd"}` | `{email:"not-email"}` | Passes / ZodError |
| U-VAL-02 | `registerSchema` password | `"Passw0rd"` | `"password1"` (no uppercase) | Rule enforced |
| U-VAL-03 | `registerSchema` password | `"Passw0rd"` | `"Password"` (no digit) | Rule enforced |
| U-VAL-04 | `registerSchema` password | `"Passw0rd"` | `"Pa0"` (< 8 chars) | Length enforced |
| U-VAL-05 | `assessmentAnswersSchema` | 12 optional fields | Extra unknown key | Unknown keys stripped |
| U-VAL-06 | `createAssessmentSchema` | `{systemName:"X", answers:{}}` | `{systemName:""}` | Non-empty name required |
| U-VAL-07 | `createApiKeySchema` | `{}` (name optional) | — | No throw on empty object |
| U-VAL-08 | `analyticsEventSchema` | Valid `eventType` enum member | Unknown string | Enum rejection |

---

### 2.6 `src/lib/utils.ts`

**File:** `src/__tests__/unit/utils.test.ts`

| Test ID | Function | Input | Expected |
|---|---|---|---|
| U-UTIL-01 | `getDaysUntil` | `new Date("2026-08-02")` from `2026-03-29` | `126` |
| U-UTIL-02 | `getDaysUntil` | Past date | Negative number (no throw) |
| U-UTIL-03 | `formatDate` | `new Date("2026-08-02")` | `"2 August 2026"` |
| U-UTIL-04 | `formatDateISO` | `new Date("2026-08-02T12:00Z")` | `"2026-08-02"` |
| U-UTIL-05 | `generateAnonymousId` | Called twice | Two distinct strings |
| U-UTIL-06 | `generateAnonymousId` | Single call | Matches `/^[a-z0-9_-]+$/` |
| U-UTIL-07 | `truncate` | `("hello world", 5)` | `"hello…"` |
| U-UTIL-08 | `truncate` | String shorter than limit | Unchanged |
| U-UTIL-09 | `slugify` | `"EU AI Act – Checker!"` | `"eu-ai-act-checker"` |
| U-UTIL-10 | `cn` | Two conflicting Tailwind classes | Later class wins (tailwind-merge) |

---

### 2.7 `src/lib/constants.ts`

**File:** `src/__tests__/unit/constants.test.ts`

| Test ID | Assertion |
|---|---|
| U-CONST-01 | `RISK_COLORS` has entries for all 4 risk levels |
| U-CONST-02 | Each entry has `badge`, `bg`, `border`, `bannerBg`, `heading`, `body`, `icon`, `tailwind` |
| U-CONST-03 | `EU_AI_ACT_DEADLINES` has ≥ 3 entries, each with a valid ISO date |
| U-CONST-04 | Prohibited practices enforcement date = `"2025-02-02"` |
| U-CONST-05 | GPAI enforcement date = `"2025-08-02"` |
| U-CONST-06 | High-risk enforcement date = `"2026-08-02"` |

---

### 2.8 `src/lib/rate-limit/limiter.ts`

**File:** `src/__tests__/unit/rate-limit/limiter.test.ts`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-RATE-01 | Single request under limit | `{success: true, remaining: N-1}` |
| U-RATE-02 | Requests up to exact limit | All `success: true` |
| U-RATE-03 | Request exceeding limit | `{success: false}` |
| U-RATE-04 | Different keys isolated | Key A exhausted does not affect key B |
| U-RATE-05 | Window reset after TTL | `Date.now` mocked forward; count resets |
| U-RATE-06 | `RATE_LIMITS.ASSESSMENT_CREATE_ANON === 20` | Matches spec |
| U-RATE-07 | `RATE_LIMITS.ASSESSMENT_CREATE_AUTH === 60` | Matches spec |

**Mock:** `vi.setSystemTime()` to advance the rate-limit window without sleeping.

---

### 2.9 `src/components/checker/QuestionnaireProvider.tsx`

**File:** `src/__tests__/unit/components/QuestionnaireProvider.test.tsx`

**Strategy:** Test the reducer and context via `renderHook`. No visual assertions here.

| Test ID | Scenario | Assertion |
|---|---|---|
| U-QPROV-01 | Initial state | `currentQuestionIndex=0`, `status="in_progress"`, `answers={}` |
| U-QPROV-02 | `ANSWER_QUESTION` action | `currentQuestionIndex` increments |
| U-QPROV-03 | Q1 answer `"no"` → early completion | `status="complete"`, `result.riskLevel="minimal"` |
| U-QPROV-04 | Q4 prohibited answer → early completion | `status="complete"`, `result.riskLevel="unacceptable"` |
| U-QPROV-05 | All 12 questions answered | `status="complete"`, `result` fully populated |
| U-QPROV-06 | `GO_BACK` action | Index decrements; cannot go below 0 |
| U-QPROV-07 | `RESET` action | Returns to initial state |
| U-QPROV-08 | `SET_SYSTEM_NAME` action | `systemName` updated in state |
| U-QPROV-09 | `RESTORE` action from localStorage | All fields hydrated correctly |
| U-QPROV-10 | `progress` computed value | `progress = (index / totalQuestions) * 100` |
| U-QPROV-11 | `localStorage.setItem` called on every state change | Spy confirms write with `STORAGE_KEY` |
| U-QPROV-12 | Corrupt localStorage on `RESTORE` | Fails silently; starts fresh |

**Mock boundaries:** `localStorage` (mock Storage API), `classify` (spy: verify called once on completion).

---

### 2.10 `src/components/checker/QuestionCard.tsx`

**File:** `src/__tests__/unit/components/QuestionCard.test.tsx`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-QC-01 | Radio question | One `<input type="radio">` per option |
| U-QC-02 | Checkbox question | One `<input type="checkbox">` per option |
| U-QC-03 | Select radio option | `onChange` fires with correct value |
| U-QC-04 | Select "none" checkbox | All other checkboxes deselected |
| U-QC-05 | Select non-"none" after "none" checked | "none" becomes unchecked |
| U-QC-06 | Question text | Rendered in accessible `<h2>` or `role="heading"` |
| U-QC-07 | Keyboard focus | Focus-ring class applied on `:focus-visible` |
| U-QC-08 | Label linkage | Each option has `<label for=...>` matching input `id` |

---

### 2.11 `src/lib/auth/providers.ts`

**File:** `src/__tests__/unit/auth/providers.test.ts`

| Test ID | Scenario | Assertion |
|---|---|---|
| U-AUTH-01 | `authorize` with correct password | Returns user object with `id` and `email` |
| U-AUTH-02 | `authorize` with wrong password | Returns `null` |
| U-AUTH-03 | `authorize` with unknown email | Returns `null` |
| U-AUTH-04 | `jwt` callback | `token.id` set from `user.id` on sign-in |
| U-AUTH-05 | `session` callback | `session.user.id` exposed from `token.id` |

**Mock boundaries:** `prisma.user.findUnique`, `bcrypt.compare`.

---

### 2.12 SEO / Metadata

**File:** `src/__tests__/unit/seo/metadata.test.ts`

| Test ID | Assertion |
|---|---|
| U-SEO-01 | Landing page `metadata` export has `title`, `description`, `openGraph` |
| U-SEO-02 | `openGraph.type === "website"` |
| U-SEO-03 | JSON-LD `FAQPage` schema has ≥ 5 Q&A entries |
| U-SEO-04 | JSON-LD `SoftwareApplication` schema has `name`, `url`, `applicationCategory` |

---

## 3. Integration Tests

**Setup:** `beforeAll` migrates a fresh SQLite `:memory:` DB via `prisma migrate reset --force`.
**Auth helper:** `createTestUser(email, password)` seeds a user and returns a signed JWT cookie string.
**HTTP layer:** Route handlers called directly as Next.js `Request`/`Response` objects:

```ts
import { POST } from "@/app/api/assessments/route";
const res = await POST(new Request("http://localhost/api/assessments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ... })
}));
```

---

### 3.1 `POST /api/assessments`

**File:** `src/__tests__/integration/api/assessments/create.test.ts`

| Test ID | Scenario | Request | Expected |
|---|---|---|---|
| I-ASSESS-01 | Valid anonymous assessment | `{systemName:"MyAI", answers:{...}, anonymousId:"anon_123"}` | `201`, body has `id`, `riskLevel`, `badgeUrl` |
| I-ASSESS-02 | Anonymous — no auth cookie | Same, no cookie | `201` (auth not required) |
| I-ASSESS-03 | Authenticated user | Valid JWT cookie | `201`, DB row `userId` is set |
| I-ASSESS-04 | Missing `systemName` | `{answers:{}}` | `400`, validation error in body |
| I-ASSESS-05 | Invalid answer enum value | `{answers:{isAiSystem:"maybe"}}` | `400` |
| I-ASSESS-06 | Rate limit exceeded (anon, 21st request) | 21 rapid POSTs same IP | 21st → `429`, `Retry-After` header present |
| I-ASSESS-07 | Rate limit higher for auth user | 21 POSTs with valid JWT | All 21 succeed (limit is 60) |
| I-ASSESS-08 | Classification stored in DB | Valid request | `assessment` row has correct `riskLevel` + `obligations` JSON |
| I-ASSESS-09 | `badgeUrl` format | Valid request | `badgeUrl` matches `/\/api\/badge\/[a-z0-9-]+/` |
| I-ASSESS-10 | `systemName` trimmed | `systemName: "  MyAI  "` | Stored and returned as `"MyAI"` |
| I-ASSESS-11 | Unknown extra fields stripped | `{systemName:"X", answers:{}, __evil:"x"}` | `201`, no extra field in response or DB |

---

### 3.2 `GET /api/assessments`

**File:** `src/__tests__/integration/api/assessments/list.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-ALIST-01 | Auth user lists own 3 assessments | `200`, array of 3 ordered by `updatedAt` DESC |
| I-ALIST-02 | Other user's assessments not returned | Only the requesting user's assessments present |
| I-ALIST-03 | Unauthenticated | `401` |
| I-ALIST-04 | No assessments seeded | `200`, `[]` |
| I-ALIST-05 | Response shape is summary | Items have `id`, `systemName`, `riskLevel`, `createdAt`; no `obligations` blob |

---

### 3.3 `GET /api/assessments/[id]`

**File:** `src/__tests__/integration/api/assessments/get.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-AGET-01 | Owner fetches own assessment | `200`, full detail including `obligations`, `citedArticles`, `reasoning` |
| I-AGET-02 | Different authenticated user | `403` |
| I-AGET-03 | Anonymous assessment with matching `anonymousId` cookie | `200` |
| I-AGET-04 | Anonymous assessment without `anonymousId` cookie | `403` |
| I-AGET-05 | Nonexistent ID | `404` |
| I-AGET-06 | Malformed / non-UUID ID | `400` |
| I-AGET-07 | Unauthenticated fetch of user-owned assessment | `401` |

---

### 3.4 `GET /api/badge/[id]`

**File:** `src/__tests__/integration/api/badge.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-BADGE-01 | Valid assessment ID | `200`, `Content-Type: image/svg+xml` |
| I-BADGE-02 | Public — no auth required | No cookie → `200` |
| I-BADGE-03 | SVG body contains risk level label | e.g. `"HIGH RISK"` text node for a high-risk assessment |
| I-BADGE-04 | SVG fill color matches `RISK_COLORS[riskLevel].badge` | Hex color value present in markup |
| I-BADGE-05 | Nonexistent assessment ID | `404` |
| I-BADGE-06 | Caching header present | `Cache-Control: public, max-age=86400` |

---

### 3.5 `GET /api/assessments/[id]/pdf`

**File:** `src/__tests__/integration/api/pdf.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-PDF-01 | Owner downloads PDF | `200`, `Content-Type: application/pdf` |
| I-PDF-02 | Non-empty PDF body | `Content-Length > 0` |
| I-PDF-03 | Non-owner | `403` |
| I-PDF-04 | Nonexistent assessment | `404` |
| I-PDF-05 | No cookie / no matching `anonymousId` | `401` or `403` |

---

### 3.6 `POST /api/auth/register`

**File:** `src/__tests__/integration/api/auth/register.test.ts`

| Test ID | Scenario | Input | Expected |
|---|---|---|---|
| I-AUTH-01 | Valid registration | `{email:"new@test.com", password:"Passw0rd"}` | `201`, body has `id` + `email`, no `passwordHash` |
| I-AUTH-02 | Password stored as bcrypt hash | Inspect DB after registration | `passwordHash` starts with `$2b$12$` |
| I-AUTH-03 | Duplicate email | Register same email twice | Second → `409` |
| I-AUTH-04 | Invalid email format | `{email:"notanemail"}` | `400` |
| I-AUTH-05 | No uppercase in password | `{password:"password1"}` | `400` |
| I-AUTH-06 | No digit in password | `{password:"Password"}` | `400` |
| I-AUTH-07 | Password too short | `{password:"Pa0"}` | `400` |
| I-AUTH-08 | Login rate limit (6th attempt / 15 min) | 6 POSTs to login with wrong password | 6th → `429` |

---

### 3.7 Session / JWT

**File:** `src/__tests__/integration/api/auth/session.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-AUTH-09 | Successful login sets HTTP-only cookie | `Set-Cookie` has `HttpOnly; Secure; SameSite=Lax` |
| I-AUTH-10 | JWT payload contains `userId` | Decoded JWT `sub` equals registered user's DB id |
| I-AUTH-11 | `/dashboard` redirects without session | `302` to `/auth/login` |
| I-AUTH-12 | `/dashboard` accessible with valid session | `200` |
| I-AUTH-13 | Google OAuth provider registered | `providers` includes `{id: "google"}` |

---

### 3.8 `POST /api/v1/classify` (Public API)

**File:** `src/__tests__/integration/api/v1/classify.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-V1-01 | Valid API key + valid payload | `200`, `{riskLevel, obligations, citedArticles}` |
| I-V1-02 | Missing `Authorization` header | `401` |
| I-V1-03 | Invalid or revoked API key | `401` |
| I-V1-04 | Valid key but malformed payload | `400` |
| I-V1-05 | Rate limit for API key | Exceeding `API_AUTHENTICATED` limit → `429` |
| I-V1-06 | Response shape matches `ClassificationResult` type | Structural assertion |

---

### 3.9 Rate Limiting

**File:** `src/__tests__/integration/api/rate-limit.test.ts`

| Test ID | Scenario | Expected |
|---|---|---|
| I-RATE-01 | Anonymous `POST /api/assessments`: 20 succeed, 21st fails | `429` on 21st |
| I-RATE-02 | Auth `POST /api/assessments`: 60 succeed, 61st fails | `429` on 61st |
| I-RATE-03 | `Retry-After` header on every 429 | Integer seconds value |
| I-RATE-04 | Different IPs (`X-Forwarded-For`) isolated | Mock IP per test |
| I-RATE-05 | Badge endpoint (smoke — 1000/hr) | 10 rapid requests all succeed |

---

## 4. E2E Tests (Playwright)

**Config:** `playwright.config.ts` — Chromium, Firefox, WebKit (iPhone 13)
**Base URL:** `http://localhost:3000`
**Global setup:** `playwright/global-setup.ts` — `prisma migrate reset`, seeds `TEST_USER` with 2
pre-existing assessments.

### 4.1 Directory Layout

```
playwright/
  pages/
    LandingPage.ts
    CheckerPage.ts
    ResultsPage.ts
    DashboardPage.ts
    AuthPage.ts
  fixtures/
    users.ts
    answers.ts
  global-setup.ts
  global-teardown.ts
  tests/
    landing.spec.ts
    questionnaire.spec.ts
    results.spec.ts
    auth.spec.ts
    dashboard.spec.ts
    accessibility.spec.ts
    performance.spec.ts
```

### 4.2 Required `data-testid` Attributes

These **must be present** in source components before E2E tests are written:

| Component | `data-testid` |
|---|---|
| Landing hero CTA button | `hero-cta` |
| Landing FAQ section wrapper | `faq-section` |
| Deadline countdown | `deadline-countdown` |
| Questionnaire form wrapper | `questionnaire-form` |
| Individual question card | `question-card` |
| Progress bar | `progress-bar` |
| Back button | `back-button` |
| Next / Submit button | `next-button` |
| System name input | `system-name-input` |
| Results risk level badge | `risk-level-badge` |
| Results obligations list | `obligations-list` |
| Results badge embed code block | `badge-embed-code` |
| Results PDF download button | `download-pdf-button` |
| Results share / copy badge button | `share-badge-button` |
| Dashboard assessment list | `assessment-list` |
| Individual dashboard assessment row | `assessment-item` |

---

### 4.3 F5: Landing Page

**File:** `playwright/tests/landing.spec.ts`

| Test ID | Steps | Assertions |
|---|---|---|
| E-LAND-01 | Navigate to `/` | `<title>` contains "EU AI Act"; `<meta name="description">` present; OG tags present |
| E-LAND-02 | Navigate to `/`, scroll to FAQ | `[data-testid="faq-section"]` visible; `<script type="application/ld+json">` contains `"@type":"FAQPage"` |
| E-LAND-03 | Navigate to `/` | `[data-testid="deadline-countdown"]` shows a positive integer |
| E-LAND-04 | Click `[data-testid="hero-cta"]` | URL becomes `/checker` |
| E-LAND-05 | Viewport 390×844 (mobile) | Hamburger visible; desktop nav hidden |
| E-LAND-06 | Click hamburger | Mobile nav links become visible |

---

### 4.4 F1: Questionnaire — Anonymous Happy Paths

**File:** `playwright/tests/questionnaire.spec.ts`

| Test ID | Steps | Assertions |
|---|---|---|
| E-QUEST-01 | Navigate to `/checker` (no auth) | Form visible; Q1 present; progress bar at 0% |
| E-QUEST-02 | Answer Q1 "Not an AI system" → Next | `/checker/results`; badge says "MINIMAL" |
| E-QUEST-03 | Q1 yes → Q2 provider → Q3 no → Q4 social scoring → Next | Badge says "UNACCEPTABLE" |
| E-QUEST-04 | AI, provider, no GPAI, no prohibited, safety component yes | Badge says "HIGH" |
| E-QUEST-05 | AI, provider, employment domain, decision function, not narrow | Badge says "HIGH" |
| E-QUEST-06 | AI, deployer, no safety, no high-risk domain, interacts with people | Badge says "LIMITED" |
| E-QUEST-07 | Answer Q1–Q3 | Progress bar width ≈ 25% |
| E-QUEST-08 | Answer Q1 + Q2, click back | Q1 shown; previous answer pre-selected |
| E-QUEST-09 | Answer Q1–Q3, reload page | Q4 shown (state restored from localStorage) |
| E-QUEST-10 | Type "Acme Hiring Bot" in system name, complete questionnaire | Name appears on results page |
| E-QUEST-11 | Tab-only keyboard navigation through Q1 | Space/Enter selects and advances |
| E-QUEST-12 | Checkbox: select two domains simultaneously | Both checked |
| E-QUEST-13 | Checkbox: select domain, then select "None of the above" | Domain unchecked; only "None" checked |

---

### 4.5 F2: Results — Obligation Checklist

**File:** `playwright/tests/results.spec.ts`

| Test ID | Steps | Assertions |
|---|---|---|
| E-RES-01 | Complete high-risk provider path | `[data-testid="obligations-list"]` has 11 items |
| E-RES-02 | Click article reference link | New tab opens to `eur-lex.europa.eu` URL |
| E-RES-03 | Complete unacceptable risk path | Obligations contain "Cease practice immediately" |
| E-RES-04 | High-risk provider — verify all 11 obligation titles | Risk mgmt, data governance, technical docs, logging, transparency, human oversight, accuracy, QMS, conformity, registration, post-market monitoring |
| E-RES-05 | Complete minimal risk path | Obligations list empty or shows "no obligations" message |

---

### 4.6 F3: Compliance Badge

**File:** `playwright/tests/results.spec.ts` (continued)

| Test ID | Steps | Assertions |
|---|---|---|
| E-RES-06 | Complete any assessment | `[data-testid="share-badge-button"]` visible |
| E-RES-07 | Click share/copy button | `[data-testid="badge-embed-code"]` contains `<img src="...api/badge/..."` |
| E-RES-08 | Open badge URL in incognito context | SVG renders; no redirect to login |
| E-RES-09 | Badge URL without any cookie | `200 image/svg+xml` |

---

### 4.7 F4: PDF Export

**File:** `playwright/tests/results.spec.ts` (continued)

| Test ID | Steps | Assertions |
|---|---|---|
| E-RES-10 | Complete assessment, click `[data-testid="download-pdf-button"]` | File download triggered; file has `.pdf` extension |
| E-RES-11 | Anonymous assessment (no login) | Download button visible and functional |

---

### 4.8 Auth Flows

**File:** `playwright/tests/auth.spec.ts`

| Test ID | Steps | Assertions |
|---|---|---|
| E-AUTH-01 | `/auth/register` with valid form | Redirected from register page; session cookie set |
| E-AUTH-02 | Register with already-used email | Error message displayed |
| E-AUTH-03 | Register with weak password | Inline validation error before submission |
| E-AUTH-04 | Login with correct credentials | Redirected to `/dashboard` |
| E-AUTH-05 | Login with wrong password | Error message displayed |
| E-AUTH-06 | Navigate to `/dashboard` without auth | Redirected to `/auth/login` |
| E-AUTH-07 | Click logout | Session cleared; redirected to `/` |

---

### 4.9 Dashboard

**File:** `playwright/tests/dashboard.spec.ts`
**Precondition:** Logged in as `test@example.com` with 2 pre-seeded assessments.

| Test ID | Steps | Assertions |
|---|---|---|
| E-DASH-01 | Navigate to `/dashboard` | `[data-testid="assessment-list"]` has 2 items |
| E-DASH-02 | Click `[data-testid="assessment-item"]` | Navigates to assessment detail / results page |
| E-DASH-03 | Complete new assessment while logged in → return to dashboard | 3 items shown |
| E-DASH-04 | Assessment item content | System name and risk level text visible |

---

### 4.10 Accessibility (WCAG 2.1 AA)

**File:** `playwright/tests/accessibility.spec.ts`

| Test ID | Page | Assertions |
|---|---|---|
| E-A11Y-01 | `/` | `checkAccessibility()` zero critical violations |
| E-A11Y-02 | `/checker` | Zero critical violations; all inputs have accessible labels |
| E-A11Y-03 | `/checker/results` | Zero critical violations; color contrast ≥ 4.5:1 |
| E-A11Y-04 | `/auth/login` | Zero critical violations |
| E-A11Y-05 | Keyboard-only full questionnaire | Tab / Enter / Space sufficient to reach results; no mouse |
| E-A11Y-06 | Skip-to-content | First Tab press focuses `#main-content` skip link on every page |

---

### 4.11 Performance

**File:** `playwright/tests/performance.spec.ts`

| Test ID | Page | Metric | Threshold |
|---|---|---|---|
| E-PERF-01 | `/` | LCP via `PerformanceObserver` | < 1500 ms |
| E-PERF-02 | `/checker` | Time to interactive | < 1500 ms |
| E-PERF-03 | `/api/badge/[id]` (edge function) | Response time | < 200 ms |

---

## 5. Property-Based Tests

**Library:** `fast-check`
**Location:** `src/__tests__/property/`
**Runner:** Vitest — standard `it()` blocks with `fc.assert(fc.property(...))` inside.
**Runs per property:** 1000 (default `numRuns`).

| Test ID | Module | Property | Generators |
|---|---|---|---|
| P-CLS-01 | `classifier.ts` | `riskLevel` always one of 4 valid enum values | `fc.record` with arbitrary answer strings |
| P-CLS-02 | `classifier.ts` | `classify()` never throws for any valid partial `AssessmentAnswers` | Arbitrary partial record |
| P-CLS-03 | `classifier.ts` | `citedArticles` always non-empty array | Same arbitrary answers |
| P-OBL-01 | `obligations.ts` | `getObligationsForLevel` returns array for every `(RiskLevel, UserRole)` pair | `fc.constantFrom` over enums |
| P-VAL-01 | `schemas.ts` | `assessmentAnswersSchema.parse()` never throws on valid-string partial records | `fc.record` with optional valid strings |
| P-VAL-02 | `schemas.ts` | `registerSchema` rejects passwords missing uppercase OR digit | `fc.string` filtered to omit those chars |
| P-UTIL-01 | `utils.ts` | `slugify(s)` always matches `/^[a-z0-9-]*$/` | `fc.string` (unicode) |
| P-UTIL-02 | `utils.ts` | `truncate(s, n).length <= n + 1` | `fc.string`, `fc.nat({max:200})` |
| P-UTIL-03 | `utils.ts` | `generateAnonymousId()` always matches `/^[a-z0-9_-]+$/` | No input; run 1000× |
| P-ASSESS-01 | API roundtrip | POST then GET by ID: `riskLevel` identical in both | Arbitrary valid `AssessmentAnswers` |
| P-QUEST-01 | `questions.ts` | Following `next()` chain never produces a cycle | Graph traversal with all possible answer values |
| P-RATE-01 | `limiter.ts` | After exactly N requests at limit, `success` flips to `false` | `fc.nat({min:1, max:100})` for limit |

---

## 6. Per-Module Coverage Targets

Enforced via `vitest.config.ts` `coverage.thresholds`. Engine targets are set at 100% because a
missed branch is a potential **legal misclassification**.

| Module / Path | Statements | Branches | Functions | Lines | Rationale |
|---|---|---|---|---|---|
| `src/lib/engine/classifier.ts` | **100%** | **100%** | **100%** | **100%** | Every branch is a legal compliance decision |
| `src/lib/engine/obligations.ts` | **100%** | **100%** | **100%** | **100%** | Every obligation is a legal requirement |
| `src/lib/engine/questions.ts` | **95%** | **90%** | **100%** | **95%** | Branching chain coverage |
| `src/lib/engine/articles.ts` | **100%** | **100%** | **100%** | **100%** | Static data; trivially coverable |
| `src/lib/engine/types.ts` | **100%** | **100%** | **100%** | **100%** | Types covered by importing tests |
| `src/lib/validation/schemas.ts` | **100%** | **95%** | **100%** | **100%** | Security boundary |
| `src/lib/auth/config.ts` | **90%** | **85%** | **90%** | **90%** | Auth security |
| `src/lib/auth/providers.ts` | **90%** | **85%** | **90%** | **90%** | Auth security |
| `src/lib/rate-limit/limiter.ts` | **95%** | **90%** | **100%** | **95%** | Rate-limit correctness |
| `src/lib/utils.ts` | **95%** | **90%** | **100%** | **95%** | Pure utility functions |
| `src/lib/constants.ts` | **80%** | N/A | N/A | **80%** | Static data |
| `src/components/checker/QuestionnaireProvider.tsx` | **90%** | **85%** | **90%** | **90%** | Core UI state machine |
| `src/components/checker/QuestionCard.tsx` | **85%** | **80%** | **85%** | **85%** | UI component |
| `src/components/checker/QuestionnaireShell.tsx` | **85%** | **80%** | **85%** | **85%** | UI component |
| `src/app/api/assessments/route.ts` | **90%** | **85%** | **90%** | **90%** | API contract + rate-limit branches |
| `src/app/api/auth/register/route.ts` | **95%** | **90%** | **95%** | **95%** | Auth security boundary |
| `src/app/api/badge/[id]/route.ts` | **85%** | **80%** | **85%** | **85%** | Public endpoint |
| `src/app/api/v1/classify/route.ts` | **90%** | **85%** | **90%** | **90%** | Public API |
| **Global minimum (all other files)** | **80%** | **75%** | **80%** | **80%** | Baseline floor |

### `vitest.config.ts` threshold block

```ts
coverage: {
  provider: "v8",
  include: ["src/lib/**", "src/components/checker/**", "src/app/api/**"],
  exclude: ["src/__tests__/**", "src/**/*.d.ts"],
  thresholds: {
    "src/lib/engine/**": {
      statements: 100, branches: 100, functions: 100, lines: 100
    },
    "src/lib/validation/**": {
      statements: 100, branches: 95, functions: 100, lines: 100
    },
    global: {
      statements: 80, branches: 75, functions: 80, lines: 80
    }
  }
}
```

---

## 7. Test Data & Fixtures

### 7.1 E2E Seeded Users

```ts
// playwright/fixtures/users.ts
export const TEST_USER  = { email: "test@example.com",  password: "Passw0rd1" };
export const TEST_USER2 = { email: "other@example.com", password: "Passw0rd2" };
// TEST_USER has 2 pre-seeded assessments: 1 high-risk (provider), 1 minimal
```

### 7.2 Canonical Answer Sets (shared across all layers)

```ts
// src/__tests__/fixtures/answers.ts
export const ANSWERS = {
  NOT_AI_SYSTEM: { isAiSystem: "no" },

  UNACCEPTABLE: {
    isAiSystem: "yes", role: "provider", prohibitedPractice: "social_scoring"
  },

  HIGH_RISK_PROVIDER: {
    isAiSystem: "yes", role: "provider", gpai: "no",
    prohibitedPractice: "none", safetyComponent: "no",
    domain: ["employment"], aiFunction: "decision",
    narrowTask: "no", profilesPersons: "no",
    interactsWithPeople: "no", syntheticContent: "no", emotionRecognition: "no"
  },

  HIGH_RISK_DEPLOYER: {
    /* same as above with role: "deployer" */
  },

  LIMITED_RISK: {
    isAiSystem: "yes", role: "provider", gpai: "no",
    prohibitedPractice: "none", safetyComponent: "no",
    domain: [], aiFunction: "recommendation",
    narrowTask: "yes", profilesPersons: "no",
    interactsWithPeople: "yes", syntheticContent: "no", emotionRecognition: "no"
  },

  MINIMAL_RISK: {
    isAiSystem: "yes", role: "provider", gpai: "no",
    prohibitedPractice: "none", safetyComponent: "no",
    domain: [], aiFunction: "recommendation",
    narrowTask: "yes", profilesPersons: "no",
    interactsWithPeople: "no", syntheticContent: "no", emotionRecognition: "no"
  }
};
```

### 7.3 Mock Files

| File | Purpose |
|---|---|
| `src/__tests__/mocks/prisma.ts` | `vi.mock("@/lib/db/client")` — typed mock Prisma client factory |
| `src/__tests__/mocks/nextauth.ts` | `vi.mock("next-auth")` — `getServerSession` returns `TEST_USER` |
| `src/__tests__/mocks/storage.ts` | `localStorage` / `sessionStorage` stub (JSDOM Storage) |
| `src/__tests__/mocks/resend.ts` | `vi.mock("resend")` — prevents real email sends |

---

## 8. Playwright Configuration

```ts
// playwright.config.ts
export default defineConfig({
  globalSetup:    "./playwright/global-setup.ts",
  globalTeardown: "./playwright/global-teardown.ts",
  use: {
    baseURL:    "http://localhost:3000",
    trace:      "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "chromium",     use: { ...devices["Desktop Chrome"]  } },
    { name: "firefox",      use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-safari",use: { ...devices["iPhone 13"]       } }
  ],
  reporter: [
    ["html",  { outputFolder: "playwright-report"         }],
    ["junit", { outputFile:   "test-results/junit.xml"    }]
  ],
  webServer: {
    command:             "pnpm dev",
    url:                 "http://localhost:3000",
    reuseExistingServer: !process.env.CI
  }
});
```

---

## 9. Out of Scope (P1/P2 Features)

Excluded pending implementation:

- Documentation templates (`/api/templates`)
- Assessment comparison UI
- Email reminder integration (Resend) — mock boundary only
- Multi-language / i18n
- API key management UI
- Compliance timeline visualisation
- Team plan multi-user scoping

---

## 10. Test Execution Reference

```bash
# All unit tests
pnpm vitest run

# Unit tests with v8 coverage report
pnpm vitest run --coverage

# Integration tests only
pnpm vitest run src/__tests__/integration

# Property-based tests only
pnpm vitest run src/__tests__/property

# Watch mode during development
pnpm vitest

# All E2E tests (requires running dev server)
pnpm playwright test

# Headed / debug single spec
pnpm playwright test playwright/tests/questionnaire.spec.ts --headed --debug

# Accessibility suite
pnpm playwright test playwright/tests/accessibility.spec.ts

# Performance suite
pnpm playwright test playwright/tests/performance.spec.ts

# View last E2E HTML report
pnpm playwright show-report
```
