import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateText } from '@/lib/gemini';
import { safeParseJSON } from '@/lib/parse';
import { getToolById, InputField } from '@/lib/tools';
import { TOOL_IDS, outputSchemas, sectionSpecs, ToolId } from '@/lib/schemas';
import { getRateLimiter } from '@/lib/ratelimit';

/**
 * The client sends { toolId, inputs } — never a raw prompt. The prompt is
 * built server-side from the registry template, which prevents prompt
 * injection into arbitrary templates and quota theft via custom prompts.
 */

const bodySchema = z.object({
  toolId: z.enum(TOOL_IDS),
  inputs: z.record(z.string(), z.string()),
  /** Optional section key for the "↻ Improve" per-section regeneration. */
  section: z.string().max(50).optional(),
});

const DEFAULT_TEXT_MAX = 300;
const DEFAULT_TEXTAREA_MAX = 2000;

// Control characters except newline and tab.
const CONTROL_CHARS = new RegExp('[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]', 'g');

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

/** Strip control characters (keep \n and \t), trim, and enforce max length. */
function sanitizeInput(value: string, field: InputField): string {
  const max = field.maxLength ?? (field.type === 'textarea' ? DEFAULT_TEXTAREA_MAX : DEFAULT_TEXT_MAX);
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max);
}

interface ErrorBody {
  error: string;
  errorType: string;
  retryAfter?: number;
}

function errorResponse(body: ErrorBody, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers });
}

function rateLimitHeaders(status: { limit: number; remaining: number; resetAt: number }) {
  return {
    'X-RateLimit-Limit': String(status.limit),
    'X-RateLimit-Remaining': String(status.remaining),
    'X-RateLimit-Reset': String(Math.ceil(status.resetAt / 1000)),
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return errorResponse({ error: 'Invalid JSON body', errorType: 'validation' }, 400);
    }

    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return errorResponse(
        { error: 'Invalid request: expected { toolId, inputs }', errorType: 'validation' },
        400
      );
    }
    const { toolId, inputs, section } = parsed.data;

    const tool = getToolById(toolId);
    if (!tool) {
      return errorResponse({ error: 'Unknown tool', errorType: 'validation' }, 400);
    }

    // Validate + sanitize each registered input server-side; unknown keys are dropped.
    const clean: Record<string, string> = {};
    for (const field of tool.inputs) {
      const value = sanitizeInput(inputs[field.name] ?? '', field);
      if (field.required && !value) {
        return errorResponse(
          { error: `Missing required field: ${field.label}`, errorType: 'validation' },
          400
        );
      }
      clean[field.name] = value;
    }

    // Consume one credit (section regenerations count too).
    const limiter = getRateLimiter();
    const rate = await limiter.consume(ip);
    if (!rate.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000));
      return errorResponse(
        {
          error: 'You have used your free limit. Please try again in an hour.',
          errorType: 'rate_limit',
          retryAfter,
        },
        429,
        { ...rateLimitHeaders(rate), 'Retry-After': String(retryAfter) }
      );
    }

    // Build the prompt on the server from the registry template.
    let prompt = tool.promptTemplate;
    for (const field of tool.inputs) {
      const value = clean[field.name] || 'Not provided';
      prompt = prompt.split(`{${field.name}}`).join(value);
    }

    // Section regeneration: same context, but ask for only that fragment.
    let expectedSchema = outputSchemas[toolId as ToolId];
    if (section) {
      const spec = sectionSpecs[toolId as ToolId]?.[section];
      if (!spec) {
        return errorResponse(
          { error: 'Unknown section for this tool', errorType: 'validation' },
          400,
          rateLimitHeaders(rate)
        );
      }
      prompt = `${prompt}\n\nOVERRIDE: ${spec.instruction}`;
      expectedSchema = spec.schema;
    }

    // Generate → parse → validate, with ONE corrective retry on invalid JSON.
    let fallbackText: string | undefined;
    let data: unknown;

    for (let attempt = 0; attempt < 2 && data === undefined; attempt++) {
      const attemptPrompt =
        attempt === 0
          ? prompt
          : `${prompt}\n\nYour previous response was invalid JSON. Return ONLY valid JSON matching the schema. No markdown fences, no commentary.`;

      const generation = await generateText(attemptPrompt);
      if (generation.error || !generation.text) {
        // Provider-level failure: no point retrying the same exhausted chain.
        const status =
          generation.errorType === 'quota' ||
          generation.errorType === 'timeout' ||
          generation.errorType === 'network'
            ? 503
            : 500;
        return errorResponse(
          { error: generation.error || 'Generation failed', errorType: generation.errorType || 'unknown' },
          status,
          rateLimitHeaders(rate)
        );
      }

      fallbackText = generation.text;
      const parsedJson = safeParseJSON(generation.text);
      if (parsedJson.ok) {
        const validated = expectedSchema.safeParse(parsedJson.data);
        if (validated.success) {
          data = validated.data;
        }
      }
    }

    if (data !== undefined) {
      return NextResponse.json(
        {
          data,
          rateLimit: { remaining: rate.remaining, limit: rate.limit, resetAt: rate.resetAt },
        },
        { headers: rateLimitHeaders(rate) }
      );
    }

    // Total JSON failure after retry: surface raw text so the UI can fall
    // back to a plain-text renderer instead of a blank screen.
    console.error(`[API] ${toolId}: JSON parse/validation failed after retry, returning fallback text`);
    return NextResponse.json(
      {
        fallbackText,
        rateLimit: { remaining: rate.remaining, limit: rate.limit, resetAt: rate.resetAt },
      },
      { headers: rateLimitHeaders(rate) }
    );
  } catch (err) {
    console.error('[API] Unexpected error:', err);
    return errorResponse(
      { error: 'An unexpected error occurred. Please try again.', errorType: 'unknown' },
      500
    );
  }
}

/** Health check + current credits for the requesting IP (does not consume). */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await getRateLimiter().peek(ip);
  return NextResponse.json(
    {
      status: 'ok',
      rateLimit: { remaining: rate.remaining, limit: rate.limit, resetAt: rate.resetAt },
    },
    { headers: rateLimitHeaders(rate) }
  );
}
