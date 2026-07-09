import { z } from 'zod';

/**
 * Per-tool output contracts. Every tool's prompt demands strict JSON matching
 * one of these schemas. Zod validates (and salvages, via .catch defaults on
 * non-critical fields) the model output server-side, so renderers can trust
 * the shape they receive.
 */

// Lenient primitives: a missing/odd decorative field degrades to a default
// instead of failing the whole generation.
const str = z.string().catch('');
const optStr = z.string().optional().catch(undefined);
const strArr = z.array(z.string()).catch([]);
const num = z.coerce.number().catch(0);

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export const resumeSchema = z.object({
  header: z.object({
    name: z.string(),
    title: str,
    email: str,
    phone: str,
    location: optStr,
    linkedin: optStr,
  }),
  summary: str, // 2-3 sentences, achievement-focused
  experience: z
    .array(
      z.object({
        role: str,
        company: str,
        dates: str,
        bullets: strArr, // action-verb starts, quantified where possible
      })
    )
    .catch([]),
  education: z
    .array(
      z.object({
        degree: str,
        institution: str,
        year: str,
        details: optStr,
      })
    )
    .catch([]),
  skills: z
    .object({ technical: strArr, tools: strArr, soft: strArr })
    .catch({ technical: [], tools: [], soft: [] }),
  atsKeywords: strArr, // keywords for the target role, drives the ATS scorer
});
export type ResumeOutput = z.infer<typeof resumeSchema>;

// ---------------------------------------------------------------------------
// Cover letter
// ---------------------------------------------------------------------------

export const coverLetterSchema = z.object({
  sender: z.object({ name: str, email: str, phone: str }).catch({ name: '', email: '', phone: '' }),
  recipient: z
    .object({ name: optStr, title: optStr, company: str })
    .catch({ name: undefined, title: undefined, company: '' }),
  salutation: str, // "Dear Hiring Manager," / "Dear Ms. Smith,"
  bodyParagraphs: z.array(z.string()).min(1),
  closing: str, // "Sincerely,"
  signature: str, // sender name
});
export type CoverLetterOutput = z.infer<typeof coverLetterSchema>;

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export const emailSchema = z.object({
  subject: z.string(),
  greeting: str,
  bodyParagraphs: z.array(z.string()).min(1),
  signOff: str, // "Best regards,"
  signature: str,
});
export type EmailOutput = z.infer<typeof emailSchema>;

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

export const invoiceSchema = z.object({
  invoiceNumber: str,
  issueDate: str,
  dueDate: str,
  currency: z.string().catch('$'),
  from: z.object({ name: str, addressLines: strArr }).catch({ name: '', addressLines: [] }),
  to: z.object({ name: str, addressLines: strArr }).catch({ name: '', addressLines: [] }),
  items: z
    .array(
      z.object({
        description: str,
        quantity: z.coerce.number().catch(1),
        rate: num,
        amount: num,
      })
    )
    .min(1),
  // Totals are recomputed client-side from items; these are hints only.
  subtotal: num,
  taxRate: num, // percent, e.g. 10 for 10%
  taxAmount: num,
  total: num,
  paymentTerms: optStr,
  notes: optStr,
});
export type InvoiceOutput = z.infer<typeof invoiceSchema>;

// ---------------------------------------------------------------------------
// Bio (variants by length)
// ---------------------------------------------------------------------------

export const bioSchema = z.object({
  variants: z
    .array(
      z.object({
        length: str, // "Short" | "Medium" | "Long"
        text: z.string(),
      })
    )
    .min(1),
});
export type BioOutput = z.infer<typeof bioSchema>;

// ---------------------------------------------------------------------------
// Product description
// ---------------------------------------------------------------------------

export const productDescriptionSchema = z.object({
  headline: z.string(),
  description: str, // hero paragraph, benefit-led
  bullets: strArr, // feature -> benefit statements
  seoKeywords: strArr,
});
export type ProductDescriptionOutput = z.infer<typeof productDescriptionSchema>;

// ---------------------------------------------------------------------------
// Blog titles
// ---------------------------------------------------------------------------

export const blogTitleSchema = z.object({
  titles: z
    .array(
      z.object({
        title: z.string(),
        style: str, // "Listicle" | "How-to" | ...
        rationale: optStr, // why it would perform
      })
    )
    .min(1),
});
export type BlogTitleOutput = z.infer<typeof blogTitleSchema>;

// ---------------------------------------------------------------------------
// Instagram caption
// ---------------------------------------------------------------------------

export const socialCaptionSchema = z.object({
  hook: str, // first visible line, must work under ~125 chars
  variants: z
    .array(
      z.object({
        style: str, // "Storytelling" | "Punchy" | ...
        caption: z.string(),
      })
    )
    .min(1),
  hashtags: strArr,
  cta: str,
});
export type SocialCaptionOutput = z.infer<typeof socialCaptionSchema>;

// ---------------------------------------------------------------------------
// Cold email
// ---------------------------------------------------------------------------

export const coldEmailSchema = z.object({
  subjectVariants: z.array(z.string()).min(1),
  greeting: str,
  bodyParagraphs: z.array(z.string()).min(1),
  cta: str,
  signOff: str,
  followUp: z
    .object({
      delayDays: z.coerce.number().catch(3),
      subject: str,
      body: str,
    })
    .catch({ delayDays: 3, subject: '', body: '' }),
});
export type ColdEmailOutput = z.infer<typeof coldEmailSchema>;

// ---------------------------------------------------------------------------
// YouTube script
// ---------------------------------------------------------------------------

export const youtubeScriptSchema = z.object({
  titleOptions: strArr,
  hook: str, // first 30 seconds, verbatim script
  sections: z
    .array(
      z.object({
        timestamp: str, // "0:00"
        heading: str,
        content: z.string(), // script with [B-ROLL]/[GRAPHICS] cues
      })
    )
    .min(1),
  cta: str,
  description: str, // upload-ready video description
  tags: strArr,
});
export type YouTubeScriptOutput = z.infer<typeof youtubeScriptSchema>;

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const TOOL_IDS = [
  'resume-builder',
  'cover-letter',
  'email-writer',
  'invoice-generator',
  'bio-generator',
  'product-description',
  'blog-title',
  'instagram-caption',
  'cold-email',
  'youtube-script',
] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export const outputSchemas: Record<ToolId, z.ZodTypeAny> = {
  'resume-builder': resumeSchema,
  'cover-letter': coverLetterSchema,
  'email-writer': emailSchema,
  'invoice-generator': invoiceSchema,
  'bio-generator': bioSchema,
  'product-description': productDescriptionSchema,
  'blog-title': blogTitleSchema,
  'instagram-caption': socialCaptionSchema,
  'cold-email': coldEmailSchema,
  'youtube-script': youtubeScriptSchema,
};

export interface ToolOutputMap {
  'resume-builder': ResumeOutput;
  'cover-letter': CoverLetterOutput;
  'email-writer': EmailOutput;
  'invoice-generator': InvoiceOutput;
  'bio-generator': BioOutput;
  'product-description': ProductDescriptionOutput;
  'blog-title': BlogTitleOutput;
  'instagram-caption': SocialCaptionOutput;
  'cold-email': ColdEmailOutput;
  'youtube-script': YouTubeScriptOutput;
}

// ---------------------------------------------------------------------------
// Section-level regeneration ("↻ Improve" buttons)
// ---------------------------------------------------------------------------

export interface SectionSpec {
  label: string;
  /** Extra instruction appended to the tool's base prompt. */
  instruction: string;
  /** Validates the returned fragment, e.g. { summary: "..." }. */
  schema: z.ZodTypeAny;
}

export const sectionSpecs: Partial<Record<ToolId, Record<string, SectionSpec>>> = {
  'resume-builder': {
    summary: {
      label: 'Summary',
      instruction:
        'Rewrite ONLY the professional summary. Make it sharper: 2-3 sentences, lead with years of experience and strongest quantified achievement, tailored to the target role. Respond with ONLY valid JSON: {"summary": "..."}',
      schema: z.object({ summary: z.string() }),
    },
    experience: {
      label: 'Experience',
      instruction:
        'Rewrite ONLY the experience section. Strengthen every bullet: start with a distinct action verb, quantify impact (%, $, counts), 8-20 words each. Respond with ONLY valid JSON: {"experience": [{"role": "...", "company": "...", "dates": "...", "bullets": ["..."]}]}',
      schema: z.object({ experience: resumeSchema.shape.experience }),
    },
    skills: {
      label: 'Skills',
      instruction:
        'Rewrite ONLY the skills section, optimized for ATS keyword matching against the target role. Respond with ONLY valid JSON: {"skills": {"technical": ["..."], "tools": ["..."], "soft": ["..."]}}',
      schema: z.object({ skills: resumeSchema.shape.skills }),
    },
  },
  'cover-letter': {
    bodyParagraphs: {
      label: 'Body',
      instruction:
        'Rewrite ONLY the body paragraphs. Make them more specific and confident: concrete achievements with numbers, clear company knowledge, strong closing ask. 3-4 paragraphs. Respond with ONLY valid JSON: {"bodyParagraphs": ["...", "..."]}',
      schema: z.object({ bodyParagraphs: z.array(z.string()).min(1) }),
    },
  },
  'email-writer': {
    bodyParagraphs: {
      label: 'Body',
      instruction:
        'Rewrite ONLY the email body paragraphs: tighter, clearer, same intent and tone. Respond with ONLY valid JSON: {"bodyParagraphs": ["...", "..."]}',
      schema: z.object({ bodyParagraphs: z.array(z.string()).min(1) }),
    },
  },
  'cold-email': {
    bodyParagraphs: {
      label: 'Body',
      instruction:
        'Rewrite ONLY the email body paragraphs: sharper personalization, clearer value, under 120 words total. Respond with ONLY valid JSON: {"bodyParagraphs": ["...", "..."]}',
      schema: z.object({ bodyParagraphs: z.array(z.string()).min(1) }),
    },
  },
  'youtube-script': {
    hook: {
      label: 'Hook',
      instruction:
        'Rewrite ONLY the hook (first 30 seconds). Make it impossible to click away from: open a curiosity gap, promise the payoff. Respond with ONLY valid JSON: {"hook": "..."}',
      schema: z.object({ hook: z.string() }),
    },
  },
};
