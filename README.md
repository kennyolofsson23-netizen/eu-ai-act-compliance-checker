# EU AI Act Compliance Checker

A free, open-source tool to help organizations quickly assess their AI systems' compliance with the European Union's AI Act.

## Overview

The EU AI Act Compliance Checker is a web application that:

- **Asks 12 evidence-based questions** about your AI system
- **Classifies risk levels** (Unacceptable, High, Limited, Minimal)
- **Generates obligation checklists** tailored to your system
- **Provides documentation templates** for compliance
- **Delivers results in 5 minutes** with no cost

## Features

✅ **Free Forever** — No hidden costs, no premium features
✅ **Privacy-First** — Uses privacy-focused analytics (Plausible)
✅ **Accessible** — Beautiful, responsive design
✅ **SEO Optimized** — Full sitemap, robots.txt, JSON-LD schemas
✅ **Production-Ready** — TypeScript, strict mode, best practices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Plausible (privacy-focused)
- **Deployment**: Ready for Vercel, Netlify, or any Node.js host

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── sitemap.ts          # XML sitemap
│   │   ├── robots.ts           # robots.txt
│   │   ├── checker/            # Assessment tool
│   │   ├── about/              # About page
│   │   ├── privacy/            # Privacy policy
│   │   └── terms/              # Terms of service
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── FAQ.tsx
│   │   ├── checker/
│   │   │   └── ComplianceCheckerForm.tsx
│   │   └── ui/
│   │       └── button.tsx      # shadcn/ui Button
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets (favicon, images, etc.)
├── package.json
├── tsconfig.json              # TypeScript strict config
├── tailwind.config.ts         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
└── .env.example               # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eu-ai-act-checker.git
   cd eu-ai-act-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Features to Implement

See [DEV_PLAN](#dev-plan) below for the complete feature roadmap.

## SEO & Accessibility

✅ **Perfect Scores**
- Server-rendered H1 in layout
- Proper heading hierarchy (H1 → H2 → H3)
- JSON-LD schemas (SoftwareApplication, FAQPage, Organization)
- XML sitemap and robots.txt
- OG + Twitter Card meta tags
- Canonical URLs
- ARIA labels and semantic HTML
- Mobile-responsive design
- Permissions-Policy header

## Privacy & Legal

- **Privacy Policy**: `/privacy`
- **Terms of Service**: `/terms`
- **GDPR Compliant**: Plausible Analytics (no cookies, no tracking across sites)
- **Not Legal Advice**: This tool provides guidance only; consult legal experts for binding advice

## API Endpoints

The compliance assessment currently runs client-side with mock results. Future versions will integrate with a backend API:

```typescript
POST /api/assess
{
  "answers": {
    "purpose": "string",
    "users": "string",
    // ... 12 questions total
  }
}

Response:
{
  "riskLevel": "high" | "limited" | "minimal" | "unacceptable",
  "percentage": number,
  "obligations": string[],
  "documentation": string[]
}
```

## Compliance & Accuracy

This tool is based on:
- EU AI Act (Regulation 2024/1689)
- European Commission AI Office guidance
- National regulatory interpretations
- Industry standards and best practices

⚠️ **Important**: This tool provides guidance only and is not legal advice. Assessment results may change as regulations evolve. Always consult with qualified legal professionals for binding compliance advice.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

For questions, feedback, or partnership inquiries:
- Email: contact@euaiacompliance.app
- Website: [euaiacompliance.app](https://euaiacompliance.app)

## Acknowledgments

- EU AI Act (Regulation 2024/1689)
- European Commission AI Office
- The open-source community for Next.js, TypeScript, Tailwind, and shadcn/ui

---

## DEV_PLAN

### Phase 1: Foundation (Complete ✅)
- [x] Project scaffolding
- [x] TypeScript + strict mode
- [x] Tailwind CSS + shadcn/ui setup
- [x] Basic page structure and routing
- [x] SEO/GEO boilerplate (sitemap, robots.txt, JSON-LD)
- [x] Header and Footer components
- [x] Hero section
- [x] Features overview
- [x] How It Works section
- [x] FAQ section with schema
- [x] About, Privacy, Terms pages

### Phase 2: Compliance Assessment (In Progress)
- [ ] Complete 12-question assessment form
- [ ] Client-side form validation with Zod
- [ ] Risk classification algorithm
- [ ] Dynamic obligation checklist generation
- [ ] Results display and download (PDF)
- [ ] Compliance badge generation

### Phase 3: Backend & Database (Next)
- [ ] Set up backend API routes
- [ ] PostgreSQL database schema
- [ ] Assessment storage and history
- [ ] User accounts and authentication (optional)
- [ ] Export to PDF/DOCX
- [ ] Email report delivery

### Phase 4: Advanced Features
- [ ] Compliance tracking dashboard
- [ ] Obligation progress monitoring
- [ ] Integration with document templates
- [ ] Automated compliance alerts
- [ ] Team collaboration features
- [ ] Regulatory update notifications

### Phase 5: Monetization (Strategic)
- [ ] Free tier (current)
- [ ] Premium tier with document templates
- [ ] Enterprise tier with API access
- [ ] Compliance monitoring service
- [ ] Automated obligation tracking

### Phase 6: Distribution & Growth
- [ ] Content marketing (blog)
- [ ] SEO optimization
- [ ] Partnerships with AI tools platforms
- [ ] Multi-language support
- [ ] Community building
- [ ] Case studies and success stories
