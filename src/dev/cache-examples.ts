/**
 * Example usage of API Cache System
 * 
 * This file demonstrates how to use the cached services
 */

import {
  CachedAddressService,
  CachedProductService,
  CacheManager,
} from './cached-services'

/**
 * Example 1: Fetch provinces with cache
 */
export async function exampleFetchProvinces() {
  console.log('=== Example 1: Fetch Provinces ===')

  // First call - fetch from API
  console.log('First call...')
  const provinces1 = await CachedAddressService.fetchProvinces()
  console.log('Provinces fetched:', provinces1.length)

  // Second call - get from cache (if not expired)
  console.log('Second call...')
  const provinces2 = await CachedAddressService.fetchProvinces()
  console.log('Provinces from cache:', provinces2.length)

  return provinces1
}

/**
 * Example 2: Fetch districts with cache
 */
export async function exampleFetchDistricts(provinceId: number) {
  console.log('=== Example 2: Fetch Districts ===')

  const districts = await CachedAddressService.fetchDistricts(provinceId)
  console.log(`Districts for province ${provinceId}:`, districts.length)

  return districts
}

/**
 * Example 3: Fetch wards with cache
 */
export async function exampleFetchWards(districtId: number) {
  console.log('=== Example 3: Fetch Wards ===')

  const wards = await CachedAddressService.fetchWards(districtId)
  console.log(`Wards for district ${districtId}:`, wards.length)

  return wards
}

/**
 * Example 4: Fetch products with cache
 */
export async function exampleFetchProducts() {
  console.log('=== Example 4: Fetch Products ===')

  const page = 1
  const limit = 10

  // First call - fetch from API
  console.log('First call...')
  const products1 = await CachedProductService.fetchProductsByPage(page, limit)
  console.log('Products fetched:', products1.length)

  // Second call - get from cache
  console.log('Second call...')
  const products2 = await CachedProductService.fetchProductsByPage(page, limit)
  console.log('Products from cache:', products2.length)

  return products1
}

/**
 * Example 5: Check cache stats
 */
export function exampleCheckCacheStats() {
  console.log('=== Example 5: Cache Stats ===')

  const stats = CacheManager.getCacheStats()
  console.log('Cache stats:', stats)

  if (stats.provinces?.exists) {
    console.log('Provinces cache exists')
    console.log('Expired:', stats.provinces.expired)
    console.log('Timestamp:', new Date(stats.provinces.timestamp!))
  }

  if (stats.sampleProducts?.exists) {
    console.log('Products cache exists')
    console.log('Expired:', stats.sampleProducts.expired)
    console.log('Timestamp:', new Date(stats.sampleProducts.timestamp!))
  }
}

/**
 * Example 6: Clear all caches
 */
export function exampleClearAllCaches() {
  console.log('=== Example 6: Clear All Caches ===')

  CacheManager.clearAllCaches()
  console.log('All caches cleared!')

  // Check stats again
  const stats = CacheManager.getCacheStats()
  console.log('Cache stats after clear:', stats)
}

/**
 * Example 7: Clear specific cache
 */
export function exampleClearAddressCache() {
  console.log('=== Example 7: Clear Address Cache ===')

  CachedAddressService.clearCache()
  console.log('Address cache cleared!')
}

/**
 * Example 8: Enable/Disable cache
 */
export async function exampleToggleCache() {
  console.log('=== Example 8: Toggle Cache ===')

  // Disable cache
  console.log('Disabling cache...')
  CacheManager.setEnabled(false)

  // This will NOT use cache
  const provinces1 = await CachedAddressService.fetchProvinces()
  console.log('Fetched without cache:', provinces1.length)

  // Enable cache again
  console.log('Enabling cache...')
  CacheManager.setEnabled(true)

  // This will use cache
  const provinces2 = await CachedAddressService.fetchProvinces()
  console.log('Fetched with cache:', provinces2.length)
}

/**
 * Example 9: Complete flow - Address selection
 */
export async function exampleCompleteAddressFlow() {
  console.log('=== Example 9: Complete Address Flow ===')

  try {
    // Step 1: Get provinces (cached)
    console.log('Step 1: Fetching provinces...')
    const provinces = await CachedAddressService.fetchProvinces()
    console.log(`Found ${provinces.length} provinces`)

    if (provinces.length === 0) return

    // Step 2: Get districts for first province (cached)
    const firstProvince = provinces[0]
    console.log(`Step 2: Fetching districts for ${firstProvince.name}...`)
    const districts = await CachedAddressService.fetchDistricts(firstProvince.id)
    console.log(`Found ${districts.length} districts`)

    if (districts.length === 0) return

    // Step 3: Get wards for first district (cached)
    const firstDistrict = districts[0]
    console.log(`Step 3: Fetching wards for ${firstDistrict.name}...`)
    const wards = await CachedAddressService.fetchWards(firstDistrict.id)
    console.log(`Found ${wards.length} wards`)

    // Check cache stats
    console.log('\nCache stats after flow:')
    exampleCheckCacheStats()

    return { provinces, districts, wards }
  } catch (error) {
    console.error('Error in address flow:', error)
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n🚀 Running all cache examples...\n')

  // Example 1-4: Fetch data
  await exampleFetchProvinces()
  console.log('\n')

  await exampleFetchProducts()
  console.log('\n')

  // Example 5: Check stats
  exampleCheckCacheStats()
  console.log('\n')

  // Example 9: Complete flow
  await exampleCompleteAddressFlow()
  console.log('\n')

  // Example 6: Clear all
  exampleClearAllCaches()
  console.log('\n')

  console.log('✅ All examples completed!')
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  ;(window as any).cacheExamples = {
    fetchProvinces: exampleFetchProvinces,
    fetchDistricts: exampleFetchDistricts,
    fetchWards: exampleFetchWards,
    fetchProducts: exampleFetchProducts,
    checkStats: exampleCheckCacheStats,
    clearAll: exampleClearAllCaches,
    clearAddress: exampleClearAddressCache,
    toggleCache: exampleToggleCache,
    completeFlow: exampleCompleteAddressFlow,
    runAll: runAllExamples,
  }

  console.log(
    '💡 Cache examples available in console via window.cacheExamples'
  )
}
