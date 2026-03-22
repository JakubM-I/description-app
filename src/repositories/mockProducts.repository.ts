import { BRAND_DETAIL_TABLE_MAP } from '../config/brands'
import type {
  AirtableRecord,
  AirtableRecordFields,
  BrandId,
  DetailTableName,
  MockAirtableResponse,
  ProductListItem,
} from '../features/generator/types'
import type { ProductsRepository } from './products.repository'

const MOCK_DATA_PATH = `${import.meta.env.BASE_URL}data/mock-airtable-response.json`

let mockDataPromise: Promise<MockAirtableResponse> | null = null

const readString = (
  fields: AirtableRecordFields,
  key: string,
): string | null => {
  const value = fields[key]

  return typeof value === 'string' && value.trim() ? value : null
}

const readLinkedRecordId = (fields: AirtableRecordFields) => {
  const linkedRecords = fields.BrandContentRecord

  if (!Array.isArray(linkedRecords)) {
    return null
  }

  const firstLinkedRecord = linkedRecords[0]

  return typeof firstLinkedRecord === 'string' && firstLinkedRecord.trim()
    ? firstLinkedRecord
    : null
}

const normalizeProduct = (record: AirtableRecord): ProductListItem | null => {
  const brand = readString(record.fields, 'Brand')
  const name = readString(record.fields, 'Name')

  if (!brand || !name) {
    return null
  }

  if (!Object.prototype.hasOwnProperty.call(BRAND_DETAIL_TABLE_MAP, brand)) {
    return null
  }

  const sku = readString(record.fields, 'SKU') ?? ''
  const typedBrand = brand as BrandId
  const detailRecordId = readLinkedRecordId(record.fields)
  const label = sku ? `${name} (${sku})` : name

  return {
    productRecordId: record.id,
    detailRecordId,
    brand: typedBrand,
    sku,
    name,
    label,
  }
}

const loadMockData = async (): Promise<MockAirtableResponse> => {
  if (!mockDataPromise) {
    mockDataPromise = fetch(MOCK_DATA_PATH).then(async (response) => {
      if (!response.ok) {
        throw new Error('Nie udało się wczytać lokalnych mock danych.')
      }

      return (await response.json()) as MockAirtableResponse
    })
  }

  return mockDataPromise
}

const getDetailTableName = (brand: BrandId): DetailTableName => {
  const tableName = BRAND_DETAIL_TABLE_MAP[brand]

  if (!tableName) {
    throw new Error(`Brak mapowania tabeli szczegółowej dla marki "${brand}".`)
  }

  return tableName
}

const getDetailRecords = (
  mockData: MockAirtableResponse,
  brand: BrandId,
): AirtableRecord[] => {
  const tableName = getDetailTableName(brand)
  const table = mockData[tableName]

  if (!table || !Array.isArray(table.records)) {
    throw new Error(`Brak tabeli "${tableName}" w lokalnym mocku danych.`)
  }

  return table.records
}

export const mockProductsRepository: ProductsRepository = {
  async getProductsByBrand(brand) {
    const mockData = await loadMockData()
    const records = mockData.products?.records ?? []

    return records
      .map(normalizeProduct)
      .filter((product): product is ProductListItem => product !== null)
      .filter((product) => product.brand === brand)
  },

  async getProductDetail({ brand, detailRecordId }) {
    const mockData = await loadMockData()
    const detailRecords = getDetailRecords(mockData, brand)
    const detailRecord = detailRecords.find((record) => record.id === detailRecordId)

    if (!detailRecord) {
      throw new Error(
        `Nie znaleziono rekordu szczegółowego "${detailRecordId}" dla marki "${brand}".`,
      )
    }

    return detailRecord
  },
}
