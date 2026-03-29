import { NextResponse } from "next/server";

const LLMS_TXT = `# EU AI Act Compliance Checker

> Free, instant EU AI Act risk classification tool. No login required.

## What this tool does

The EU AI Act Compliance Checker helps organizations and developers classify their AI systems under the EU AI Act risk framework. It determines whether an AI system is prohibited, high-risk, limited-risk, or minimal-risk, and provides a tailored compliance checklist.

## How to use

- Visit https://eu-ai-act.usetools.dev/checker to start a compliance assessment
- Answer questions about your AI system: role (provider/deployer), domain, function, and prohibited practices
- Get instant classification with cited EU AI Act articles and obligation checklist
- Download a compliance badge for your documentation

## API

POST /api/v1/classify — classify an AI system without authentication
POST /api/assessments — classify and optionally save an assessment

## Risk levels

- UNACCEPTABLE — prohibited AI practices under Article 5
- HIGH — AI systems listed in Annex III requiring conformity assessment
- LIMITED — AI systems with transparency obligations under Articles 50-52
- MINIMAL — all other AI systems with no mandatory obligations

## EU AI Act enforcement timeline

- February 2, 2025: Prohibited AI practices (Article 5) took effect
- August 2, 2025: GPAI model rules (Article 51) took effect
- August 2, 2026: Full regulation enforcement deadline

## Source

Tool built by usetools.dev — a portfolio of free, no-login AI utility tools.
`;

export async function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
