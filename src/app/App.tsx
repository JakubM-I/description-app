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
        text: 'Wybierz markę, aby wczytać listę produktów z lokalnego mocka.',
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
        text: 'Brak produktów dla wybranej marki w lokalnym mocku danych.',
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
          <p className="app-shell__eyebrow">Etap 1 • mock data + UI flow</p>
          <h1 className="app-shell__title">Generator opisów produktów</h1>
          <p className="app-shell__lead">
            Aplikacja działa lokalnie na mock danych i prowadzi przez pełny,
            podstawowy przepływ: wybór marki, wybór produktu, generowanie HTML
            oraz tekstowego podglądu w osobnych modalach.
          </p>
        </header>

        <main className="app-shell__main">
          <section className="panel panel--form" aria-labelledby="generator-heading">
            <div className="panel__intro">
              <p className="panel__kicker">Jednookienny MVP bez routingu</p>
              <h2 className="panel__title" id="generator-heading">
                Etap 1: wybierz markę i produkt
              </h2>
              <p className="panel__text">
                Lista produktów jest pobierana z tabeli <code>products</code> w
                lokalnym mocku, a właściwy rekord szczegółowy jest odczytywany z
                brand-specific pola linked record (
                <code>Lionelo_Content</code>, <code>Peluvio_Content</code>,
                <code>Overmax_Content</code>) dopiero przy generowaniu wyniku.
              </p>
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

          <section className="panel panel--notes" aria-labelledby="setup-heading">
            <h2 className="panel__title" id="setup-heading">
              Co działa w Etapie 1
            </h2>

            <div className="setup-grid">
              <article className="setup-card">
                <h3 className="setup-card__title">Mock danych</h3>
                <p className="setup-card__text">
                  Repozytorium czyta lokalny JSON, filtruje tabelę produktów po marce
                  i wyszukuje rekord szczegółowy we właściwej tabeli content.
                </p>
              </article>

              <article className="setup-card">
                <h3 className="setup-card__title">Generatory marek</h3>
                <p className="setup-card__text">
                  Każda marka ma własną, uproszczoną logikę HTML i preview opartą
                  na danych runtime, bez zależności od plików z katalogu docs.
                </p>
              </article>

              <article className="setup-card">
                <h3 className="setup-card__title">UI i modale</h3>
                <p className="setup-card__text">
                  Formularz blokuje akcje do czasu poprawnego wyboru produktu, a
                  wyniki otwierają się w osobnych modalach z kopiowaniem HTML i
                  czytelnym podglądem tekstowym.
                </p>
              </article>
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
