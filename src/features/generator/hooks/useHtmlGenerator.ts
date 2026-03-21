import { useState } from 'react'

import {
  generateHtmlDescription,
  generateTextPreview,
} from '../services/description.service'
import { getProductDetail } from '../services/products.service'
import type { GeneratorContext, PreviewBlock } from '../types'

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

  const resolveContext = async (
    context: Omit<GeneratorContext, 'detailRecord'>,
  ): Promise<GeneratorContext> => {
    const detailRecord = context.product.detailRecordId
      ? await getProductDetail({
          brand: context.brand,
          detailRecordId: context.product.detailRecordId,
        })
      : null

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
        isBusy: false,
        isHtmlModalOpen: true,
      }))
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nie udało się przygotować placeholdera HTML.'

      setState((currentState) => ({
        ...currentState,
        isBusy: false,
        error: message,
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
        previewBlocks,
        isBusy: false,
        isTextPreviewModalOpen: true,
      }))
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nie udało się przygotować placeholdera preview.'

      setState((currentState) => ({
        ...currentState,
        isBusy: false,
        error: message,
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

  return {
    ...state,
    openHtmlModal,
    openTextPreviewModal,
    closeHtmlModal,
    closeTextPreviewModal,
  }
}
