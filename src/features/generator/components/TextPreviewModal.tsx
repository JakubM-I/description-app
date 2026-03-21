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
      <p className="preview-panel__intro">
        To jest prosty popup przygotowany pod przyszły preview tekstowy.
      </p>
      <div className="preview-panel__blocks">
        {blocks.map((block, index) => (
          <section className="preview-panel__block" key={`${block.title}-${index}`}>
            {block.title ? (
              <h3 className="preview-panel__title">{block.title}</h3>
            ) : null}
            {block.text ? <p className="preview-panel__text">{block.text}</p> : null}
          </section>
        ))}
      </div>
      <div className="result-panel__actions">
        <button className="preview-panel__close" type="button" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  </Modal>
)
