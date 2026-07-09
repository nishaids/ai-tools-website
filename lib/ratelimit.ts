/**
 * Rate limiting behind a common interface.
 *
 * Default: in-memory Map. NOTE: on serverless (Vercel), the Map lives per
 * lambda instance and resets on every cold start, so limits are best-effort
 * only. For durable limits, set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN — the Redis implementation is auto-selected and
 * uses Upstash's REST API directly (no extra dependency).
 */

export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  /** Epoch ms when the window resets. */
  resetAt: number;
}

export interface RateLimiter {
  /** Consume one credit for this key (if available). */
  consume(key: string): Promise<RateLimitStatus>;
  /** Read the current status without consuming. */
  peek(key: string): Promise<RateLimitStatus>;
}

// ---------------------------------------------------------------------------
// In-memory implementation (default)
// ---------------------------------------------------------------------------

interface MemoryEntry {
  count: number;
  resetAt: number;
}

class MemoryRateLimiter implements RateLimiter {
  private map = new Map<string, MemoryEntry>();
  private lastCleanup = Date.now();

  private cleanup(): void {
    const now = Date.now();
    if (now - this.lastCleanup < 5 * 60 * 1000) return;
    this.lastCleanup = now;
    const keys = Array.from(this.map.keys());
    for (const key of keys) {
      const entry = this.map.get(key);
      if (entry && now > entry.resetAt) this.map.delete(key);
    }
  }

  async consume(key: string): Promise<RateLimitStatus> {
    this.cleanup();
    const now = Date.now();
    let entry = this.map.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
      this.map.set(key, entry);
    }
    if (entry.count >= RATE_LIMIT_MAX) {
      return { allowed: false, remaining: 0, limit: RATE_LIMIT_MAX, resetAt: entry.resetAt };
    }
    entry.count++;
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - entry.count,
      limit: RATE_LIMIT_MAX,
      resetAt: entry.resetAt,
    };
  }

  async peek(key: string): Promise<RateLimitStatus> {
    const now = Date.now();
    const entry = this.map.get(key);
    if (!entry || now > entry.resetAt) {
      return { allowed: true, remaining: RATE_LIMIT_MAX, limit: RATE_LIMIT_MAX, resetAt: now + RATE_LIMIT_WINDOW_MS };
    }
    return {
      allowed: entry.count < RATE_LIMIT_MAX,
      remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
      limit: RATE_LIMIT_MAX,
      resetAt: entry.resetAt,
    };
  }
}

// ---------------------------------------------------------------------------
// Upstash Redis implementation (via REST — zero dependencies)
// ---------------------------------------------------------------------------

class UpstashRateLimiter implements RateLimiter {
  constructor(
    private url: string,
    private token: string,
    private fallback: RateLimiter
  ) {}

  private async command<T>(cmd: (string | number)[]): Promise<T> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cmd),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const json = (await res.json()) as { result: T };
    return json.result;
  }

  async consume(key: string): Promise<RateLimitStatus> {
    try {
      const redisKey = `ratelimit:${key}`;
      const count = await this.command<number>(['INCR', redisKey]);
      if (count === 1) {
        await this.command(['PEXPIRE', redisKey, RATE_LIMIT_WINDOW_MS]);
      }
      const ttl = await this.command<number>(['PTTL', redisKey]);
      const resetAt = Date.now() + (ttl > 0 ? ttl : RATE_LIMIT_WINDOW_MS);
      if (count > RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0, limit: RATE_LIMIT_MAX, resetAt };
      }
      return { allowed: true, remaining: RATE_LIMIT_MAX - count, limit: RATE_LIMIT_MAX, resetAt };
    } catch (err) {
      console.error('[RateLimit] Upstash unreachable, using in-memory fallback:', err);
      return this.fallback.consume(key);
    }
  }

  async peek(key: string): Promise<RateLimitStatus> {
    try {
      const redisKey = `ratelimit:${key}`;
      const count = (await this.command<number | null>(['GET', redisKey])) ?? 0;
      const ttl = await this.command<number>(['PTTL', redisKey]);
      const resetAt = Date.now() + (ttl > 0 ? ttl : RATE_LIMIT_WINDOW_MS);
      const used = Number(count) || 0;
      return {
        allowed: used < RATE_LIMIT_MAX,
        remaining: Math.max(0, RATE_LIMIT_MAX - used),
        limit: RATE_LIMIT_MAX,
        resetAt,
      };
    } catch (err) {
      console.error('[RateLimit] Upstash unreachable, using in-memory fallback:', err);
      return this.fallback.peek(key);
    }
  }
}

// ---------------------------------------------------------------------------
// Auto-selection
// ---------------------------------------------------------------------------

let instance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (instance) return instance;
  const memory = new MemoryRateLimiter();
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  instance = url && token ? new UpstashRateLimiter(url, token, memory) : memory;
  return instance;
}
