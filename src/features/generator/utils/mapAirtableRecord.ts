import { buildImageUrl } from './buildImageUrl'
import type {
  AirtableRecord,
  AirtableRecordFields,
  BrandContentDocument,
  BrandId,
  ContentBlock,
  ContentSection,
} from '../types'

const readString = (
  fields: AirtableRecordFields,
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

const hasBlockContent = (block: ContentBlock) =>
  Boolean(block.title || block.text || block.imageUrl)

const createBlock = (params: {
  title: string | null
  text: string | null
  imageUrl?: string | null
}): ContentBlock => ({
  title: params.title,
  text: params.text,
  imageUrl: params.imageUrl ?? null,
})

const createSection = (
  id: string,
  title: string,
  items: ContentBlock[],
): ContentSection | null => {
  const visibleItems = items.filter(hasBlockContent)

  if (visibleItems.length === 0) {
    return null
  }

  return {
    id,
    title,
    items: visibleItems,
  }
}

const collectIndexedBlocks = (
  fields: AirtableRecordFields,
  params: {
    maxItems?: number
    titleKeys: (index: number) => string[]
    textKeys: (index: number) => string[]
    pathKeys?: (index: number) => string[]
    imageKeys?: (index: number) => string[]
  },
) => {
  const blocks: ContentBlock[] = []
  const maxItems = params.maxItems ?? 6

  for (let index = 1; index <= maxItems; index += 1) {
    const title = readString(fields, params.titleKeys(index))
    const text = readString(fields, params.textKeys(index))
    const path = params.pathKeys ? readString(fields, params.pathKeys(index)) : null
    const image = params.imageKeys
      ? readString(fields, params.imageKeys(index))
      : null

    const block = createBlock({
      title,
      text,
      imageUrl: buildImageUrl(path, image),
    })

    if (hasBlockContent(block)) {
      blocks.push(block)
    }
  }

  return blocks
}

const mapLioneloRecord = (
  fields: AirtableRecordFields,
): BrandContentDocument => {
  const intro = createBlock({
    title: readString(fields, ['hero_title', 'intro_slogan']),
    text: readString(fields, ['hero_text', 'intro_text_1', 'intro_text_2']),
  })

  const features = collectIndexedBlocks(fields, {
    titleKeys: (index) => [`feature_${index}_title`],
    textKeys: (index) => [`feature_${index}_text`, `feature_${index}_desc`],
    pathKeys: (index) => [`feature_${index}_path`],
    imageKeys: (index) => [`feature_${index}_picture`, `feature_${index}_image`],
  })

  const details = collectIndexedBlocks(fields, {
    titleKeys: (index) => [`detail_${index}_title`],
    textKeys: (index) => [`detail_${index}_text`, `detail_${index}_desc`],
    pathKeys: (index) => [`detail_${index}_path`],
    imageKeys: (index) => [`detail_${index}_picture`, `detail_${index}_image`],
  })

  const setBlock = createBlock({
    title: readString(fields, ['set_title']),
    text: readString(fields, ['set_text']),
  })

  return {
    brand: 'lionelo',
    intro: hasBlockContent(intro) ? intro : null,
    sections: [
      createSection('features', 'Cechy szczególne', features),
      createSection('details', 'Szczegóły produktu', details),
      createSection('sets', 'Dodatkowo w zestawie', [setBlock]),
    ].filter((section): section is ContentSection => section !== null),
  }
}

const mapOvermaxRecord = (
  fields: AirtableRecordFields,
): BrandContentDocument => {
  const intro = createBlock({
    title: readString(fields, ['intro_heading']),
    text: readString(fields, ['intro_body']),
    imageUrl: buildImageUrl(
      readString(fields, ['assets_path', 'gallery_path']),
      readString(fields, ['hero_picture', 'gallery_main_picture']),
    ),
  })

  const benefitDetails = collectIndexedBlocks(fields, {
    titleKeys: (index) => [`benefit_${index}_title`, `detail_${index}_title`],
    textKeys: (index) => [`benefit_${index}_text`, `detail_${index}_text`],
  })

  const useCaseDetails = collectIndexedBlocks(fields, {
    titleKeys: (index) => [`use_case_${index}_title`],
    textKeys: (index) => [`use_case_${index}_text`],
  })

  const boxBlock = createBlock({
    title: readString(fields, ['box_title']),
    text: readString(fields, ['box_text']),
  })

  return {
    brand: 'overmax',
    intro: hasBlockContent(intro) ? intro : null,
    sections: [
      createSection('details', 'Szczegóły', [
        ...benefitDetails,
        ...useCaseDetails,
        boxBlock,
      ]),
    ].filter((section): section is ContentSection => section !== null),
  }
}

const mapPeluvioRecord = (
  fields: AirtableRecordFields,
): BrandContentDocument => {
  const intro = createBlock({
    title: readString(fields, ['description_title', 'lead_title']),
    text: readString(fields, ['description_text', 'lead_text']),
    imageUrl: buildImageUrl(
      readString(fields, ['asset_base_path']),
      readString(fields, ['hero_picture']),
    ),
  })

  const primaryFeature = createBlock({
    title: readString(fields, ['benefit_primary_title']),
    text: readString(fields, ['benefit_primary_text']),
  })

  const featureBlocks = collectIndexedBlocks(fields, {
    titleKeys: (index) => [`feature_${index}_title`, `routine_step_${index}_title`],
    textKeys: (index) => [`feature_${index}_text`, `routine_step_${index}_text`],
  })

  return {
    brand: 'peluvio',
    intro: hasBlockContent(intro) ? intro : null,
    sections: [
      createSection('features', 'Zalety produktu', [
        primaryFeature,
        ...featureBlocks,
      ]),
    ].filter((section): section is ContentSection => section !== null),
  }
}

export const mapAirtableRecord = (
  brand: BrandId,
  record: AirtableRecord | null,
): BrandContentDocument => {
  const fields = record?.fields ?? {}

  switch (brand) {
    case 'lionelo':
      return mapLioneloRecord(fields)
    case 'overmax':
      return mapOvermaxRecord(fields)
    case 'peluvio':
      return mapPeluvioRecord(fields)
  }
}
