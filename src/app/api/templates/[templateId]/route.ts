import { NextRequest, NextResponse } from "next/server";
import {
  getTemplate,
  getAllTemplates,
  TEMPLATE_IDS,
} from "@/lib/templates/index";
import type { TemplateId } from "@/lib/templates/index";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await params;

  if (templateId === "all") {
    return NextResponse.json({ templates: getAllTemplates() });
  }

  if (!TEMPLATE_IDS.includes(templateId as TemplateId)) {
    return NextResponse.json(
      { error: `Template '${templateId}' not found` },
      { status: 404 },
    );
  }

  const template = getTemplate(templateId as TemplateId);
  return NextResponse.json({ template });
}
