import type {
  BrandId,
  MappedDetailRecord,
  ProductListItem,
} from '../../features/generator/types'

type TemplateRegistryBuildParams = {
  product: ProductListItem
  mappedRecord: MappedDetailRecord
}

type TemplateRegistryEntry = {
  generatorId: string
  brandLabel: string
  buildHtmlPlaceholder: (params: TemplateRegistryBuildParams) => string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderParagraph = (value: string | null) =>
  value ? `    <p>${escapeHtml(value)}</p>` : ''

const renderHeading = (value: string | null) =>
  value ? `    <h2>${escapeHtml(value)}</h2>` : ''

const renderSection = (params: {
  blockId: string
  title: string | null
  text: string | null
  imageUrl?: string | null
}) => {
  if (!params.title && !params.text && !params.imageUrl) {
    return ''
  }

  return [
    `  <section data-block="${params.blockId}">`,
    renderHeading(params.title),
    renderParagraph(params.text),
    params.imageUrl
      ? `    <p data-image-url="${escapeHtml(params.imageUrl)}">${escapeHtml(
          params.imageUrl,
        )}</p>`
      : '',
    '  </section>',
  ]
    .filter(Boolean)
    .join('\n')
}

const createPlaceholderGenerator =
  (
    brandId: BrandId,
    brandLabel: string,
  ): TemplateRegistryEntry['buildHtmlPlaceholder'] =>
  ({ product, mappedRecord }) => {
    const sections = mappedRecord.sectionItems
      .map((item, index) =>
        renderSection({
          blockId: `section-${index + 1}`,
          title: item.title,
          text: item.text,
          imageUrl: item.imageUrl,
        }),
      )
      .filter(Boolean)

    return [
      '<!-- Runtime placeholder built by an internal app generator. -->',
      `<article data-description-brand="${brandId}" data-generator-id="${brandId}-html-generator">`,
      '  <header>',
      `    <h1>${escapeHtml(product.name)}</h1>`,
      `    <p>SKU: ${escapeHtml(product.sku)}</p>`,
      '  </header>',
      renderSection({
        blockId: 'hero',
        title: mappedRecord.heroTitle || null,
        text: mappedRecord.heroText || null,
      }),
      ...sections,
      '  <!-- Missing content blocks are omitted by the runtime generator. -->',
      `  <!-- Placeholder generator: ${brandLabel}. -->`,
      '</article>',
    ]
      .filter(Boolean)
      .join('\n')
  }

export const templateRegistry: Record<BrandId, TemplateRegistryEntry> = {
  lionelo: {
    generatorId: 'lionelo-html-generator',
    brandLabel: 'Lionelo',
    buildHtmlPlaceholder: createPlaceholderGenerator('lionelo', 'Lionelo'),
  },
  overmax: {
    generatorId: 'overmax-html-generator',
    brandLabel: 'Overmax',
    buildHtmlPlaceholder: createPlaceholderGenerator('overmax', 'Overmax'),
  },
  peluvio: {
    generatorId: 'peluvio-html-generator',
    brandLabel: 'Peluvio',
    buildHtmlPlaceholder: createPlaceholderGenerator('peluvio', 'Peluvio'),
  },
}
