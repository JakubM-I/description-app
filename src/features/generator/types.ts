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

export type AirtableRecord = {
  id: string
  createdTime?: string
  fields: Record<string, unknown>
}

export type SectionItem = {
  title: string | null
  text: string | null
  imageUrl: string | null
}

export type MappedDetailRecord = {
  heroTitle: string
  heroText: string
  assetBasePath: string | null
  sectionItems: SectionItem[]
}

export type NormalizedProduct = {
  brand: BrandId
  sku: string
  name: string
  heroTitle: string
  heroText: string
  sections: SectionItem[]
  assetBasePath: string | null
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
