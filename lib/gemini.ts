import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { generateWithGroq, isGroqConfigured } from './providers/groq';

/**
 * Gemini model fallback ladder — newest/cheapest first. Update names here
 * only; everything else (key rotation, Groq fallback) adapts automatically.
 */
export const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
] as const;

const REQUEST_TIMEOUT_MS = 30_000;

function getApiKeys(): string[] {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY_1) keys.push(process.env.GEMINI_API_KEY_1);
  if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2);
  if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3);
  if (keys.length === 0 && process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }
  return keys;
}

export type GenerateErrorType =
  | 'quota'
  | 'invalid_key'
  | 'network'
  | 'model'
  | 'timeout'
  | 'unknown';

export interface GenerateTextResult {
  text?: string;
  provider?: string;
  error?: string;
  errorType?: GenerateErrorType;
}

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function classifyError(err: unknown): { message: string; type: GenerateErrorType } {
  const error = err as { message?: string; status?: number; name?: string };
  const message = error.message?.toLowerCase() || '';
  const code = error.status || 0;

  if (error.name === 'AbortError' || message.includes('timeout') || message.includes('aborted')) {
    return { message: 'Request timed out', type: 'timeout' };
  }
  if (code === 429 || message.includes('quota') || message.includes('rate limit') || message.includes('resource has been exhausted')) {
    return { message: 'Quota exceeded', type: 'quota' };
  }
  if (code === 404 || message.includes('not found')) {
    return { message: 'Model not available', type: 'model' };
  }
  if (code === 401 || code === 403 || message.includes('api key') || message.includes('permission')) {
    return { message: 'Invalid API key', type: 'invalid_key' };
  }
  if (message.includes('fetch') || message.includes('network')) {
    return { message: 'Network error', type: 'network' };
  }
  return { message: error.message || 'Unknown error', type: 'unknown' };
}

async function tryGeminiKey(apiKey: string, prompt: string): Promise<GenerateTextResult> {
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt, { timeout: REQUEST_TIMEOUT_MS });
      const text = result.response.text();
      if (!text) throw new Error('Empty response');

      console.log(`[Gemini] Success with model ${modelName}`);
      return { text, provider: modelName };
    } catch (err) {
      const { message, type } = classifyError(err);
      console.error(`[Gemini] ${modelName} failed: ${message}`);

      // Quota/model errors: fall through to the next model on this key.
      // Key errors: abandon this key entirely. Others: bubble up.
      if (type === 'quota' || type === 'model') continue;
      return { error: message, errorType: type };
    }
  }

  return { error: 'All models exhausted for this key', errorType: 'quota' };
}

/**
 * Provider chain: every Gemini key × model combination, then Groq (if
 * configured). Rate limiting lives in lib/ratelimit.ts, not here.
 */
export async function generateText(prompt: string): Promise<GenerateTextResult> {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0 && !isGroqConfigured()) {
    console.error('[Gemini] No API keys configured');
    return { error: 'Service configuration error, please contact support', errorType: 'invalid_key' };
  }

  let lastError: GenerateTextResult | null = null;

  for (let i = 0; i < apiKeys.length; i++) {
    console.log(`[Gemini] Attempting key ${i + 1} of ${apiKeys.length}`);
    const result = await tryGeminiKey(apiKeys[i], prompt);
    if (result.text) return result;

    lastError = result;
    // Exhausted quota or bad key: rotate to the next key.
    if (result.errorType === 'quota' || result.errorType === 'model' || result.errorType === 'invalid_key') {
      continue;
    }
    // Network/timeout/unknown: retrying another key is unlikely to help mid-request.
    break;
  }

  if (isGroqConfigured()) {
    console.log('[Gemini] All Gemini options exhausted, falling back to Groq');
    const groq = await generateWithGroq(prompt);
    if (groq.success && groq.text) {
      return { text: groq.text, provider: 'groq' };
    }
  }

  if (lastError?.errorType === 'network' || lastError?.errorType === 'timeout') {
    return { error: 'Connection failed, please try again', errorType: lastError.errorType };
  }
  return { error: 'Our AI is very busy right now, please try again later', errorType: 'quota' };
}
