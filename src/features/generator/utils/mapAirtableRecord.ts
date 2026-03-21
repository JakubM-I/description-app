import { buildImageUrl } from './buildImageUrl'
import type { AirtableRecord, MappedDetailRecord, SectionItem } from '../types'

const readString = (
  fields: AirtableRecord['fields'],
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = fields[key]

    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return null
}

export const mapAirtableRecord = (
  record: AirtableRecord | null,
): MappedDetailRecord => {
  if (!record) {
    return {
      heroTitle: '',
      heroText: '',
      assetBasePath: null,
      sectionItems: [],
    }
  }

  const { fields } = record

  const assetBasePath =
    readString(fields, [
      'feature_1_path',
      'gallery_path',
      'assets_path',
      'asset_base_path',
    ]) ?? null

  const sectionItems: SectionItem[] = [
    {
      title: readString(fields, [
        'feature_1_title',
        'benefit_1_title',
        'benefit_primary_title',
      ]),
      text: readString(fields, [
        'feature_1_text',
        'benefit_1_text',
        'benefit_primary_text',
      ]),
      imageUrl: buildImageUrl(
        assetBasePath,
        readString(fields, ['feature_1_picture', 'hero_picture']),
      ),
    },
    {
      title: readString(fields, [
        'feature_2_title',
        'benefit_2_title',
        'routine_step_1_title',
      ]),
      text: readString(fields, [
        'feature_2_text',
        'benefit_2_text',
        'routine_step_1_text',
      ]),
      imageUrl: buildImageUrl(
        assetBasePath,
        readString(fields, ['gallery_main_picture']),
      ),
    },
  ].filter((item) => Boolean(item.title || item.text || item.imageUrl))

  return {
    heroTitle:
      readString(fields, ['hero_title', 'intro_heading', 'lead_title']) ?? '',
    heroText:
      readString(fields, ['hero_text', 'intro_body', 'lead_text']) ?? '',
    assetBasePath,
    sectionItems,
  }
}
