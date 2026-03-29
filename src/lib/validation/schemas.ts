import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(1, "Name is required").max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  password: z.string().min(1, "Password is required"),
});

export const assessmentAnswersSchema = z.object({
  isAiSystem: z.boolean().optional(),
  role: z.enum(["provider", "deployer", "importer", "distributor"]).optional(),
  isGpai: z.boolean().optional(),
  prohibitedPractices: z.array(z.string()).optional(),
  isSafetyComponent: z.boolean().optional(),
  domain: z.string().optional(),
  domainFunction: z.string().optional(),
  isNarrowTask: z.boolean().optional(),
  profilesPersons: z.boolean().optional(),
  interactsWithPeople: z.boolean().optional(),
  generatesSyntheticContent: z.boolean().optional(),
  emotionRecognition: z.boolean().optional(),
});

export const createAssessmentSchema = z.object({
  systemName: z.string().min(1).max(200).optional(),
  answers: assessmentAnswersSchema,
  anonymousId: z.string().max(128).optional(),
});

export const updateAssessmentSchema = z.object({
  systemName: z.string().min(1).max(200).optional(),
  emailReminders: z.boolean().optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const analyticsEventSchema = z.object({
  assessmentId: z.string().optional(),
  eventType: z.enum([
    "started",
    "completed",
    "abandoned",
    "pdf_downloaded",
    "badge_copied",
  ]),
  questionId: z.string().optional(),
  metadata: z.record(z.string().max(100), z.unknown()).optional(),
});

export const classifyRequestSchema = assessmentAnswersSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
