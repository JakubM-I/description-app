import { templateRegistry } from '../../../lib/templates/templateRegistry'
import { mapAirtableRecord } from '../utils/mapAirtableRecord'
import type { GeneratorContext, PreviewBlock } from '../types'

export const generateHtmlDescription = (context: GeneratorContext) => {
  const templateDefinition = templateRegistry[context.brand]
  const mapped = mapAirtableRecord(context.brand, context.detailRecord)

  return templateDefinition.buildHtml({
    product: context.product,
    content: mapped,
  })
}

export const generateTextPreview = (
  context: GeneratorContext,
): PreviewBlock[] => {
  const templateDefinition = templateRegistry[context.brand]
  const mapped = mapAirtableRecord(context.brand, context.detailRecord)

  return templateDefinition.buildPreview({
    product: context.product,
    content: mapped,
  })
}
