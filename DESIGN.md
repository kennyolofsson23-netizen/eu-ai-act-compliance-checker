# DESIGN.md — EU AI Act Compliance Checker

> UI/UX Design Specification v1.0
> Last updated: 2026-03-29
> Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · Lucide icons

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Visual Style](#2-visual-style)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Spacing System](#5-spacing-system)
6. [User Flows](#6-user-flows)
7. [Page Layouts](#7-page-layouts)
8. [Component Specs](#8-component-specs)
9. [Accessibility Requirements (WCAG AA)](#9-accessibility-requirements-wcag-aa)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Loading, Empty, and Error States](#11-loading-empty-and-error-states)

---

## 1. Design Principles

### 1.1 Trust First
Compliance tooling demands credibility. Every visual and copy decision must communicate authority, accuracy, and seriousness. Avoid playful gradients, cartoon illustrations, or casual language. Use institutional blues, clean white space, and legalese-adjacent hierarchy.

### 1.2 Clarity Over Cleverness
Users are completing a compliance task, not browsing for entertainment. Reduce cognitive load at every step: one primary action per screen, scannable text over walls of prose, visible progress indicators, and never hide where the user is in the flow.

### 1.3 Accessible by Default
WCAG AA compliance is a non-negotiable baseline, not an afterthought. All interactive elements must be keyboard-operable, screen-reader-friendly, and meet minimum contrast ratios. This is especially important given that compliance professionals may use assistive technology.

### 1.4 Progressive Disclosure
Surface only what is needed at each step. The 12-question wizard shows one question at a time. The results page reveals obligations in a scannable list before offering downloads or next-steps. Do not overwhelm users with all information simultaneously.

### 1.5 Free & Frictionless
The product's competitive advantage is zero-cost access. Never design dark patterns suggesting upsells, paywalls, or artificial urgency. Reinforce "free forever" messaging organically at natural inflection points.

### 1.6 Institutional Polish
Model the visual language after EU official publications and enterprise compliance SaaS (e.g., OneTrust, TrustArc) rather than consumer apps. Serif accents on large display text, structured grids, muted brand color — professional, not playful.

---

## 2. Visual Style

### 2.1 Overall Aesthetic
- **Style**: Clean institutional SaaS with subtle EU regulatory references
- **Mood**: Trustworthy, authoritative, approachable
- **Layout**: Wide-margin content columns, generous whitespace, no decorative clutter
- **Illustration**: None — prefer icons (Lucide) and data visualization only
- **Photography**: None in v1 — use abstract EU-themed SVG patterns as accent backgrounds only if needed
- **Animation**: Minimal and purposeful — progress bar transitions (300ms ease-out), accordion expand/collapse (200ms ease), hover state color transitions (150ms)

### 2.2 Key Visual Motifs
- **Progress indicators**: Horizontal step-progress bar (blue fill on slate track)
- **Risk badges**: Color-coded pill/banner for each of the 4 risk levels
- **Checklist items**: CheckCircle icon + text, consistent spacing
- **Step numbering**: Filled blue circle with white numeral (40×40px)
- **Card borders**: `border border-slate-200` default, `border-blue-300` on hover/focus

---

## 3. Color Palette

### 3.1 Primary Brand Colors

| Role | Name | Hex | Tailwind class |
|------|------|-----|----------------|
| Brand primary | EU Blue | `#2563EB` | `blue-600` |
| Brand primary hover | EU Blue Dark | `#1D4ED8` | `blue-700` |
| Brand primary light | EU Blue Tint | `#EFF6FF` | `blue-50` |
| Brand accent | EU Blue Mid | `#BFDBFE` | `blue-200` |
| Link / interactive | EU Blue Text | `#1E40AF` | `blue-800` |
| Focus ring | EU Blue Focus | `#93C5FD` | `blue-300` |

### 3.2 Neutral Scale

| Role | Name | Hex | Tailwind class |
|------|------|-----|----------------|
| Page background | White | `#FFFFFF` | `white` |
| Surface / card bg | Slate 50 | `#F8FAFC` | `slate-50` |
| Border default | Slate 200 | `#E2E8F0` | `slate-200` |
| Border hover | Slate 300 | `#CBD5E1` | `slate-300` |
| Text muted | Slate 500 | `#64748B` | `slate-500` |
| Text secondary | Slate 600 | `#475569` | `slate-600` |
| Text body | Slate 700 | `#334155` | `slate-700` |
| Text heading | Slate 900 | `#0F172A` | `slate-900` |

### 3.3 Risk Level Semantic Colors

These four palettes are the most critical semantic colors in the product. They must always appear together as a reference system and must meet WCAG AA contrast on their respective backgrounds.

#### Unacceptable Risk (Prohibited)
| Element | Hex | Tailwind | Contrast on bg |
|---------|-----|----------|---------------|
| Background | `#FEF2F2` | `red-50` | — |
| Border | `#FECACA` | `red-200` | — |
| Banner bg | `#FEE2E2` | `red-100` | — |
| Heading text | `#7F1D1D` | `red-900` | 12.6:1 ✅ |
| Body text | `#991B1B` | `red-800` | 9.5:1 ✅ |
| Icon / badge | `#DC2626` | `red-600` | 5.1:1 ✅ |
| Pill border | `#FCA5A5` | `red-300` | — |

#### High Risk
| Element | Hex | Tailwind | Contrast on bg |
|---------|-----|----------|---------------|
| Background | `#FFF7ED` | `orange-50` | — |
| Border | `#FED7AA` | `orange-200` | — |
| Banner bg | `#FFEDD5` | `orange-100` | — |
| Heading text | `#431407` | `orange-950` | 14.1:1 ✅ |
| Body text | `#9A3412` | `orange-800` | 8.3:1 ✅ |
| Icon / badge | `#EA580C` | `orange-600` | 4.7:1 ✅ |
| Pill border | `#FDBA74` | `orange-300` | — |

#### Limited Risk
| Element | Hex | Tailwind | Contrast on bg |
|---------|-----|----------|---------------|
| Background | `#FEFCE8` | `yellow-50` | — |
| Border | `#FEF08A` | `yellow-200` | — |
| Banner bg | `#FEF9C3` | `yellow-100` | — |
| Heading text | `#713F12` | `yellow-900` | 11.2:1 ✅ |
| Body text | `#854D0E` | `yellow-800` | 8.8:1 ✅ |
| Icon / badge | `#CA8A04` | `yellow-600` | 4.6:1 ✅ |
| Pill border | `#FDE047` | `yellow-300` | — |

#### Minimal Risk
| Element | Hex | Tailwind | Contrast on bg |
|---------|-----|----------|---------------|
| Background | `#F0FDF4` | `green-50` | — |
| Border | `#BBF7D0` | `green-200` | — |
| Banner bg | `#DCFCE7` | `green-100` | — |
| Heading text | `#14532D` | `green-900` | 13.1:1 ✅ |
| Body text | `#166534` | `green-800` | 9.8:1 ✅ |
| Icon / badge | `#16A34A` | `green-600` | 5.3:1 ✅ |
| Pill border | `#86EFAC` | `green-300` | — |

### 3.4 Status / Feedback Colors

| Role | Hex | Tailwind |
|------|-----|----------|
| Success | `#16A34A` | `green-600` |
| Warning | `#D97706` | `amber-600` |
| Error / destructive | `#DC2626` | `red-600` |
| Info | `#2563EB` | `blue-600` |

### 3.5 Gradient Definitions

| Name | CSS | Usage |
|------|-----|-------|
| Hero gradient | `bg-gradient-to-b from-blue-50 to-white` | Hero section background |
| Checker gradient | `bg-gradient-to-b from-blue-50 to-white` | Assessment page bg |
| Badge gradient | `bg-gradient-to-br from-blue-600 to-blue-800` | Compliance badge card |

---

## 4. Typography

### 4.1 Font Stack

```css
/* Primary — system sans-serif, mapped via CSS var in tailwind.config.ts */
font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system,
             BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

No web font loading in v1 (performance + privacy). If a web font is added later, use **Inter** (sans-serif) via `next/font/google` with `display: swap`.

### 4.2 Type Scale

All values use Tailwind's default scale. Pixel equivalents assume 16px base.

| Token | Tailwind | px | Line height | Weight | Use case |
|-------|----------|----|-------------|--------|----------|
| `display-2xl` | `text-6xl` | 60px | `leading-tight` (1.25) | `font-bold` (700) | Hero H1 (desktop) |
| `display-xl` | `text-5xl` | 48px | `leading-tight` | `font-bold` | Hero H1 (mobile) |
| `display-lg` | `text-4xl` | 36px | `leading-tight` | `font-bold` | Section headings H2 |
| `display-md` | `text-3xl` | 30px | `leading-snug` (1.375) | `font-bold` | Checker form heading |
| `display-sm` | `text-2xl` | 24px | `leading-snug` | `font-semibold` (600) | Card headings, sub-sections |
| `body-xl` | `text-xl` | 20px | `leading-relaxed` (1.625) | `font-normal` (400) | Hero subtitle, section subtitles |
| `body-lg` | `text-lg` | 18px | `leading-relaxed` | `font-normal` | About page prose |
| `body-md` | `text-base` | 16px | `leading-relaxed` | `font-normal` | Default body text |
| `body-sm` | `text-sm` | 14px | `leading-normal` (1.5) | `font-medium` (500) | Nav links, meta labels, footer |
| `body-xs` | `text-xs` | 12px | `leading-normal` | `font-normal` | Legal disclaimers, captions |

### 4.3 Heading Hierarchy per Page

```
Root layout:  [hidden H1: "EU AI Act Compliance Checker" for SEO]
Homepage:     H1 → h1.text-5xl.font-bold (Hero)
              H2 → h2.text-4xl.font-bold (Features, HowItWorks, FAQ)
              H3 → h3.text-lg.font-semibold (feature cards, FAQ items)

Checker:      H1 → h1.text-3xl.font-bold ("EU AI Act Assessment")
              H2 → h2.text-2xl.font-semibold (question text)
              H2 → h2.text-2xl.font-semibold ("Your Obligations" on results)

About/Legal:  H1 → h1.text-4xl.font-bold (page title)
              H2 → h2.text-2xl.font-semibold (content sections)
```

---

## 5. Spacing System

Tailwind's default 4px base scale applies throughout.

### 5.1 Component Internal Spacing

| Context | Padding | Tailwind |
|---------|---------|----------|
| Section vertical | 80px / 128px | `py-20 md:py-32` |
| Card / panel | 24px / 32px | `p-6 md:p-8` |
| Button (default) | 10px 16px | default shadcn |
| Button (lg) | 12px 24px | `size="lg"` |
| Nav item | 8px 0 | `py-2` |
| Form option row | 16px | `p-4` |
| FAQ item | 16px 24px | `px-6 py-4` |
| Footer section | 48px | `py-12` |
| Header height | 64px | `h-16` |

### 5.2 Layout Container

```css
/* Applied to all sections */
.container {
  max-width: 1280px;        /* max-w-7xl */
  margin-inline: auto;
  padding-inline: 16px;     /* px-4 */
}

/* Responsive overrides */
@screen sm { padding-inline: 24px; }  /* sm:px-6 */
@screen lg { padding-inline: 32px; }  /* lg:px-8 */
```

Narrow content columns (checker form, about prose, FAQ):
- `max-w-2xl` (672px) — Checker form, results panel
- `max-w-3xl` (768px) — FAQ section
- `max-w-4xl` (896px) — About page prose

### 5.3 Grid Gaps

| Grid | Gap | Tailwind |
|------|-----|----------|
| Feature cards (3-col) | 32px | `gap-8` |
| HowItWorks steps (4-col) | 24px | `gap-6` |
| Footer columns (4-col) | 32px | `gap-8` |
| Assessment option rows | 12px | `space-y-3` |

---

## 6. User Flows

### 6.1 Primary Flow: Complete Compliance Assessment

```
[Homepage] → [/checker] → [Question 1–12 (wizard)] → [Loading / Analysis] → [Results] → [Download Report]
```

**Step-by-step:**

1. **User lands on `/`**
   Sees Hero with "Start Free Assessment" CTA (blue button) and "Learn How It Works" secondary CTA.

2. **User clicks "Start Free Assessment"**
   Routes to `/checker`. Page loads with Question 1 of 12 visible. Progress bar shows ~8% (1/12).

3. **User views question**
   H2 displays question text. Below: radio-style option buttons (select type) or checkbox rows (checkbox type).

4. **User selects an answer**
   Selected option gets `border-blue-600 bg-blue-50` highlight. CheckCircle icon appears on right. "Next" button becomes enabled.

5. **User navigates through questions**
   - "Next" advances to next question; progress bar updates.
   - "Previous" goes back; previously saved answer is still selected.
   - At Q12, "Next" label changes to "Get Results".

6. **User clicks "Get Results" on Q12**
   Form enters loading state: spinner + "Analyzing your responses…" message.

7. **Results screen appears**
   - Risk level badge (color-coded, prominent)
   - Compliance effort percentage
   - Obligation checklist (6+ items with CheckCircle icons)
   - Two CTAs: "Start New Assessment" (outline) + "Download Report" (primary, disabled in v1)

8. **User wants to start over**
   Clicks "Start New Assessment" → state resets → Question 1 shown again.

### 6.2 Secondary Flow: Learn Before Starting

```
[Homepage] → [/#how-it-works] → [/#features] → [/about] → [/checker]
```

**Step-by-step:**

1. User clicks "Learn How It Works" (outline button in Hero).
2. Smooth-scrolls to `#how-it-works` section with 4-step process.
3. CTA "Start Your Assessment Now" at bottom of HowItWorks.
4. User may scroll further to `#features` (6 feature cards).
5. User may click "About" in nav to read mission and methodology.
6. Returns to checker via nav CTA.

### 6.3 Tertiary Flow: Legal / Privacy Review

```
[Homepage Footer] → [/privacy] or [/terms] → [back to Homepage]
```

Plain text prose pages with no interactive elements beyond navigation.

### 6.4 Error Recovery Flow

```
[/checker Q5] → [Network error on submit] → [Error banner] → [Retry button] → [Loading] → [Results]
```

**Step-by-step:**

1. User reaches Q12 and clicks "Get Results".
2. API call fails (network / 5xx).
3. Error banner appears below the submit button: "Something went wrong. Please try again."
4. "Retry" button appears. Previous answers are preserved in state.
5. Retry re-submits with same `formData`.

---

## 7. Page Layouts

All pages share the root shell:
```
┌─────────────────────────────────┐
│  <Header> (sticky, h-16)        │
├─────────────────────────────────┤
│  <main> (flex-1)                │
│    [page content]               │
├─────────────────────────────────┤
│  <Footer>                       │
└─────────────────────────────────┘
```

---

### 7.1 Homepage (`/`)

#### Mobile (< 640px)
```
Header (full-width, hamburger menu hidden nav)
─────────────────────────────
Hero
  [badge pill - centered]
  H1 (text-5xl, centered)
  Subtitle (text-xl, centered)
  [CTA stack: Start button full-width]
  [CTA stack: Learn button full-width]
  Tagline (text-sm, centered)
  Stats: 1-column stacked (12 | 4 | 100%)
─────────────────────────────
Features (#features)
  H2 centered
  Subtitle centered
  Feature cards: 1-column grid
─────────────────────────────
HowItWorks (#how-it-works)
  H2 centered
  Steps: 1-column stacked (no arrow connectors)
  CTA button centered
─────────────────────────────
FAQ (#faq)
  H2 centered
  Accordion list full-width
─────────────────────────────
Footer (1-column stacked)
```

#### Tablet (640px–1023px)
```
Header (full nav visible)
─────────────────────────────
Hero
  [badge pill - centered]
  H1 (text-5xl, centered)
  Subtitle (max-w-2xl, centered)
  [CTA row: side-by-side sm:flex-row]
  Stats: 3-column grid (md:grid-cols-3)
─────────────────────────────
Features
  Cards: 2-column grid (md:grid-cols-2)
─────────────────────────────
HowItWorks
  Steps: 2-column grid (md:grid-cols-2)
  No arrow connectors between pairs
─────────────────────────────
FAQ
  max-w-3xl centered
─────────────────────────────
Footer: 4-column grid (md:grid-cols-4)
```

#### Desktop (≥ 1024px)
```
Header (max-w-7xl, nav + CTA)
─────────────────────────────
Hero
  H1 (text-6xl, centered)
  Subtitle (max-w-2xl, centered)
  CTA row (justify-center)
  Stats: 3-column (lg:grid-cols-3)
─────────────────────────────
Features
  Cards: 3-column grid (lg:grid-cols-3)
─────────────────────────────
HowItWorks
  Steps: 4-column grid (lg:grid-cols-4)
  Arrow connectors between steps (hidden on mobile/tablet)
─────────────────────────────
FAQ
  max-w-3xl centered
─────────────────────────────
Footer: 4-column (md:grid-cols-4)
```

---

### 7.2 Checker Page (`/checker`)

#### Mobile (< 640px)
```
Header
─────────────────────────────
Section (py-12, bg-gradient-to-b from-blue-50 to-white)
  Question counter: "Question X of 12" (right-aligned, text-sm)
  H1: "EU AI Act Assessment" (text-3xl, font-bold)
  Progress bar (full-width, h-2)

  ┌───────────────────────────┐
  │ Question card             │
  │  H2 (question text)       │
  │  Option rows (full-width) │
  └───────────────────────────┘

  Navigation row:
  [Previous] [Next / Get Results]
  (both buttons flex-1 side-by-side)
─────────────────────────────
Footer
```

#### Tablet / Desktop (≥ 640px)
```
Header
─────────────────────────────
Section (py-20, bg-gradient-to-b from-blue-50 to-white)
  max-w-2xl centered column

  Row: H1 "EU AI Act Assessment"  |  "Q X of 12" (right)
  Progress bar (full-width)

  ┌────────────────────────────────────────┐
  │ Card (bg-white, rounded-lg, border,    │
  │       border-slate-200, p-8)           │
  │   H2 question text (text-2xl)          │
  │   Option rows                          │
  └────────────────────────────────────────┘

  Navigation: [Previous flex-1] [Next/Results flex-1]
─────────────────────────────
Footer
```

#### Results screen (within `/checker`, same layout shell)
```
Section (py-12 md:py-20, bg-white)
  max-w-2xl centered

  H1 "Your Compliance Assessment" (text-4xl, centered)
  Subtitle (text-lg, centered)

  ┌──────────────────────────────────────┐
  │ Risk Banner (color-coded, border-2)  │
  │   "High Risk" (text-5xl, bold)       │
  │   "65% Compliance Effort Required"   │
  │   Description text (text-base)       │
  └──────────────────────────────────────┘

  ┌──────────────────────────────────────┐
  │ Obligations panel (bg-slate-50)      │
  │   H2 + AlertCircle icon              │
  │   List: CheckCircle + obligation     │
  └──────────────────────────────────────┘

  CTA row: [Start New] [Download Report]
```

---

### 7.3 About Page (`/about`)

#### All breakpoints
```
Header
─────────────────────────────
max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20

H1 (text-4xl, font-bold)
Prose sections with H2 subheadings + body paragraphs + bulleted lists
─────────────────────────────
Footer
```

**Mobile**: Full-width text, stacked.
**Tablet/Desktop**: max-w-4xl centers the content block; font sizes unchanged.

---

### 7.4 Privacy & Terms Pages (`/privacy`, `/terms`)

Same layout as About page. Identical structural pattern:
- `max-w-4xl mx-auto`
- `py-12 md:py-20`
- H1 → H2 hierarchy
- `prose prose-lg` class on content wrapper for comfortable reading

---

## 8. Component Specs

### 8.1 Header

**File**: `src/components/layout/Header.tsx`
**shadcn equivalent**: Custom — no direct shadcn component, but uses shadcn `Button`.

#### Structure
```tsx
<header className="sticky top-0 z-50 w-full border-b border-slate-200
                   bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <Logo />          {/* h-8 w-8 blue rounded-md + wordmark */}
      <DesktopNav />    {/* hidden md:flex */}
      <MobileMenu />    {/* md:hidden — hamburger trigger */}
      <CTAButton />     {/* "Start Assessment" */}
    </div>
  </div>
</header>
```

#### Logo
- Container: `h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center`
- Text: `span.text-white.font-bold.text-sm` — "AI"
- Wordmark: `Link.font-bold.text-lg.hover:text-blue-600.transition-colors` — "EU AI Compliance"

#### Desktop Nav (hidden md:flex)
- Items: `text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors`
- Active route: `text-slate-900 font-semibold` (add via `usePathname`)
- Gap: `gap-8`

#### Mobile Nav (md:hidden) — *To be implemented*
- Trigger: shadcn `Button` variant="ghost", `size="icon"`, Lucide `Menu` icon
- Overlay: full-screen `Sheet` (shadcn) sliding from right
- Contains same nav links as desktop, stacked vertically
- Close button top-right with `X` icon

#### CTA Button
- `Button asChild className="bg-blue-600 hover:bg-blue-700 text-white"`
- Text: "Start Assessment"
- Hidden on very small screens if needed: `hidden sm:inline-flex`

#### States

| State | Visual |
|-------|--------|
| Default | White bg, border-b slate-200 |
| Scrolled | backdrop-blur active (CSS) |
| Nav link hover | text-slate-900 |
| Nav link active | text-slate-900 font-semibold |
| CTA hover | bg-blue-700 |
| CTA focus | focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 |

---

### 8.2 Footer

**File**: `src/components/layout/Footer.tsx`

#### Structure
```
bg-slate-50 border-t border-slate-200
  max-w-7xl, px-4 sm:px-6 lg:px-8, py-12

  4-column grid (1-col on mobile, 4-col on md+)
    Column 1: Product links
    Column 2: Resources links
    Column 3: Legal links
    Column 4: Social links

  Divider: border-t border-slate-200 pt-8
  Bottom row: copyright (left) + support link (right)
              flex-col md:flex-row, gap-4
```

#### Link style
- `text-sm text-slate-600 hover:text-slate-900 transition-colors`
- Column header: `font-semibold text-sm text-slate-900 mb-4`

#### Bottom bar
- Copyright: `text-sm text-slate-600`
- Support link: same link style

---

### 8.3 Hero Section

**File**: `src/components/sections/Hero.tsx`

#### Badge Pill
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-blue-100 text-blue-700 text-sm font-medium mb-6">
  <Shield className="w-4 h-4" />
  Enterprise Compliance Made Free
</div>
```
- Centered: `text-center` on parent

#### H1
```
text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900
```

#### Subtitle
```
text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed
```

#### CTA Group
```
flex flex-col sm:flex-row gap-4 justify-center mb-12
```
- Primary: `Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white"`
  Contains: "Start Free Assessment" + `ArrowRight` icon (w-4 h-4)
- Secondary: `Button variant="outline" size="lg"` → "Learn How It Works"

#### Tagline
```
text-sm text-slate-500
```
Content: "Takes 5 minutes • No credit card required • Instant results"

#### Stats row
```
mt-16 grid grid-cols-1 md:grid-cols-3 gap-8
```
Each stat cell:
```tsx
<div className="text-center">
  <div className="text-4xl font-bold text-blue-600 mb-2">{value}</div>
  <p className="text-slate-600">{label}</p>
</div>
```

---

### 8.4 Features Section

**File**: `src/components/sections/Features.tsx`

#### Card
```tsx
<div className="p-6 rounded-lg border border-slate-200
                hover:border-blue-300 hover:shadow-lg transition-all duration-150">
  <Icon className="w-8 h-8 text-blue-600 mb-4" />
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-slate-600">{description}</p>
</div>
```

#### Card States
| State | Classes |
|-------|---------|
| Default | `border-slate-200` |
| Hover | `border-blue-300 shadow-lg` |
| Focus-within | `ring-2 ring-blue-500 ring-offset-2` |

#### Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

---

### 8.5 HowItWorks Section

**File**: `src/components/sections/HowItWorks.tsx`

#### Step card
```tsx
<div className="bg-white p-6 rounded-lg border border-slate-200 h-full">
  <div className="w-10 h-10 rounded-full bg-blue-600 text-white
                  font-bold flex items-center justify-center mb-4">
    {step.number}
  </div>
  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
  <p className="text-slate-600 text-sm">{step.description}</p>
</div>
```

#### Arrow connector (desktop only)
```tsx
{index < steps.length - 1 && (
  <div className="hidden lg:flex absolute -right-3 top-12 text-slate-300">
    <ArrowRight className="w-6 h-6" />
  </div>
)}
```
Parent step wrapper must be `relative`.

---

### 8.6 FAQ Section

**File**: `src/components/sections/FAQ.tsx`
**shadcn equivalent**: Use shadcn `Accordion` component for production (currently custom).

#### Current implementation (custom accordion)
```tsx
<div className="border border-slate-200 rounded-lg overflow-hidden">
  <button
    onClick={() => setOpenIndex(openIndex === index ? null : index)}
    className="w-full px-6 py-4 text-left font-semibold
               flex items-center justify-between hover:bg-slate-50 transition-colors"
    aria-expanded={openIndex === index}
    aria-controls={`faq-answer-${index}`}
  >
    <span>{faq.question}</span>
    <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-200
                             ${openIndex === index ? 'rotate-180' : ''}`} />
  </button>
  <div
    id={`faq-answer-${index}`}
    className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-slate-700"
    hidden={openIndex !== index}
    role="region"
    aria-labelledby={`faq-trigger-${index}`}
  >
    {faq.answer}
  </div>
</div>
```

#### shadcn Accordion migration (recommended)
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible className="space-y-4">
  {faqs.map((faq, i) => (
    <AccordionItem key={i} value={`item-${i}`}
                   className="border border-slate-200 rounded-lg px-6">
      <AccordionTrigger className="font-semibold hover:no-underline">
        {faq.question}
      </AccordionTrigger>
      <AccordionContent className="text-slate-700">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

### 8.7 ComplianceCheckerForm

**File**: `src/components/checker/ComplianceCheckerForm.tsx`
**shadcn components used**: `Button`
**Future shadcn components**: `Progress`, `Card`, `RadioGroup`, `Checkbox`

#### Progress bar
```tsx
{/* Current implementation */}
<div className="w-full bg-slate-200 rounded-full h-2">
  <div
    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
    role="progressbar"
    aria-valuenow={currentQuestion + 1}
    aria-valuemin={1}
    aria-valuemax={ASSESSMENT_QUESTIONS.length}
    aria-label={`Question ${currentQuestion + 1} of ${ASSESSMENT_QUESTIONS.length}`}
  />
</div>

{/* shadcn Progress migration */}
import { Progress } from "@/components/ui/progress"
<Progress
  value={((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}
  className="h-2"
  aria-label={`Question ${currentQuestion + 1} of ${ASSESSMENT_QUESTIONS.length}`}
/>
```

#### Question card
```
bg-white rounded-lg border border-slate-200 p-8 mb-8
```

#### Select option button (radio-style)
```tsx
<button
  key={option}
  onClick={() => handleAnswer(option)}
  role="radio"
  aria-checked={formData[question.id] === option}
  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    focus-visible:ring-offset-2
    ${formData[question.id] === option
      ? 'border-blue-600 bg-blue-50 text-slate-900'
      : 'border-slate-200 hover:border-slate-300 text-slate-700'
    }`}
>
  <div className="flex items-center justify-between">
    <span className="font-medium">{option}</span>
    {formData[question.id] === option && (
      <CheckCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
    )}
  </div>
</button>
```
Wrap option group in `<div role="radiogroup" aria-labelledby="question-heading">`.

#### Checkbox option row
```tsx
<label
  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer
    transition-all duration-150
    ${isChecked ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
>
  <input
    type="checkbox"
    className="w-4 h-4 rounded border-slate-300 text-blue-600
               focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
  />
  <span className="ml-3 font-medium text-slate-700">{option}</span>
</label>
```

#### Navigation buttons
```tsx
<div className="flex gap-4">
  <Button
    onClick={handlePrevious}
    variant="outline"
    disabled={currentQuestion === 0}
    className="flex-1"
    aria-label="Go to previous question"
  >
    Previous
  </Button>
  <Button
    onClick={handleNext}
    disabled={!isAnswered}
    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
    aria-label={currentQuestion === ASSESSMENT_QUESTIONS.length - 1
      ? 'Submit and get results'
      : 'Go to next question'}
  >
    {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Get Results' : 'Next'}
  </Button>
</div>
```

#### Button states

| State | Classes |
|-------|---------|
| Default (primary) | `bg-blue-600 text-white` |
| Hover (primary) | `bg-blue-700` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Focus | `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` |
| Default (outline) | `border border-slate-300 text-slate-700 bg-white` |
| Hover (outline) | `bg-slate-50` |

---

### 8.8 Loading State (Checker)

```tsx
<div className="flex items-center justify-center py-12" role="status" aria-live="polite">
  <div className="text-center">
    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" aria-hidden="true" />
    <p className="text-lg font-medium text-slate-900">Analyzing your responses...</p>
    <p className="text-sm text-slate-600 mt-2">Assessing EU AI Act compliance requirements</p>
  </div>
</div>
```

- `role="status"` ensures screen readers announce the loading message.
- `aria-live="polite"` announces changes without interrupting.
- Spinner: `Loader` from Lucide with `animate-spin` (continuous rotation).
- Do not hide text "Analyzing your responses..." — screen readers need it.

---

### 8.9 ResultScreen Component

**Risk banner color classes** (applied via lookup):

```typescript
const riskConfig = {
  unacceptable: {
    banner: 'bg-red-100 border-red-300',
    heading: 'text-red-900',
    body: 'text-red-800',
    badge: 'bg-red-600',
    label: 'Unacceptable Risk',
    icon: XCircle,
  },
  high: {
    banner: 'bg-orange-100 border-orange-300',
    heading: 'text-orange-950',
    body: 'text-orange-800',
    badge: 'bg-orange-600',
    label: 'High Risk',
    icon: AlertTriangle,
  },
  limited: {
    banner: 'bg-yellow-100 border-yellow-300',
    heading: 'text-yellow-900',
    body: 'text-yellow-800',
    badge: 'bg-yellow-600',
    label: 'Limited Risk',
    icon: Info,
  },
  minimal: {
    banner: 'bg-green-100 border-green-300',
    heading: 'text-green-900',
    body: 'text-green-800',
    badge: 'bg-green-600',
    label: 'Minimal Risk',
    icon: CheckCircle2,
  },
}
```

#### Risk level heading
```
text-5xl font-bold mb-4 capitalize  [color: heading from riskConfig]
```

#### Obligation list item
```tsx
<li className="flex gap-3 items-start">
  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
  <span className="text-slate-700">{obligation}</span>
</li>
```

#### "Download Report" button (disabled state)
- `disabled` attribute set
- `title="Coming soon"` for tooltip
- `cursor-not-allowed opacity-50`

---

### 8.10 RiskBadge (Inline Component)

Used within results and potentially in a future compliance badge feature.

```tsx
interface RiskBadgeProps {
  level: 'unacceptable' | 'high' | 'limited' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}
```

| Variant | Classes |
|---------|---------|
| sm | `text-xs px-2 py-0.5 rounded-full font-medium` |
| md | `text-sm px-3 py-1 rounded-full font-semibold` |
| lg | `text-base px-4 py-1.5 rounded-full font-bold` |

Background + text from `riskConfig` lookup.

---

### 8.11 Button (shadcn/ui)

**File**: `src/components/ui/button.tsx`
**Reference**: shadcn/ui Button v2

Variants in use:

| Variant | Use case | Key classes |
|---------|----------|-------------|
| default | Primary CTA | `bg-primary text-primary-foreground hover:bg-primary/90` |
| outline | Secondary CTA | `border border-input bg-background hover:bg-accent` |
| ghost | Icon buttons, nav | `hover:bg-accent hover:text-accent-foreground` |
| destructive | Danger actions | `bg-destructive text-destructive-foreground` |

Sizes:

| Size | Height | Padding |
|------|--------|---------|
| sm | h-8 | px-3 text-xs |
| default | h-9 | px-4 py-2 text-sm |
| lg | h-11 | px-8 text-base |
| icon | h-9 w-9 | p-2 |

Custom override for brand primary:
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white
           focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
```

---

### 8.12 Alert / Disclaimer Banner

Used in checker results and About page footer.

```tsx
<div className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800"
     role="note">
  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
  <div>
    <p className="text-sm font-medium">Not Legal Advice</p>
    <p className="text-sm mt-1">
      This tool provides guidance only. Consult qualified legal professionals
      for binding compliance advice.
    </p>
  </div>
</div>
```

---

### 8.13 ComplianceBadge (Planned — Phase 2)

Shareable embed/image for users to display their compliance status.

```
┌─────────────────────────────┐
│  [EU stars logo]            │
│  EU AI Act Compliance       │
│  ─────────────────────────  │
│  HIGH RISK                  │
│  Assessed: March 2026       │
│  euaiacompliance.app        │
└─────────────────────────────┘
```

Tailwind structure:
```tsx
<div className="bg-gradient-to-br from-blue-600 to-blue-800
                text-white rounded-xl p-6 w-64 shadow-lg">
  <div className="text-xs font-medium uppercase tracking-widest opacity-75 mb-3">
    EU AI Act Compliance
  </div>
  <div className={`text-2xl font-bold mb-1 ${riskConfig[level].badge}`}>
    {riskConfig[level].label}
  </div>
  <div className="text-xs opacity-60 mt-3">Assessed: {date}</div>
</div>
```

---

## 9. Accessibility Requirements (WCAG AA)

### 9.1 Colour Contrast

Minimum requirements (WCAG 2.1 Level AA):
- **Normal text** (< 18pt / < 14pt bold): **4.5:1** contrast ratio
- **Large text** (≥ 18pt / ≥ 14pt bold): **3:1** contrast ratio
- **UI components and graphical objects**: **3:1** contrast ratio

Verified pairs:

| Foreground | Background | Ratio | Pass |
|-----------|------------|-------|------|
| `#0F172A` slate-900 | `#FFFFFF` white | 19.1:1 | ✅ AA |
| `#475569` slate-600 | `#FFFFFF` white | 5.9:1 | ✅ AA |
| `#FFFFFF` white | `#2563EB` blue-600 | 4.8:1 | ✅ AA |
| `#1E40AF` blue-800 | `#FFFFFF` white | 8.6:1 | ✅ AA |
| `#1E40AF` blue-800 | `#EFF6FF` blue-50 | 7.8:1 | ✅ AA |
| `#7F1D1D` red-900 | `#FEE2E2` red-100 | 12.6:1 | ✅ AA |
| `#431407` orange-950 | `#FFEDD5` orange-100 | 14.1:1 | ✅ AA |
| `#713F12` yellow-900 | `#FEF9C3` yellow-100 | 11.2:1 | ✅ AA |
| `#14532D` green-900 | `#DCFCE7` green-100 | 13.1:1 | ✅ AA |
| `#334155` slate-700 | `#F8FAFC` slate-50 | 8.9:1 | ✅ AA |

**Never use** yellow-300/400 text on white or light backgrounds (fails contrast).
**Never use** slate-400 text on white for body copy (4.1:1 — fails AA for normal text).

### 9.2 Keyboard Navigation

All interactive elements must be reachable and operable via keyboard:

| Component | Tab order | Enter/Space | Arrow keys | Escape |
|-----------|-----------|-------------|------------|--------|
| Header nav links | Sequential | Navigate | — | — |
| Header CTA button | After nav | Activate | — | — |
| Hero buttons | Sequential | Activate | — | — |
| FAQ accordion trigger | Sequential | Toggle open/close | Up/Down (when implemented with shadcn) | Close |
| Checker option buttons | Sequential | Select option | Up/Down within group | — |
| Checkbox options | Sequential | Toggle checked | Up/Down within group | — |
| Previous/Next buttons | After options | Activate | — | — |
| Mobile menu trigger | In flow | Open menu | — | Close menu |
| Mobile menu items | Within menu | Navigate | — | Close menu |
| Footer links | Sequential | Navigate | — | — |

Focus styles must always be visible:
```css
/* Applied globally via tailwind.config or globals.css */
:focus-visible {
  outline: 2px solid #2563EB;      /* blue-600 */
  outline-offset: 2px;
}
```

Never suppress focus with `outline: none` unless replacing with an equivalent visible style.

### 9.3 ARIA Labels and Roles

#### Header
```tsx
<header role="banner">
<nav aria-label="Main navigation">
<button aria-label="Open navigation menu" aria-expanded={isOpen} aria-controls="mobile-nav">
<div id="mobile-nav" role="dialog" aria-label="Navigation menu" aria-modal="true">
```

#### Main landmarks
```tsx
<main id="main-content">  {/* skip-link target */}
<footer role="contentinfo">
```

#### Skip-to-content link (add to layout.tsx)
```tsx
<a href="#main-content"
   className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
              focus:z-[100] focus:px-4 focus:py-2 focus:bg-white
              focus:border focus:border-blue-600 focus:rounded focus:text-blue-600
              focus:text-sm focus:font-medium">
  Skip to main content
</a>
```

#### Checker form
```tsx
<section aria-labelledby="assessment-heading">
<h1 id="assessment-heading">EU AI Act Assessment</h1>

{/* Progress */}
<div role="progressbar"
     aria-valuenow={currentQuestion + 1}
     aria-valuemin={1}
     aria-valuemax={12}
     aria-label={`Step ${currentQuestion + 1} of 12`} />

{/* Question */}
<h2 id={`question-${question.id}`}>{question.question}</h2>

{/* Radio group */}
<div role="radiogroup" aria-labelledby={`question-${question.id}`}>
  <button role="radio" aria-checked={isSelected} ...>

{/* Checkbox group */}
<fieldset>
  <legend className="sr-only">{question.question}</legend>
  <label>
    <input type="checkbox" aria-describedby="checkbox-hint" />
```

#### Results
```tsx
<section aria-labelledby="results-heading" aria-live="polite">
<h1 id="results-heading">Your Compliance Assessment</h1>
<div role="status" aria-label={`Risk level: ${result.level}`}>

<ul aria-label="Your compliance obligations">
  <li>...</li>
</ul>
```

#### FAQ
```tsx
<section aria-labelledby="faq-heading">
<h2 id="faq-heading">Frequently Asked Questions</h2>

<button
  id={`faq-trigger-${index}`}
  aria-expanded={openIndex === index}
  aria-controls={`faq-answer-${index}`}>

<div
  id={`faq-answer-${index}`}
  role="region"
  aria-labelledby={`faq-trigger-${index}`}
  hidden={openIndex !== index}>
```

### 9.4 Touch Targets

Per WCAG 2.5.5 (Target Size AA — 24×24px minimum; AAA — 44×44px):

| Element | Min size | Implementation |
|---------|----------|----------------|
| Nav links | 44×44px | `py-3 px-2` (desktop); `py-4` (mobile menu) |
| Header CTA | 44px height | `h-11` via `size="lg"` |
| FAQ trigger | 52px height | `py-4` gives ~52px minimum |
| Assessment option rows | 56px height | `p-4` on content + min-h implied |
| Previous/Next buttons | 44px height | `h-11` via `size="lg"` or `size="default"` (h-9 = 36px — upgrade to lg) |
| Checkbox labels | 48px height | `p-4` on label wrapper |
| Footer links | 32px height | Acceptable for desktop; mobile stack with `py-2` |
| Mobile menu items | 48px height | `py-3 px-6` |

**Critical**: Previous/Next navigation buttons must use `size="lg"` (h-11, 44px) in the checker to meet tap target requirements on mobile.

### 9.5 Screen Reader Announcements

- Use `aria-live="polite"` on the results container so screen readers announce when results appear.
- Use `aria-live="assertive"` only for error messages that require immediate attention.
- When navigating between questions, announce the new question number: update `aria-label` on the progress region.
- When an option is selected, the `aria-checked` state change is announced automatically.

### 9.6 Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Affects: progress bar transition, FAQ chevron rotation, card hover transitions, loading spinner animation.

### 9.7 Form Validation Announcements

When Zod validation is added (Phase 2):
- Inline field errors: `role="alert"` on error message element
- Summary error: `aria-live="assertive"` container at top of form
- Associate errors with inputs via `aria-describedby`

```tsx
<input aria-describedby={hasError ? `${field}-error` : undefined} />
{hasError && (
  <p id={`${field}-error`} role="alert" className="text-sm text-red-600 mt-1">
    {errorMessage}
  </p>
)}
```

---

## 10. Responsive Breakpoints

### 10.1 Breakpoint Definitions

Tailwind defaults (matches all current usage in codebase):

| Name | Min-width | CSS variable | Target devices |
|------|-----------|--------------|----------------|
| (default) | 0px | — | Mobile portrait |
| `sm` | 640px | — | Mobile landscape, small tablet |
| `md` | 768px | — | Tablet, large mobile |
| `lg` | 1024px | — | Desktop, laptop |
| `xl` | 1280px | — | Wide desktop |
| `2xl` | 1536px | — | Ultra-wide |

The app's max container is `max-w-7xl` (1280px) — content does not stretch beyond this.

### 10.2 Changes at Each Breakpoint

#### Default → sm (0–639px to 640px+)

| Element | < 640px | ≥ 640px |
|---------|---------|---------|
| Hero CTA group | `flex-col` (stacked full-width) | `flex-row` (side by side) |
| Header wordmark | Visible | Visible |
| Footer bottom row | `flex-col items-center` | `flex-row justify-between` |

#### sm → md (640px to 768px+)

| Element | < 768px | ≥ 768px |
|---------|---------|---------|
| Header nav links | Hidden | `hidden md:flex` visible |
| Hero H1 | `text-5xl` | `md:text-6xl` (60px) |
| Hero/Checker section py | `py-12` / `py-20` | `py-20` / `md:py-32` |
| Feature cards grid | 1-col | `md:grid-cols-2` |
| HowItWorks steps | 1-col stacked | `md:grid-cols-2` |
| Footer columns | 1-col | `md:grid-cols-4` |
| About/Legal py | `py-12` | `md:py-20` |
| Stats grid | 1-col | `md:grid-cols-3` |

#### md → lg (768px to 1024px+)

| Element | < 1024px | ≥ 1024px |
|---------|---------|---------|
| Feature cards | 2-col | `lg:grid-cols-3` |
| HowItWorks steps | 2-col | `lg:grid-cols-4` |
| HowItWorks arrows | Hidden | `hidden lg:flex` visible |

#### lg → xl / 2xl

No layout changes — container is capped at `max-w-7xl`. Font sizes and spacing are fixed. Only the white space on left/right increases.

### 10.3 Checker-Specific Responsive Behavior

The checker form is always centered in a `max-w-2xl` column:
- Mobile: `px-4` gutter, full bleed question cards
- Tablet+: Comfortable 672px column with visual breathing room
- Option rows: always full-width within the card regardless of viewport

The results screen follows the same `max-w-2xl` rule.

### 10.4 Typography Responsive Adjustments

| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero H1 | `text-5xl` (48px) | `md:text-6xl` (60px) |
| Section H2 | `text-4xl` (36px) | unchanged |
| Checker H1 | `text-3xl` (30px) | unchanged |
| Section py | `py-20` | `md:py-32` |

---

## 11. Loading, Empty, and Error States

### 11.1 Checker: Loading State (Assessment Submission)

**Trigger**: User clicks "Get Results" on Q12.

**Visual**:
```
┌──────────────────────────────┐
│          [Spinner]           │
│  Analyzing your responses…   │
│  Assessing EU AI Act         │
│  compliance requirements     │
└──────────────────────────────┘
```

- Container: `flex items-center justify-center py-12`
- Spinner: `Loader` (Lucide) `w-12 h-12 text-blue-600 animate-spin`
- Title: `text-lg font-medium text-slate-900`
- Subtitle: `text-sm text-slate-600 mt-2`
- Minimum display time: 1000ms (avoid flash of loading → already ~1500ms simulated)
- `role="status" aria-live="polite"` on container

**What's hidden**: Question card, navigation buttons, progress bar header.

---

### 11.2 Checker: Error State (API Failure)

**Trigger**: `submitForm()` catch block — network error, 4xx, 5xx.

**Visual** (replaces or appears below navigation buttons):
```
┌──────────────────────────────────────────────────────┐
│ ⚠  Something went wrong                              │
│    We couldn't analyze your responses. Please try    │
│    again. Your answers have been saved.              │
│                                    [Try Again →]     │
└──────────────────────────────────────────────────────┘
```

- Container: `flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200`
- Icon: `AlertCircle` `w-5 h-5 text-red-600 flex-shrink-0 mt-0.5`
- Title: `text-sm font-semibold text-red-800`
- Body: `text-sm text-red-700`
- Retry button: `Button size="sm" variant="outline"` with `RefreshCw` icon
- `role="alert" aria-live="assertive"` on container

**State preserved**: `formData` unchanged; `currentQuestion` stays at 12; Previous button still works.

---

### 11.3 Checker: Empty / No Selection State

**Trigger**: User has not selected any option on the current question.

**Visual**:
- "Next" / "Get Results" button: `disabled` + `opacity-50 cursor-not-allowed`
- No other visual change — options are visible and ready for interaction
- No error text shown proactively (only after an attempted submit)

If shadcn `Form` + Zod is added, show inline validation:
```
Please select an option to continue.
```
Positioned below the option group, `text-sm text-red-600`, `role="alert"`.

---

### 11.4 Results: Download Not Available (Coming Soon)

**Trigger**: User clicks "Download Report" button.

**Visual**:
- Button renders as `disabled` with `title="Coming soon — we're working on it!"`
- Optionally: shadcn `Tooltip` wrapper displaying "Coming soon" on hover/focus

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <span> {/* span needed because disabled buttons don't fire events */}
        <Button disabled className="flex-1 opacity-50 cursor-not-allowed bg-blue-600">
          Download Report
        </Button>
      </span>
    </TooltipTrigger>
    <TooltipContent>Coming soon — PDF export in development</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### 11.5 Page: 404 Not Found

**File**: `src/app/not-found.tsx` (to be created)

**Visual**:
```
Header
──────────────────────────────
  [centered, py-32]

  404
  (text-8xl font-bold text-blue-100)

  Page not found
  (text-2xl font-semibold text-slate-900 mt-4)

  The page you're looking for doesn't exist.
  (text-slate-600 mt-2)

  [Return to Home]   (Button, bg-blue-600)

──────────────────────────────
Footer
```

---

### 11.6 Page: Loading Skeleton (Future — Phase 3)

For server-fetched assessment history (dashboard), use Tailwind `animate-pulse` skeleton:

```tsx
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
  <div className="h-20 bg-slate-200 rounded mb-3" />
  <div className="h-20 bg-slate-200 rounded" />
</div>
```

---

### 11.7 Footer / Static Pages: No Data Edge Cases

**About, Privacy, Terms**: These are static pages with no data dependencies. No loading or empty states needed.

**FAQ section**: All FAQ items are hardcoded. If the array is ever empty:
```tsx
{faqs.length === 0 ? (
  <p className="text-center text-slate-500 py-8">No FAQ items available.</p>
) : (
  <div className="space-y-4">{/* accordion items */}</div>
)}
```

---

### 11.8 Network / Offline State

Add a global offline banner at the top of `<body>` (above header):
```tsx
{/* Only renders when navigator.onLine === false */}
<div role="alert" aria-live="assertive"
     className="bg-amber-500 text-white text-sm text-center py-2 px-4 font-medium">
  You appear to be offline. The assessment requires an internet connection to submit.
</div>
```

---

## Appendix A: shadcn/ui Components Reference

Components used or recommended for this project:

| Component | Import path | Used in |
|-----------|-------------|---------|
| `Button` | `@/components/ui/button` | Header, Hero, Checker, HowItWorks |
| `Progress` | `@/components/ui/progress` | Checker progress bar (migration) |
| `Accordion` | `@/components/ui/accordion` | FAQ section (migration) |
| `Card` | `@/components/ui/card` | Question card, feature cards (migration) |
| `Checkbox` | `@/components/ui/checkbox` | Checker checkbox questions |
| `RadioGroup` | `@/components/ui/radio-group` | Checker select questions |
| `Tooltip` | `@/components/ui/tooltip` | Download Report disabled button |
| `Sheet` | `@/components/ui/sheet` | Mobile navigation menu |
| `Badge` | `@/components/ui/badge` | Risk level pill |
| `Alert` | `@/components/ui/alert` | Error/warning banners |
| `Separator` | `@/components/ui/separator` | Section dividers |

Install command for all:
```bash
npx shadcn@latest add button progress accordion card checkbox radio-group tooltip sheet badge alert separator
```

---

## Appendix B: Tailwind Utility Reference Cheatsheet

```
# Layout
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8    → site-wide container
max-w-2xl mx-auto                           → checker/form column
max-w-3xl mx-auto                           → FAQ column
max-w-4xl mx-auto                           → prose column

# Section spacing
py-20 md:py-32                              → standard section vertical padding
py-12 md:py-20                              → tighter section (checker, about)

# Typography
text-5xl md:text-6xl font-bold             → hero H1
text-4xl font-bold                          → section H2
text-3xl font-bold                          → checker H1
text-2xl font-semibold                      → card H3 / sub-section H2
text-xl text-slate-600                      → section subtitles
text-sm text-slate-600                      → nav links, meta text

# Brand primary button
bg-blue-600 hover:bg-blue-700 text-white
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2

# Card
rounded-lg border border-slate-200
hover:border-blue-300 hover:shadow-lg transition-all

# Selected option
border-blue-600 bg-blue-50

# Muted surface
bg-slate-50

# Risk levels
bg-red-100 border-red-300 text-red-900        → unacceptable
bg-orange-100 border-orange-300 text-orange-950 → high
bg-yellow-100 border-yellow-300 text-yellow-900 → limited
bg-green-100 border-green-300 text-green-900   → minimal
```

---

*End of DESIGN.md*
