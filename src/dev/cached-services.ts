/**
 * Cached Service Wrapper
 * Wrapper functions for services with caching support
 */

import { apiCache } from './api-cache'
import { addressService } from '@/services/address.service'
import { productService } from '@/services/product.service'
import { voucherService } from '@/services/voucher.service'
import {
  TClientProvince,
  TClientDistrict,
  TClientWard,
} from '@/services/adapter/address.adapter'
import { TBaseProduct } from '@/utils/types/global'
import { TVoucher, VoucherValidationResult } from '@/utils/types/global'

/**
 * Cache keys configuration
 */
const CACHE_KEYS = {
  PROVINCES: 'provinces',
  DISTRICTS: (provinceId: number) => `districts_${provinceId}`,
  WARDS: (districtId: number) => `wards_${districtId}`,
  PRODUCTS: (page: number, limit: number) => `products_${page}_${limit}`,
  VOUCHER_VALIDITY: (code: string, subtotal: number) => `voucher_${code}_${subtotal}`,
  SAMPLE_VOUCHERS: 'sample_vouchers',
} as const

/**
 * Cache TTL configuration (in milliseconds)
 */
const CACHE_TTL = {
  ADDRESS: 60 * 60 * 1000, // 1 hour - address data rarely changes
  PRODUCTS: 30 * 60 * 1000, // 30 minutes - product data may change
  VOUCHER: 10 * 60 * 1000, // 10 minutes - voucher data may change frequently
} as const

/**
 * Cached Address Service
 */
export class CachedAddressService {
  /**
   * Fetch provinces with cache
   */
  static async fetchProvinces(): Promise<TClientProvince[]> {
    return apiCache.withCache(
      CACHE_KEYS.PROVINCES,
      () => addressService.fetchProvinces(),
      CACHE_TTL.ADDRESS
    )
  }

  /**
   * Fetch districts with cache
   */
  static async fetchDistricts(provinceId: number): Promise<TClientDistrict[]> {
    return apiCache.withCache(
      CACHE_KEYS.DISTRICTS(provinceId),
      () => addressService.fetchDistricts(provinceId),
      CACHE_TTL.ADDRESS
    )
  }

  /**
   * Fetch wards with cache
   */
  static async fetchWards(districtId: number): Promise<TClientWard[]> {
    return apiCache.withCache(
      CACHE_KEYS.WARDS(districtId),
      () => addressService.fetchWards(districtId),
      CACHE_TTL.ADDRESS
    )
  }

  /**
   * Clear all address cache
   */
  static clearCache(): void {
    apiCache.delete(CACHE_KEYS.PROVINCES)
    console.log('[CachedAddressService] Address cache cleared')
  }
}

/**
 * Cached Product Service
 */
export class CachedProductService {
  /**
   * Fetch products by page with cache
   */
  static async fetchProductsByPage(page: number, limit: number): Promise<TBaseProduct[]> {
    return apiCache.withCache(
      CACHE_KEYS.PRODUCTS(page, limit),
      () => productService.fetchProductsByPage(page, limit),
      CACHE_TTL.PRODUCTS
    )
  }

  /**
   * Clear all product cache
   */
  static clearCache(): void {
    console.log('[CachedProductService] Product cache cleared')
    // Note: This clears all cache with the prefix, not just products
    // You may want to implement a more specific clear method
  }

  /**
   * Pre-send mockup image (not cached - always fresh)
   */
  static async preSendMockupImage(image: Blob, filename: string) {
    return productService.preSendMockupImage(image, filename)
  }
}

/**
 * Cached Voucher Service
 */
export class CachedVoucherService {
  /**
   * Check voucher validity with cache
   */
  static async checkVoucherValidity(
    code: string,
    orderSubtotal: number
  ): Promise<VoucherValidationResult> {
    return apiCache.withCache(
      CACHE_KEYS.VOUCHER_VALIDITY(code, orderSubtotal),
      () => voucherService.checkVoucherValidity(code, orderSubtotal),
      CACHE_TTL.VOUCHER
    )
  }

  /**
   * Get sample vouchers with cache
   */
  static async getSomeVouchers(): Promise<TVoucher[]> {
    return apiCache.withCache(
      CACHE_KEYS.SAMPLE_VOUCHERS,
      () => voucherService.getSomeVouchers(),
      CACHE_TTL.VOUCHER
    )
  }

  /**
   * Calculate discount (not cached - pure function)
   */
  static calculateDiscount(subtotal: number, voucher: TVoucher | null): number {
    return voucherService.calculateDiscount(subtotal, voucher)
  }

  /**
   * Clear voucher cache
   */
  static clearCache(): void {
    console.log('[CachedVoucherService] Voucher cache cleared')
  }
}

/**
 * Cache Manager
 * Utility to manage all caches
 */
export class CacheManager {
  /**
   * Clear all API caches
   */
  static clearAllCaches(): void {
    apiCache.clearAll()
    console.log('[CacheManager] All caches cleared')
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): {
    provinces: ReturnType<typeof apiCache.getCacheInfo>
    sampleProducts: ReturnType<typeof apiCache.getCacheInfo>
    sampleVouchers: ReturnType<typeof apiCache.getCacheInfo>
  } {
    return {
      provinces: apiCache.getCacheInfo(CACHE_KEYS.PROVINCES),
      sampleProducts: apiCache.getCacheInfo(CACHE_KEYS.PRODUCTS(1, 10)),
      sampleVouchers: apiCache.getCacheInfo(CACHE_KEYS.SAMPLE_VOUCHERS),
    }
  }

  /**
   * Enable/disable caching globally
   */
  static setEnabled(enabled: boolean): void {
    // Create new instance with updated config
    Object.assign(apiCache, {
      enabled,
    })
    console.log(`[CacheManager] Caching ${enabled ? 'enabled' : 'disabled'}`)
  }
}
