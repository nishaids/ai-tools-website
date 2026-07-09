/**
 * Optional Groq fallback provider. Activates only when every Gemini key/model
 * combination is exhausted and GROQ_API_KEY is set. Uses Groq's
 * OpenAI-compatible chat completions endpoint with JSON mode, so the same
 * JSON output contract applies.
 */

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const TIMEOUT_MS = 30_000;

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export interface GroqResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function generateWithGroq(prompt: string): Promise<GroqResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { success: false, error: 'Groq not configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a precise assistant that always responds with a single valid JSON object and nothing else.',
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[Groq] HTTP ${res.status}: ${body.slice(0, 200)}`);
      return { success: false, error: `Groq HTTP ${res.status}` };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content;
    if (!text) return { success: false, error: 'Groq returned empty response' };

    console.log(`[Groq] Success with model ${GROQ_MODEL}`);
    return { success: true, text };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[Groq] Request failed:', message);
    return { success: false, error: message };
  } finally {
    clearTimeout(timer);
  }
}
