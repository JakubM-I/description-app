import type { ProductListItem } from '../../src/features/generator/types'
import {
  errorResponse,
  getBrandFromRequest,
  getLinkedContentFieldName,
  jsonResponse,
  listAirtableRecords,
  readLinkedRecordId,
} from './_shared/airtable'

const PRODUCT_LIST_FIELDS = [
  'SKU',
  'Name',
  'Brand',
  'Lionelo_Content',
  'Peluvio_Content',
  'Overmax_Content',
] as const

const createFilterByFormula = (brand: string) => `LOWER({Brand})='${brand.toLowerCase()}'`

const normalizeProduct = (
  product: {
    id: string
    fields: Record<string, unknown>
  },
  brand: string,
): ProductListItem => {
  const name =
    typeof product.fields.Name === 'string' && product.fields.Name.trim()
      ? product.fields.Name.trim()
      : product.id
  const sku =
    typeof product.fields.SKU === 'string' && product.fields.SKU.trim()
      ? product.fields.SKU.trim()
      : ''
  const linkedContentFieldName = getLinkedContentFieldName(brand as ProductListItem['brand'])
  const detailRecordId = readLinkedRecordId(product.fields, linkedContentFieldName)

  return {
    productRecordId: product.id,
    detailRecordId,
    brand: brand as ProductListItem['brand'],
    sku,
    name,
    label: sku ? `${name} (${sku})` : name,
  }
}

export default async (request: Request) => {
  try {
    const brand = getBrandFromRequest(request)
    const searchParams = new URLSearchParams()

    searchParams.set('filterByFormula', createFilterByFormula(brand))

    for (const fieldName of PRODUCT_LIST_FIELDS) {
      searchParams.append('fields[]', fieldName)
    }

    const records = await listAirtableRecords('products', searchParams)
    const products = records.map((record) => normalizeProduct(record, brand))

    return jsonResponse(200, {
      products,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
