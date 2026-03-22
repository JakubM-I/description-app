import { useState } from 'react'

import { BRAND_LINKED_CONTENT_FIELD_MAP } from '../../../config/brands'
import {
  generateHtmlDescription,
  generateTextPreview,
} from '../services/description.service'
import { getProductDetail } from '../services/products.service'
import type { BrandId, GeneratorContext, PreviewBlock } from '../types'

type GeneratorState = {
  htmlCode: string
  previewBlocks: PreviewBlock[]
  isBusy: boolean
  error: string | null
  isHtmlModalOpen: boolean
  isTextPreviewModalOpen: boolean
}

const initialState: GeneratorState = {
  htmlCode: '',
  previewBlocks: [],
  isBusy: false,
  error: null,
  isHtmlModalOpen: false,
  isTextPreviewModalOpen: false,
}

export const useHtmlGenerator = () => {
  const [state, setState] = useState<GeneratorState>(initialState)

  const getMissingDetailRecordMessage = (brand: BrandId) => {
    const linkedContentFieldName = BRAND_LINKED_CONTENT_FIELD_MAP[brand]

    if (!linkedContentFieldName) {
      return `Brak mapowania pola linked record dla marki "${brand}".`
    }

    return `Wybrany produkt nie ma powiązanego rekordu treści w polu "${linkedContentFieldName}" dla marki "${brand}".`
  }

  const resolveContext = async (
    context: Omit<GeneratorContext, 'detailRecord'>,
  ): Promise<GeneratorContext> => {
    if (!context.product.detailRecordId) {
      throw new Error(getMissingDetailRecordMessage(context.brand))
    }

    const detailRecord = await getProductDetail({
      brand: context.brand,
      productRecordId: context.product.productRecordId,
    })

    if (!detailRecord) {
      throw new Error('Nie udało się odnaleźć rekordu szczegółowego dla wybranego produktu.')
    }

    return {
      ...context,
      detailRecord,
    }
  }

  const openHtmlModal = async (input: Omit<GeneratorContext, 'detailRecord'>) => {
    setState((currentState) => ({
      ...currentState,
      isBusy: true,
      error: null,
    }))

    try {
      const context = await resolveContext(input)
      const htmlCode = generateHtmlDescription(context)

      setState((currentState) => ({
        ...currentState,
        htmlCode,
        previewBlocks: [],
        isBusy: false,
        isHtmlModalOpen: true,
        isTextPreviewModalOpen: false,
      }))
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nie udało się wygenerować kodu HTML.'

      setState((currentState) => ({
        ...currentState,
        htmlCode: '',
        isBusy: false,
        error: message,
        isHtmlModalOpen: false,
        isTextPreviewModalOpen: false,
      }))
    }
  }

  const openTextPreviewModal = async (
    input: Omit<GeneratorContext, 'detailRecord'>,
  ) => {
    setState((currentState) => ({
      ...currentState,
      isBusy: true,
      error: null,
    }))

    try {
      const context = await resolveContext(input)
      const previewBlocks = generateTextPreview(context)

      setState((currentState) => ({
        ...currentState,
        htmlCode: '',
        previewBlocks,
        isBusy: false,
        isHtmlModalOpen: false,
        isTextPreviewModalOpen: true,
      }))
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nie udało się wygenerować podglądu tekstowego.'

      setState((currentState) => ({
        ...currentState,
        previewBlocks: [],
        isBusy: false,
        error: message,
        isHtmlModalOpen: false,
        isTextPreviewModalOpen: false,
      }))
    }
  }

  const closeHtmlModal = () => {
    setState((currentState) => ({
      ...currentState,
      isHtmlModalOpen: false,
    }))
  }

  const closeTextPreviewModal = () => {
    setState((currentState) => ({
      ...currentState,
      isTextPreviewModalOpen: false,
    }))
  }

  const resetResults = () => {
    setState(initialState)
  }

  return {
    ...state,
    openHtmlModal,
    openTextPreviewModal,
    closeHtmlModal,
    closeTextPreviewModal,
    resetResults,
  }
}
