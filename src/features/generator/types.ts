export type BrandId = 'lionelo' | 'overmax' | 'peluvio'

export type DetailTableName =
  | 'lionelo_content'
  | 'overmax_content'
  | 'peluvio_content'

export type BrandConfig = {
  id: BrandId
  label: string
  detailTableName: DetailTableName
}

export type ProductListItem = {
  productRecordId: string
  detailRecordId: string | null
  brand: BrandId
  sku: string
  name: string
  label: string
}

export type AirtableRecordFields = Record<string, unknown>

export type AirtableRecord = {
  id: string
  createdTime?: string
  fields: AirtableRecordFields
}

export type AirtableTable = {
  records: AirtableRecord[]
}

export type MockAirtableResponse = {
  products: AirtableTable
  lionelo_content: AirtableTable
  overmax_content: AirtableTable
  peluvio_content: AirtableTable
}

export type ContentBlock = {
  title: string | null
  text: string | null
  imageUrl: string | null
}

export type ContentSection = {
  id: string
  title: string
  items: ContentBlock[]
}

export type BrandContentDocument = {
  brand: BrandId
  intro: ContentBlock | null
  sections: ContentSection[]
}

export type GeneratorContext = {
  brand: BrandId
  product: ProductListItem
  detailRecord: AirtableRecord | null
}

export type PreviewBlock = {
  title?: string
  text?: string
}
