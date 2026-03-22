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

export type PreviewBlock = {
  title?: string
  text?: string
}

export type LioneloIntro = {
  text1: string | null
  slogan: string | null
  text2: string | null
}

export type LioneloSectionItem = {
  title: string | null
  desc: string | null
  imageUrl: string | null
  imageAlt: string | null
}

export type LioneloDescriptionData = {
  brand: 'lionelo'
  intro: LioneloIntro | null
  features: LioneloSectionItem[]
  details: LioneloSectionItem[]
  sets: LioneloSectionItem[]
}

export type PeluvioHero = {
  title: string | null
  text: string | null
  imageUrl: string | null
  imageAlt: string | null
}

export type PeluvioFeatureItem = {
  title: string | null
  text: string | null
}

export type PeluvioDescriptionData = {
  brand: 'peluvio'
  hero: PeluvioHero | null
  features: PeluvioFeatureItem[]
}

export type OvermaxDetailItem = {
  id: string
  titleId: string
  popupHeadingId: string
  popupKey: string
  title: string | null
  text: string | null
  imageUrl: string | null
  imageAlt: string | null
}

export type OvermaxDescriptionData = {
  brand: 'overmax'
  details: OvermaxDetailItem[]
}

export type BrandContentDocument =
  | LioneloDescriptionData
  | PeluvioDescriptionData
  | OvermaxDescriptionData

export type GeneratorContext = {
  brand: BrandId
  product: ProductListItem
  detailRecord: AirtableRecord | null
}
