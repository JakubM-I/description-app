import type { BrandConfig } from '../features/generator/types'

export const BRAND_OPTIONS: BrandConfig[] = [
  {
    id: 'lionelo',
    label: 'Lionelo',
    detailTableName: 'lionelo_content',
  },
  {
    id: 'overmax',
    label: 'Overmax',
    detailTableName: 'overmax_content',
  },
  {
    id: 'peluvio',
    label: 'Peluvio',
    detailTableName: 'peluvio_content',
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
