import { templateRegistry } from '../../../lib/templates/templateRegistry'
import { mapAirtableRecord } from '../utils/mapAirtableRecord'
import type { GeneratorContext, PreviewBlock } from '../types'

export const generateHtmlDescription = (context: GeneratorContext) => {
  const templateDefinition = templateRegistry[context.brand]
  const mapped = mapAirtableRecord(context.detailRecord)

  return templateDefinition.buildHtmlPlaceholder({
    product: context.product,
    mappedRecord: mapped,
  })
}

export const generateTextPreview = (
  context: GeneratorContext,
): PreviewBlock[] => {
  const templateDefinition = templateRegistry[context.brand]
  const mapped = mapAirtableRecord(context.detailRecord)

  return [
    {
      title: 'Etap 0',
      text: `Preview tekstowy jest placeholderem. Finalne mapowanie pozostanie wewnętrzną logiką generatora ${templateDefinition.generatorId}.`,
    },
    {
      title: 'Produkt',
      text: `${context.product.name} (${context.product.sku})`,
    },
    {
      title: mapped.heroTitle || 'Sekcja startowa',
      text:
        mapped.heroText ||
        'Tutaj pojawi się pierwszy blok treści po wdrożeniu generatora preview.',
    },
  ]
}
