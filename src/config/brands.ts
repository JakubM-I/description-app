import type { BrandConfig } from '../features/generator/types'

export const BRAND_OPTIONS: BrandConfig[] = [
  {
    id: 'lionelo',
    label: 'Lionelo',
    detailTableName: 'lionelo_content',
    linkedContentFieldName: 'Lionelo_Content',
  },
  {
    id: 'overmax',
    label: 'Overmax',
    detailTableName: 'overmax_content',
    linkedContentFieldName: 'Overmax_Content',
  },
  {
    id: 'peluvio',
    label: 'Peluvio',
    detailTableName: 'peluvio_content',
    linkedContentFieldName: 'Peluvio_Content',
  },
]

export const BRAND_DETAIL_TABLE_MAP = BRAND_OPTIONS.reduce<
  Record<BrandConfig['id'], BrandConfig['detailTableName']>
>(
  (accumulator, brand) => {
    accumulator[brand.id] = brand.detailTableName
    return accumulator
  },
  {
    lionelo: 'lionelo_content',
    overmax: 'overmax_content',
    peluvio: 'peluvio_content',
  },
)

export const BRAND_LINKED_CONTENT_FIELD_MAP = BRAND_OPTIONS.reduce<
  Record<BrandConfig['id'], BrandConfig['linkedContentFieldName']>
>(
  (accumulator, brand) => {
    accumulator[brand.id] = brand.linkedContentFieldName
    return accumulator
  },
  {
    lionelo: 'Lionelo_Content',
    overmax: 'Overmax_Content',
    peluvio: 'Peluvio_Content',
  },
)
