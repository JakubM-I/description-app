import type { ProductsRepository } from './products.repository'

const notImplementedMessage =
  'Airtable repository jest placeholderem z Etapu 0. Integracja pojawi się w Etapie 2 przez Netlify Functions.'

export const airtableProductsRepository: ProductsRepository = {
  async getProductsByBrand() {
    throw new Error(notImplementedMessage)
  },

  async getProductDetail() {
    throw new Error(notImplementedMessage)
  },
}
