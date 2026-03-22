import type {
  BrandContentDocument,
  ContentBlock,
  ContentSection,
  BrandId,
  PreviewBlock,
  ProductListItem,
} from '../../features/generator/types'

type TemplateRegistryBuildParams = {
  product: ProductListItem
  content: BrandContentDocument
}

type TemplateRegistryEntry = {
  generatorId: string
  brandLabel: string
  buildHtml: (params: TemplateRegistryBuildParams) => string
  buildPreview: (params: TemplateRegistryBuildParams) => PreviewBlock[]
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const hasBlockText = (block: ContentBlock | null) => Boolean(block?.title || block?.text)

const renderImage = (imageUrl: string | null, altText: string | null, indent = '      ') =>
  imageUrl
    ? `${indent}<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(
        altText ?? '',
      )}" />`
    : ''

const renderBlock = (
  block: ContentBlock,
  params: {
    blockTag?: string
    headingTag?: string
    indent?: string
  } = {},
) => {
  if (!block.title && !block.text && !block.imageUrl) {
    return ''
  }

  const blockTag = params.blockTag ?? 'article'
  const headingTag = params.headingTag ?? 'h3'
  const indent = params.indent ?? '    '
  const innerIndent = `${indent}  `

  return [
    `${indent}<${blockTag}>`,
    renderImage(block.imageUrl, block.title, innerIndent),
    block.title ? `${innerIndent}<${headingTag}>${escapeHtml(block.title)}</${headingTag}>` : '',
    block.text ? `${innerIndent}<p>${escapeHtml(block.text)}</p>` : '',
    `${indent}</${blockTag}>`,
  ]
    .filter(Boolean)
    .join('\n')
}

const renderSection = (section: ContentSection) => {
  if (section.items.length === 0) {
    return ''
  }

  return [
    `  <section data-section="${section.id}">`,
    `    <h2>${escapeHtml(section.title)}</h2>`,
    ...section.items.map((item) => renderBlock(item)),
    '  </section>',
  ]
    .filter(Boolean)
    .join('\n')
}

const renderHeader = (product: ProductListItem, brandLabel: string) => [
  '  <header>',
  `    <p>${escapeHtml(brandLabel)}</p>`,
  `    <h1>${escapeHtml(product.name)}</h1>`,
  product.sku ? `    <p>SKU: ${escapeHtml(product.sku)}</p>` : '',
  '  </header>',
]
  .filter(Boolean)
  .join('\n')

const buildSectionPreviewText = (section: ContentSection) =>
  section.items
    .map((item) => [item.title, item.text].filter(Boolean).join('\n'))
    .filter(Boolean)
    .join('\n\n')

const createSectionPreviewBlock = (
  title: string,
  text: string | null | undefined,
): PreviewBlock | null => {
  if (!text) {
    return null
  }

  return {
    title,
    text: text ?? undefined,
  }
}

const createIntroPreviewBlock = (
  block: ContentBlock | null,
  fallbackTitle: string,
): PreviewBlock | null => {
  if (!hasBlockText(block)) {
    return null
  }

  return {
    title: block?.title ?? fallbackTitle,
    text: block?.text ?? undefined,
  }
}

const getSection = (content: BrandContentDocument, sectionId: string) =>
  content.sections.find((section) => section.id === sectionId) ?? null

const createHtmlGenerator = (
  brandId: BrandId,
  brandLabel: string,
  note: string,
) => {
  return ({ product, content }: TemplateRegistryBuildParams) => {
    const sections = content.sections.map(renderSection).filter(Boolean)

    return [
      '<!-- Etap 1: uproszczony runtime HTML generator. -->',
      `<article data-description-brand="${brandId}" data-generator-id="${brandId}-html-generator">`,
      renderHeader(product, brandLabel),
      content.intro ? renderBlock(content.intro, { blockTag: 'section', headingTag: 'h2', indent: '  ' }) : '',
      ...sections,
      `  <!-- ${note} -->`,
      '</article>',
    ]
      .filter(Boolean)
      .join('\n')
  }
}

export const templateRegistry: Record<BrandId, TemplateRegistryEntry> = {
  lionelo: {
    generatorId: 'lionelo-html-generator',
    brandLabel: 'Lionelo',
    buildHtml: createHtmlGenerator(
      'lionelo',
      'Lionelo',
      'Generator Lionelo pomija puste bloki i korzysta wyłącznie z mock data.',
    ),
    buildPreview: ({ content }) => {
      const previewBlocks = [
        createIntroPreviewBlock(content.intro, 'Intro'),
        createSectionPreviewBlock(
          'Cechy szczególne',
          buildSectionPreviewText(getSection(content, 'features') ?? {
            id: 'features',
            title: '',
            items: [],
          }),
        ),
        createSectionPreviewBlock(
          'Szczegóły produktu',
          buildSectionPreviewText(getSection(content, 'details') ?? {
            id: 'details',
            title: '',
            items: [],
          }),
        ),
        createSectionPreviewBlock(
          'Dodatkowo w zestawie',
          buildSectionPreviewText(getSection(content, 'sets') ?? {
            id: 'sets',
            title: '',
            items: [],
          }),
        ),
      ]

      return previewBlocks.filter((block): block is PreviewBlock => block !== null)
    },
  },
  overmax: {
    generatorId: 'overmax-html-generator',
    brandLabel: 'Overmax',
    buildHtml: createHtmlGenerator(
      'overmax',
      'Overmax',
      'Generator Overmax składa uproszczoną sekcję szczegółów na podstawie mock data.',
    ),
    buildPreview: ({ content }) => {
      const detailsSection = getSection(content, 'details')
      const previewBlock = createSectionPreviewBlock(
        'Szczegóły',
        detailsSection ? buildSectionPreviewText(detailsSection) : '',
      )

      return previewBlock ? [previewBlock] : []
    },
  },
  peluvio: {
    generatorId: 'peluvio-html-generator',
    brandLabel: 'Peluvio',
    buildHtml: createHtmlGenerator(
      'peluvio',
      'Peluvio',
      'Generator Peluvio przygotowuje uproszczony hero i sekcję zalet produktu.',
    ),
    buildPreview: ({ content }) => {
      const previewBlocks = [
        createIntroPreviewBlock(content.intro, 'Opis produktu'),
        createSectionPreviewBlock(
          'Zalety produktu',
          buildSectionPreviewText(getSection(content, 'features') ?? {
            id: 'features',
            title: '',
            items: [],
          }),
        ),
      ]

      return previewBlocks.filter((block): block is PreviewBlock => block !== null)
    },
  },
}
