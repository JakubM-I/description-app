import type { ProductsRepository } from './products.repository'
import type {
  AirtableRecord,
  BrandId,
  ProductListItem,
} from '../features/generator/types'

const parseFunctionError = async (response: Response) => {
  try {
    const payload = (await response.json()) as { message?: unknown }

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message
    }
  } catch {
    return null
  }

  return null
}

const fetchFunctionJson = async <T>(path: string) => {
  const response = await fetch(path)

  if (!response.ok) {
    const errorMessage = await parseFunctionError(response)

    throw new Error(errorMessage ?? 'Netlify Function zwróciła błąd.')
  }

  return (await response.json()) as T
}

export const airtableProductsRepository: ProductsRepository = {
  async getProductsByBrand(brand: BrandId): Promise<ProductListItem[]> {
    const params = new URLSearchParams({
      brand,
    })
    const payload = await fetchFunctionJson<{ products?: ProductListItem[] }>(
      `/.netlify/functions/get-products?${params.toString()}`,
    )

    if (!Array.isArray(payload.products)) {
      throw new Error('Netlify Function get-products zwróciła nieprawidłową odpowiedź.')
    }

    return payload.products
  },

  async getProductDetail(params: {
    brand: BrandId
    productRecordId: string
  }): Promise<AirtableRecord | null> {
    const searchParams = new URLSearchParams({
      brand: params.brand,
      productRecordId: params.productRecordId,
    })
    const payload = await fetchFunctionJson<{ detailRecord?: AirtableRecord }>(
      `/.netlify/functions/get-product-by-id?${searchParams.toString()}`,
    )

    if (!payload.detailRecord) {
      throw new Error(
        'Netlify Function get-product-by-id zwróciła nieprawidłową odpowiedź.',
      )
    }

    return payload.detailRecord
  },
}
