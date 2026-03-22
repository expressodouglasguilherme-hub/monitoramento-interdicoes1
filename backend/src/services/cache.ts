import { CacheEntry } from '../types';
import { logger } from '../utils/logger';

export class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>>;
  private ttl: number;

  constructor(ttlMs: number) {
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  set(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(key, entry);
    logger.debug('Cache set', { key, timestamp: entry.timestamp });
  }

  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug('Cache miss', { key });
      return null;
    }

    if (this.isExpired(entry)) {
      logger.debug('Cache expired', { key, age: Date.now() - entry.timestamp });
      return entry; // Return expired entry (caller decides what to do)
    }

    logger.debug('Cache hit', { key, age: Date.now() - entry.timestamp });
    return entry;
  }

  isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
      logger.debug('Cache cleared', { key });
    } else {
      this.cache.clear();
      logger.debug('Cache cleared all');
    }
  }
}
