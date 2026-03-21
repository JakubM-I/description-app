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

  const selectedProduct =
    products.find((product) => product.productRecordId === selectedProductId) ?? null

  const canRunActions = Boolean(selectedBrand && selectedProduct)

  const handleBrandChange = (brand: BrandId | null) => {
    setSelectedBrand(brand)
    setSelectedProductId('')
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

  return (
    <>
      <div className="app-shell">
        <header className="app-shell__header">
          <p className="app-shell__eyebrow">Etap 0 • setup projektu</p>
          <h1 className="app-shell__title">Generator opisów produktów</h1>
          <p className="app-shell__lead">
            Lekki szkielet aplikacji przygotowany pod dwa wyniki po wyborze
            produktu: kod HTML oraz prosty podgląd tekstowy w osobnym popupie.
          </p>
        </header>

        <main className="app-shell__main">
          <section className="panel panel--form" aria-labelledby="generator-heading">
            <div className="panel__intro">
              <p className="panel__kicker">Jednookienny MVP bez routingu</p>
              <h2 className="panel__title" id="generator-heading">
                Szkielet formularza generatora
              </h2>
              <p className="panel__text">
                UI jest gotowe pod wybór marki, pobranie listy produktów, otwieranie
                modala HTML i modala preview. Finalna logika generatora oraz pełna
                integracja z Airtable należą do kolejnych etapów.
              </p>
            </div>

            <div className="generator-form">
              <BrandSelector value={selectedBrand} onChange={handleBrandChange} />
              <ProductSelector
                disabled={!selectedBrand}
                isLoading={isLoading}
                products={products}
                value={selectedProductId}
                onChange={setSelectedProductId}
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
                {productsError ? (
                  <p className="status-message status-message--error">
                    {productsError}
                  </p>
                ) : null}

                {generator.error ? (
                  <p className="status-message status-message--error">
                    {generator.error}
                  </p>
                ) : null}

                {!productsError && !generator.error ? (
                  <p className="status-message">
                    Dostępne marki: {BRAND_OPTIONS.map((brand) => brand.label).join(', ')}.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="panel panel--notes" aria-labelledby="setup-heading">
            <h2 className="panel__title" id="setup-heading">
              Co jest gotowe po setupie
            </h2>

            <div className="setup-grid">
              <article className="setup-card">
                <h3 className="setup-card__title">Warstwa danych</h3>
                <p className="setup-card__text">
                  Istnieje kontrakt repozytorium produktów, mock repo oraz placeholder
                  pod Netlify Functions i Airtable API.
                </p>
              </article>

              <article className="setup-card">
                <h3 className="setup-card__title">Warstwa generatorów</h3>
                <p className="setup-card__text">
                  Przygotowano rejestr szablonów HTML, placeholderowe usługi
                  generowania oraz miejsce na brand-specific mapping.
                </p>
              </article>

              <article className="setup-card">
                <h3 className="setup-card__title">UI i modale</h3>
                <p className="setup-card__text">
                  Formularz ma miejsce na wybór produktu oraz dwa osobne wyniki:
                  modal HTML i modal tekstowego preview.
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
