/**
 * Robust JSON extraction for LLM responses. Models occasionally wrap JSON in
 * markdown fences or add stray commentary despite instructions; this recovers
 * the payload instead of failing the generation.
 */

export interface ParseResult {
  ok: boolean;
  data?: unknown;
}

/** Strip ```json ... ``` / ``` ... ``` fences if the response is wrapped in them. */
function stripFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1] : trimmed;
}

/**
 * Extract the first balanced {...} block via bracket matching, ignoring
 * braces inside string literals.
 */
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export function safeParseJSON(text: string): ParseResult {
  if (!text) return { ok: false };

  const cleaned = stripFences(text);

  try {
    return { ok: true, data: JSON.parse(cleaned) };
  } catch {
    // fall through to bracket extraction
  }

  const extracted = extractFirstJsonObject(cleaned);
  if (extracted) {
    try {
      return { ok: true, data: JSON.parse(extracted) };
    } catch {
      // Last resort: models sometimes emit trailing commas.
      try {
        return { ok: true, data: JSON.parse(extracted.replace(/,\s*([}\]])/g, '$1')) };
      } catch {
        return { ok: false };
      }
    }
  }

  return { ok: false };
}
