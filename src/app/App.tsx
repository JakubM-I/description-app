import { useState } from 'react'

import { BRAND_OPTIONS } from '../config/brands'
import { BrandSelector } from '../features/generator/components/BrandSelector'
import { GenerateButton } from '../features/generator/components/GenerateButton'
import { HtmlCodeModal } from '../features/generator/components/HtmlCodeModal'
import { PreviewButton } from '../features/generator/components/PreviewButton'
import { ProductSelector } from '../features/generator/components/ProductSelector'
import { TextPreviewModal } from '../features/generator/components/TextPreviewModal'
import { useHtmlGenerator } from '../features/generator/hooks/useHtmlGenerator'
import { useProducts } from '../features/generator/hooks/useProducts'
import type { BrandId } from '../features/generator/types'

export const App = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandId | null>(null)
  const [selectedProductId, setSelectedProductId] = useState('')
  const isAirtableSource = import.meta.env.VITE_DATA_SOURCE === 'airtable'
  const dataSourceLabel = isAirtableSource
    ? 'Airtable przez Netlify Functions'
    : 'lokalny mock danych'

  const { products, isLoading, error: productsError } = useProducts(selectedBrand)
  const generator = useHtmlGenerator()

  const selectedBrandOption = selectedBrand
    ? BRAND_OPTIONS.find((brand) => brand.id === selectedBrand) ?? null
    : null

  const selectedProduct =
    products.find((product) => product.productRecordId === selectedProductId) ?? null

  const canRunActions = Boolean(selectedBrand && selectedProduct)

  const handleBrandChange = (brand: BrandId | null) => {
    setSelectedBrand(brand)
    setSelectedProductId('')
    generator.resetResults()
  }

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId)
    generator.resetResults()
  }

  const handleHtmlGeneration = () => {
    if (!selectedBrand || !selectedProduct) {
      return
    }

    void generator.openHtmlModal({
      brand: selectedBrand,
      product: selectedProduct,
    })
  }

  const handleTextPreview = () => {
    if (!selectedBrand || !selectedProduct) {
      return
    }

    void generator.openTextPreviewModal({
      brand: selectedBrand,
      product: selectedProduct,
    })
  }

  const statusMessage = (() => {
    if (productsError) {
      return {
        tone: 'error',
        text: productsError,
      }
    }

    if (generator.error) {
      return {
        tone: 'error',
        text: generator.error,
      }
    }

    if (!selectedBrand) {
      return {
        tone: 'default',
        text: `Wybierz markę, aby wczytać listę produktów z: ${dataSourceLabel}.`,
      }
    }

    if (isLoading) {
      return {
        tone: 'default',
        text: `Ładowanie produktów dla marki ${selectedBrandOption?.label ?? selectedBrand}...`,
      }
    }

    if (products.length === 0) {
      return {
        tone: 'default',
        text: `Brak produktów dla wybranej marki w źródle danych: ${dataSourceLabel}.`,
      }
    }

    if (!selectedProduct) {
      return {
        tone: 'default',
        text: 'Wybierz produkt, aby odblokować generowanie kodu HTML i podglądu tekstowego.',
      }
    }

    return {
      tone: 'default',
      text: 'Produkt jest gotowy. Możesz wygenerować kod HTML albo podgląd tekstowy.',
    }
  })()

  return (
    <>
      <div className="app-shell">
        <header className="app-shell__header">
          <h1 className="app-shell__title">Generator opisów produktów</h1>
        </header>

        <main className="app-shell__main">
          <section className="panel panel--form" aria-labelledby="generator-heading">
            <div className="panel__intro">
              <h2 className="panel__title" id="generator-heading">
                Wybierz markę i produkt
              </h2>
            </div>

            <div className="generator-form">
              <BrandSelector value={selectedBrand} onChange={handleBrandChange} />
              <ProductSelector
                disabled={!selectedBrand}
                isLoading={isLoading}
                products={products}
                value={selectedProductId}
                onChange={handleProductChange}
              />

              <div className="generator-form__actions">
                <GenerateButton
                  disabled={!canRunActions || generator.isBusy}
                  onClick={handleHtmlGeneration}
                />
                <PreviewButton
                  disabled={!canRunActions || generator.isBusy}
                  onClick={handleTextPreview}
                />
              </div>

              <div className="generator-form__status" aria-live="polite">
                <p
                  className={
                    statusMessage.tone === 'error'
                      ? 'status-message status-message--error'
                      : 'status-message'
                  }
                >
                  {statusMessage.text}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <HtmlCodeModal
        code={generator.htmlCode}
        isOpen={generator.isHtmlModalOpen}
        onClose={generator.closeHtmlModal}
      />

      <TextPreviewModal
        blocks={generator.previewBlocks}
        isOpen={generator.isTextPreviewModalOpen}
        onClose={generator.closeTextPreviewModal}
      />
    </>
  )
}
