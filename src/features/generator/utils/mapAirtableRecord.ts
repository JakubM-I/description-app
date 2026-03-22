import { buildImageUrl } from './buildImageUrl'
import type {
  AirtableRecord,
  AirtableRecordFields,
  BrandContentDocument,
  BrandId,
  LioneloDescriptionData,
  LioneloIntro,
  LioneloSectionItem,
  OvermaxDescriptionData,
  OvermaxDetailItem,
  PeluvioDescriptionData,
  PeluvioFeatureItem,
  PeluvioHero,
} from '../types'

const readString = (
  fields: AirtableRecordFields,
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = fields[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

const hasTextContent = (values: Array<string | null>) => values.some(Boolean)

const createImageData = (params: {
  path: string | null
  image: string | null
  alt: string | null
}) => {
  const imageUrl =
    params.alt && params.path && params.image
      ? buildImageUrl(params.path, params.image)
      : null

  return {
    imageUrl,
    imageAlt: imageUrl ? params.alt : null,
  }
}

const createLioneloItem = (params: {
  title: string | null
  desc: string | null
  path: string | null
  image: string | null
}): LioneloSectionItem | null => {
  if (!hasTextContent([params.title, params.desc])) {
    return null
  }

  const imageData = createImageData({
    path: params.path,
    image: params.image,
    alt: params.title,
  })

  return {
    title: params.title,
    desc: params.desc,
    imageUrl: imageData.imageUrl,
    imageAlt: imageData.imageAlt,
  }
}

const createPeluvioFeatureItem = (params: {
  title: string | null
  text: string | null
}): PeluvioFeatureItem | null => {
  if (!hasTextContent([params.title, params.text])) {
    return null
  }

  return {
    title: params.title,
    text: params.text,
  }
}

const createOvermaxDetailItem = (params: {
  index: number
  title: string | null
  text: string | null
  path: string | null
  image: string | null
}): OvermaxDetailItem | null => {
  if (!hasTextContent([params.title, params.text])) {
    return null
  }

  const popupKey = `item${params.index}`
  const imageData = createImageData({
    path: params.path,
    image: params.image,
    alt: params.title,
  })

  return {
    id: popupKey,
    titleId: `title-${popupKey}`,
    popupHeadingId: `popup-heading-${popupKey}`,
    popupKey,
    title: params.title,
    text: params.text,
    imageUrl: imageData.imageUrl,
    imageAlt: imageData.imageAlt,
  }
}

const mapLioneloIntro = (fields: AirtableRecordFields): LioneloIntro | null => {
  const intro = {
    text1: readString(fields, ['intro_text_1', 'hero_text']),
    slogan: readString(fields, ['intro_slogan', 'hero_title']),
    text2: readString(fields, ['intro_text_2']),
  }

  return hasTextContent([intro.text1, intro.slogan, intro.text2]) ? intro : null
}

const collectLioneloItems = (
  fields: AirtableRecordFields,
  params: {
    titleKeys: (index: number) => string[]
    descKeys: (index: number) => string[]
    pathKeys?: (index: number) => string[]
    imageKeys?: (index: number) => string[]
    maxItems?: number
  },
) => {
  const items: LioneloSectionItem[] = []
  const maxItems = params.maxItems ?? 6

  for (let index = 1; index <= maxItems; index += 1) {
    const item = createLioneloItem({
      title: readString(fields, params.titleKeys(index)),
      desc: readString(fields, params.descKeys(index)),
      path: params.pathKeys ? readString(fields, params.pathKeys(index)) : null,
      image: params.imageKeys ? readString(fields, params.imageKeys(index)) : null,
    })

    if (item) {
      items.push(item)
    }
  }

  return items
}

const mapLioneloRecord = (
  fields: AirtableRecordFields,
): LioneloDescriptionData => {
  const features = collectLioneloItems(fields, {
    titleKeys: (index) => [`feature_${index}_title`],
    descKeys: (index) => [`feature_${index}_desc`, `feature_${index}_text`],
    pathKeys: (index) => [`feature_${index}_path`],
    imageKeys: (index) => [`feature_${index}_image`, `feature_${index}_picture`],
  })

  const details = collectLioneloItems(fields, {
    titleKeys: (index) => {
      if (index === 1) {
        return ['detail_1_title', 'safety_title']
      }

      if (index === 2) {
        return ['detail_2_title', 'comfort_title']
      }

      return [`detail_${index}_title`]
    },
    descKeys: (index) => {
      if (index === 1) {
        return ['detail_1_desc', 'detail_1_text', 'safety_text']
      }

      if (index === 2) {
        return ['detail_2_desc', 'detail_2_text', 'comfort_text']
      }

      return [`detail_${index}_desc`, `detail_${index}_text`]
    },
    pathKeys: (index) => [`detail_${index}_path`],
    imageKeys: (index) => [`detail_${index}_image`, `detail_${index}_picture`],
  })

  const sets = collectLioneloItems(fields, {
    titleKeys: (index) => (index === 1 ? ['set_1_title', 'set_title'] : [`set_${index}_title`]),
    descKeys: (index) =>
      index === 1
        ? ['set_1_desc', 'set_1_text', 'set_text']
        : [`set_${index}_desc`, `set_${index}_text`],
    pathKeys: (index) => [`set_${index}_path`],
    imageKeys: (index) => [`set_${index}_image`, `set_${index}_picture`],
  })

  return {
    brand: 'lionelo',
    intro: mapLioneloIntro(fields),
    features,
    details,
    sets,
  }
}

const mapPeluvioHero = (fields: AirtableRecordFields): PeluvioHero | null => {
  const title = readString(fields, ['description_title', 'lead_title'])
  const text = readString(fields, ['description_text', 'lead_text'])

  if (!hasTextContent([title, text])) {
    return null
  }

  const imageData = createImageData({
    path: readString(fields, ['description_image_path', 'asset_base_path']),
    image: readString(fields, ['description_image', 'hero_picture']),
    alt: title,
  })

  return {
    title,
    text,
    imageUrl: imageData.imageUrl,
    imageAlt: imageData.imageAlt,
  }
}

const mapPeluvioRecord = (
  fields: AirtableRecordFields,
): PeluvioDescriptionData => {
  const features: PeluvioFeatureItem[] = []

  const primaryFeature = createPeluvioFeatureItem({
    title: readString(fields, ['benefit_primary_title']),
    text: readString(fields, ['benefit_primary_text']),
  })

  if (primaryFeature) {
    features.push(primaryFeature)
  }

  for (let index = 1; index <= 6; index += 1) {
    const feature = createPeluvioFeatureItem({
      title: readString(fields, [`feature_${index}_title`, `routine_step_${index}_title`]),
      text: readString(fields, [`feature_${index}_text`, `routine_step_${index}_text`]),
    })

    if (feature) {
      features.push(feature)
    }
  }

  return {
    brand: 'peluvio',
    hero: mapPeluvioHero(fields),
    features,
  }
}

const mapOvermaxRecord = (
  fields: AirtableRecordFields,
): OvermaxDescriptionData => {
  const details: OvermaxDetailItem[] = []
  const sharedPath = readString(fields, ['assets_path', 'gallery_path'])
  const sharedImage = readString(fields, ['hero_picture', 'gallery_main_picture'])

  for (let index = 1; index <= 6; index += 1) {
    const detail = createOvermaxDetailItem({
      index,
      title: readString(fields, [
        `detail_${index}_title`,
        `benefit_${index}_title`,
        `use_case_${index}_title`,
      ]),
      text: readString(fields, [
        `detail_${index}_text`,
        `benefit_${index}_text`,
        `use_case_${index}_text`,
      ]),
      path: readString(fields, [`detail_${index}_path`]) ?? sharedPath,
      image: readString(fields, [`detail_${index}_image`, `detail_${index}_picture`]) ?? sharedImage,
    })

    if (detail) {
      details.push(detail)
    }
  }

  const boxItem = createOvermaxDetailItem({
    index: details.length + 1,
    title: readString(fields, ['box_title']),
    text: readString(fields, ['box_text']),
    path: sharedPath,
    image: sharedImage,
  })

  if (boxItem) {
    details.push(boxItem)
  }

  return {
    brand: 'overmax',
    details,
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
