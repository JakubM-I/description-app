import type {
  AirtableRecord,
  BrandId,
  ProductListItem,
} from '../features/generator/types'
import type { ProductsRepository } from './products.repository'

const sampleProducts: ProductListItem[] = [
  {
    productRecordId: 'recProdLionelo001',
    detailRecordId: 'recLioneloContent001',
    brand: 'lionelo',
    sku: 'LIO-EMMA-PLUS',
    name: 'Lionelo Emma Plus',
    label: 'Lionelo Emma Plus (LIO-EMMA-PLUS)',
  },
  {
    productRecordId: 'recProdOvermax001',
    detailRecordId: 'recOvermaxContent001',
    brand: 'overmax',
    sku: 'OVX-MULTIPIC-50',
    name: 'Overmax Multipic 5.0',
    label: 'Overmax Multipic 5.0 (OVX-MULTIPIC-50)',
  },
  {
    productRecordId: 'recProdPeluvio001',
    detailRecordId: 'recPeluvioContent001',
    brand: 'peluvio',
    sku: 'PEL-HAIR-DRY-01',
    name: 'Peluvio HairDry 01',
    label: 'Peluvio HairDry 01 (PEL-HAIR-DRY-01)',
  },
]

const sampleDetails: Record<BrandId, Record<string, AirtableRecord>> = {
  lionelo: {
    recLioneloContent001: {
      id: 'recLioneloContent001',
      createdTime: '2026-03-19T09:30:00.000Z',
      fields: {
        hero_title: 'Spacerówka na co dzień i w podróży',
        hero_text:
          'Placeholder detail record przygotowany pod finalne mapowanie treści Lionelo.',
        feature_1_title: 'Składanie jedną ręką',
        feature_1_text: 'W Etapie 1 ten blok będzie budowany z lokalnego mocka JSON.',
        feature_1_path: '/images/lionelo/emma-plus/',
        feature_1_picture: 'fold.webp',
      },
    },
  },
  overmax: {
    recOvermaxContent001: {
      id: 'recOvermaxContent001',
      createdTime: '2026-03-19T09:40:00.000Z',
      fields: {
        intro_heading: 'Domowa rozrywka na dużym ekranie',
        intro_body:
          'Placeholder detail record przygotowany pod finalne mapowanie treści Overmax.',
        benefit_1_title: 'Kompaktowa konstrukcja',
        benefit_1_text:
          'Repo mock można później bez przebudowy podmienić na Netlify Functions.',
        assets_path: '/images/overmax/multipic-50/',
        hero_picture: 'projector.webp',
      },
    },
  },
  peluvio: {
    recPeluvioContent001: {
      id: 'recPeluvioContent001',
      createdTime: '2026-03-19T09:50:00.000Z',
      fields: {
        lead_title: 'Szybsze suszenie i wygodna stylizacja',
        lead_text:
          'Placeholder detail record przygotowany pod finalne mapowanie treści Peluvio.',
        benefit_primary_title: 'Regulacja temperatury',
        benefit_primary_text: 'W kolejnych etapach treść będzie pochodzić z modelu Airtable.',
        asset_base_path: '/images/peluvio/hairdry-01/',
        hero_picture: 'dryer.webp',
      },
    },
  },
}

export const mockProductsRepository: ProductsRepository = {
  async getProductsByBrand(brand) {
    return sampleProducts.filter((product) => product.brand === brand)
  },

  async getProductDetail({ brand, detailRecordId }) {
    return sampleDetails[brand][detailRecordId] ?? null
  },
}
