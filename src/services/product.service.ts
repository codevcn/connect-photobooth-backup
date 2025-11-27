import { TBaseProduct } from '@/utils/types/global'
import { getFetchProductsCatalog, postPreSendMockupImage } from './api/product.api'
import { TPreSentMockupImageRes } from '@/utils/types/api'
import { ProductAdapter } from './adapter/product.adapter'
import { apiCache } from '@/dev/api-cache'

// Cache keys
const CACHE_KEYS = {
  PRODUCTS: (page: number, limit: number) => `products_${page}_${limit}`,
}

// Cache TTL: 30 minutes for product data
const PRODUCT_CACHE_TTL = 900000 * 60 * 1000

class ProductService {
  /**
   * Fetch products from API and convert to TBaseProduct format
   */
  private async fetchProducts(page: number, pageSize: number): Promise<TBaseProduct[]> {
    const response = await getFetchProductsCatalog(page, pageSize)

    if (!response.success || !response.data?.data) {
      throw new Error(response.error || 'Không thể lấy danh sách sản phẩm từ server')
    }

    const apiProducts = response.data.data
    console.log('>>> api products:', apiProducts)

    // Sử dụng ProductAdapter để convert
    const clientProducts = ProductAdapter.toClientProducts(apiProducts)
    clientProducts.sort((a, b) => a.slug.localeCompare(b.slug))
    return clientProducts
  }

  /**
   * Main method - fetch from API with cache support
   */
  async fetchProductsByPage(page: number, limit: number): Promise<TBaseProduct[]> {
    return apiCache.withCache(
      CACHE_KEYS.PRODUCTS(page, limit),
      () => this.fetchProducts(page, limit),
      PRODUCT_CACHE_TTL
    )
  }

  async preSendMockupImage(image: Blob, filename: string): Promise<TPreSentMockupImageRes> {
    console.log('>>> image:', { image, filename })
    const formData = new FormData()
    formData.append('file', image, filename)
    const response = await postPreSendMockupImage(formData)
    console.log('>>> res:', response)
    if (!response.success || !response.data?.data) {
      throw new Error(response.error || 'Không thể gửi mockup image đến server')
    }
    return response.data.data
  }
}

export const productService = new ProductService()
