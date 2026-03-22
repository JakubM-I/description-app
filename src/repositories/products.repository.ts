import { airtableProductsRepository } from './airtableProducts.repository'
import { mockProductsRepository } from './mockProducts.repository'
import type {
  AirtableRecord,
  BrandId,
  ProductListItem,
} from '../features/generator/types'

export interface ProductsRepository {
  getProductsByBrand(brand: BrandId): Promise<ProductListItem[]>
  getProductDetail(params: {
    brand: BrandId
    productRecordId: string
  }): Promise<AirtableRecord | null>
}

export const createProductsRepository = (
  source?: string,
): ProductsRepository => {
  if (source === 'airtable') {
    return airtableProductsRepository
  }

  return mockProductsRepository
}
