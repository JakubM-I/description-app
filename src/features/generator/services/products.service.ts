import type { BrandId } from '../types'
import {
  createProductsRepository,
  type ProductsRepository,
} from '../../../repositories/products.repository'

const repository: ProductsRepository = createProductsRepository(
  import.meta.env.VITE_DATA_SOURCE,
)

export const getProductsByBrand = (brand: BrandId) =>
  repository.getProductsByBrand(brand)

export const getProductDetail = (params: {
  brand: BrandId
  productRecordId: string
}) => repository.getProductDetail(params)
