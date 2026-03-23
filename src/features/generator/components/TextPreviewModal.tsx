import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import type { PreviewBlock } from '../types'

type TextPreviewModalProps = {
  isOpen: boolean
  blocks: PreviewBlock[]
  onClose: () => void
}

export const TextPreviewModal = ({
  isOpen,
  blocks,
  onClose,
}: TextPreviewModalProps) => (
  <Modal isOpen={isOpen} title="Podgląd tekstowy" onClose={onClose}>
    <div className="preview-panel">
      <div className="preview-panel__blocks">
        {blocks.length === 0 ? (
          <section className="preview-panel__block">
            <h3 className="preview-panel__title">Brak treści</h3>
            <p className="preview-panel__text">
              Wybrany rekord nie zawiera tekstowych bloków do pokazania w podglądzie.
            </p>
          </section>
        ) : (
          blocks.map((block, index) => (
            <section className="preview-panel__block" key={`${block.title}-${index}`}>
              {block.title ? (
                <h3 className="preview-panel__title">{block.title}</h3>
              ) : null}
              {block.text ? <p className="preview-panel__text">{block.text}</p> : null}
            </section>
          ))
        )}
      </div>
      <div className="preview-panel__actions">
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
    </div>
  </Modal>
)
