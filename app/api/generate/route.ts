import { NextRequest, NextResponse } from 'next/server';
import { generateContent, getRateLimitHeaders } from '@/lib/gemini';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please reduce the content size.' },
        { status: 400 }
      );
    }

    const result = await generateContent(prompt, ip);
    
    if (result.error) {
      const statusCode = result.errorType === 'rate_limit' ? 429 : 500;
      const headers = getRateLimitHeaders(ip);
      
      return NextResponse.json(
        { error: result.error },
        { status: statusCode, headers }
      );
    }
    
    const headers = getRateLimitHeaders(ip);
    
    return NextResponse.json({ 
      result: result.result,
      rateLimit: {
        remaining: result.rateLimitRemaining,
      }
    }, { headers });
    
  } catch (error: any) {
    console.error('API Route Error:', error);
    
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return NextResponse.json(
        { error: 'Connection failed, please check your internet and try again' },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
      return NextResponse.json(
        { error: 'Service configuration error, please contact support' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'AI Generate API is running',
    rateLimit: {
      maxRequests: 10,
      windowMinutes: 60
    }
  });
}
