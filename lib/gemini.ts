import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash', 
  'gemini-1.5-flash-8b'
];

const MAX_REQUESTS_PER_IP = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP - 1, resetTime };
  }

  if (entry.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - entry.count, resetTime: entry.resetTime };
}

function cleanExpiredEntries(): void {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [ip, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

setInterval(cleanExpiredEntries, 5 * 60 * 1000);

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

interface GenerationResult {
  success: boolean;
  result?: string;
  error?: string;
  errorType?: 'quota' | 'invalid_key' | 'network' | 'model' | 'unknown';
  usedKeyIndex?: number;
  usedModel?: string;
}

async function tryGenerateWithKey(
  apiKey: string, 
  prompt: string, 
  modelIndex: number
): Promise<GenerationResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  for (let m = modelIndex; m < MODELS.length; m++) {
    const modelName = MODELS[m];
    console.log(`[Gemini] Trying key ${apiKey.slice(0, 15)}... with model: ${modelName}`);
    
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`[Gemini] Success with key ${apiKey.slice(0, 15)}... and model: ${modelName}`);
      
      return { 
        success: true, 
        result: text,
        usedKeyIndex: getApiKeys().indexOf(apiKey),
        usedModel: modelName
      };
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorCode = error.status || '';
      
      console.error(`[Gemini] Error with model ${modelName}:`, errorMessage);
      
      if (errorCode === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        if (m < MODELS.length - 1) {
          console.log(`[Gemini] Quota/Model issue, trying next model: ${MODELS[m + 1]}`);
          continue;
        }
        return { 
          success: false, 
          error: 'Quota exceeded',
          errorType: 'quota'
        };
      }
      
      if (errorCode === 404 || errorMessage.includes('not found') || errorMessage.includes('model not found')) {
        if (m < MODELS.length - 1) {
          console.log(`[Gemini] Model not found, trying: ${MODELS[m + 1]}`);
          continue;
        }
        return { 
          success: false, 
          error: 'Model not available',
          errorType: 'model'
        };
      }
      
      if (errorCode === 401 || errorMessage.includes('api key') || errorMessage.includes('invalid')) {
        return { 
          success: false, 
          error: 'Invalid API key',
          errorType: 'invalid_key'
        };
      }
      
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
        return { 
          success: false, 
          error: 'Network error',
          errorType: 'network'
        };
      }
      
      return { 
        success: false, 
        error: errorMessage || 'Unknown error',
        errorType: 'unknown'
      };
    }
  }
  
  return { 
    success: false, 
    error: 'All models failed',
    errorType: 'quota'
  };
}

export async function generateContent(prompt: string, ip?: string): Promise<{ 
  result?: string; 
  error?: string; 
  errorType?: 'quota' | 'invalid_key' | 'network' | 'rate_limit' | 'unknown';
  rateLimitRemaining?: number;
  rateLimitReset?: number;
}> {
  if (ip) {
    const rateLimit = getRateLimitInfo(ip);
    if (!rateLimit.allowed) {
      return { 
        error: 'You have used your free limit. Please try again in an hour.',
        errorType: 'rate_limit',
        rateLimitRemaining: 0,
        rateLimitReset: rateLimit.resetTime
      };
    }
  }
  
  const apiKeys = getApiKeys();
  
  if (apiKeys.length === 0) {
    console.error('[Gemini] No API keys configured');
    return { 
      error: 'Service configuration error, please contact support',
      errorType: 'invalid_key'
    };
  }
  
  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    console.log(`[Gemini] Attempting with key ${keyIndex + 1} of ${apiKeys.length}`);
    
    const result = await tryGenerateWithKey(apiKeys[keyIndex], prompt, 0);
    
    if (result.success && result.result) {
      return { 
        result: result.result,
        rateLimitRemaining: ip ? getRateLimitInfo(ip).remaining : undefined
      };
    }
    
    if (result.errorType === 'invalid_key') {
      console.error(`[Gemini] Invalid API key at index ${keyIndex}`);
      continue;
    }
    
    if (result.errorType === 'quota' || result.errorType === 'model') {
      console.log(`[Gemini] Key ${keyIndex + 1} exhausted or model unavailable, trying next key`);
      continue;
    }
    
    if (result.errorType === 'network') {
      return { 
        error: 'Connection failed, please check your internet and try again',
        errorType: 'network'
      };
    }
    
    return { 
      error: result.error || 'An unexpected error occurred',
      errorType: result.errorType
    };
  }
  
  console.error('[Gemini] All API keys exhausted');
  return { 
    error: 'Our AI is very busy right now, please try again in a few hours',
    errorType: 'quota'
  };
}

export function getRateLimitHeaders(ip: string): Record<string, string> {
  const rateLimit = getRateLimitInfo(ip);
  return {
    'X-RateLimit-Limit': MAX_REQUESTS_PER_IP.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
  };
}
