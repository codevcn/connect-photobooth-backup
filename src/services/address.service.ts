import { getFetchProvinces, getFetchDistricts, getFetchWards } from './api/address.api'
import {
  AddressAdapter,
  TClientProvince,
  TClientDistrict,
  TClientWard,
} from './adapter/address.adapter'
import { apiCache } from '@/dev/api-cache'

// Cache keys
const CACHE_KEYS = {
  PROVINCES: 'provinces',
  DISTRICTS: (provinceId: number) => `districts_${provinceId}`,
  WARDS: (districtId: number) => `wards_${districtId}`,
}

// Cache TTL: 1 hour for address data
const ADDRESS_CACHE_TTL = 60 * 60 * 1000

class AddressService {
  constructor() {}

  async fetchProvinces(): Promise<TClientProvince[]> {
    return apiCache.withCache(
      CACHE_KEYS.PROVINCES,
      async () => {
        const response = await getFetchProvinces()
        const apiProvinces = response.data?.data || []
        return AddressAdapter.toClientProvinces(apiProvinces)
      },
      ADDRESS_CACHE_TTL
    )
  }

  async fetchDistricts(provinceId: number): Promise<TClientDistrict[]> {
    return apiCache.withCache(
      CACHE_KEYS.DISTRICTS(provinceId),
      async () => {
        const response = await getFetchDistricts(provinceId)
        const apiDistricts = response.data?.data || []
        return AddressAdapter.toClientDistricts(apiDistricts)
      },
      ADDRESS_CACHE_TTL
    )
  }

  async fetchWards(districtId: number): Promise<TClientWard[]> {
    return apiCache.withCache(
      CACHE_KEYS.WARDS(districtId),
      async () => {
        const response = await getFetchWards(districtId)
        const apiWards = response.data?.data || []
        return AddressAdapter.toClientWards(apiWards)
      },
      ADDRESS_CACHE_TTL
    )
  }
}

export const addressService = new AddressService()
