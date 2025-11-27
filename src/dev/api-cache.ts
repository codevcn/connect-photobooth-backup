/**
 * API Cache System
 * Cache API responses to localStorage with expiration support
 */

export interface CacheConfig {
  /** Cache expiration time in milliseconds (default: 5 minutes) */
  ttl?: number
  /** Cache key prefix */
  prefix?: string
  /** Enable/disable caching */
  enabled?: boolean
}

export interface CachedData<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export class ApiCache {
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly DEFAULT_PREFIX = 'api_cache_'

  private prefix: string
  private ttl: number
  private enabled: boolean

  constructor(config: CacheConfig = {}) {
    this.prefix = config.prefix || ApiCache.DEFAULT_PREFIX
    this.ttl = config.ttl || ApiCache.DEFAULT_TTL
    this.enabled = config.enabled !== false
  }

  /**
   * Generate cache key
   */
  private generateKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    if (!this.enabled) return null

    try {
      const cacheKey = this.generateKey(key)
      const cached = localStorage.getItem(cacheKey)

      if (!cached) return null

      const parsedData: CachedData<T> = JSON.parse(cached)

      // Check if cache is expired
      if (Date.now() > parsedData.expiresAt) {
        this.delete(key)
        return null
      }

      return parsedData.data
    } catch (error) {
      console.error('[ApiCache] Error getting cache:', error)
      return null
    }
  }

  /**
   * Set data to cache
   */
  set<T>(key: string, data: T, customTtl?: number): void {
    if (!this.enabled) return

    try {
      const cacheKey = this.generateKey(key)
      const ttl = customTtl || this.ttl
      const timestamp = Date.now()

      const cachedData: CachedData<T> = {
        data,
        timestamp,
        expiresAt: timestamp + ttl,
      }

      localStorage.setItem(cacheKey, JSON.stringify(cachedData))
    } catch (error) {
      console.error('[ApiCache] Error setting cache:', error)
    }
  }

  /**
   * Delete specific cache
   */
  delete(key: string): void {
    try {
      const cacheKey = this.generateKey(key)
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error('[ApiCache] Error deleting cache:', error)
    }
  }

  /**
   * Clear all cache with this prefix
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('[ApiCache] Error clearing cache:', error)
    }
  }

  /**
   * Get cache info (for debugging)
   */
  getCacheInfo(key: string): { exists: boolean; expired: boolean; timestamp?: number } | null {
    try {
      const cacheKey = this.generateKey(key)
      const cached = localStorage.getItem(cacheKey)

      if (!cached) {
        return { exists: false, expired: false }
      }

      const parsedData: CachedData<unknown> = JSON.parse(cached)
      const expired = Date.now() > parsedData.expiresAt

      return {
        exists: true,
        expired,
        timestamp: parsedData.timestamp,
      }
    } catch (error) {
      console.error('[ApiCache] Error getting cache info:', error)
      return null
    }
  }

  /**
   * Simulate API delay
   */
  private async simulateDelay(fromCache: boolean): Promise<void> {
    if (!this.enabled) return

    // Delay: 1.5s nếu từ cache (giả lập API thật), không delay nếu gọi API thực
    if (fromCache) {
      const delay = 1500 // 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  /**
   * Execute function with cache
   * If cache exists and not expired, return cached data (with simulated delay)
   * Otherwise, execute function and cache result
   */
  async withCache<T>(
    key: string,
    fn: () => Promise<T>,
    customTtl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key)
    if (cached !== null) {
      console.log(`[ApiCache] 🎯 Cache hit for key: ${key}`)
      
      // Simulate API delay for cached data to make it feel like real API call
      await this.simulateDelay(true)
      
      return cached
    }

    // Cache miss - execute function
    console.log(`[ApiCache] ⚡ Cache miss for key: ${key} - Calling real API...`)
    const result = await fn()

    // Save to cache
    this.set(key, result, customTtl)

    return result
  }
}

// Export default instance
export const apiCache = new ApiCache({
  enabled: import.meta.env.DEV, // Only enable in development
  ttl: 10 * 60 * 1000, // 10 minutes
})
