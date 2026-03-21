import { useEffect, type MouseEvent, type ReactNode } from 'react'

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="ui-modal" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        className="ui-modal__dialog"
        role="dialog"
        onClick={stopPropagation}
      >
        <div className="ui-modal__header">
          <h2 className="ui-modal__title" id="modal-title">
            {title}
          </h2>
          <button
            aria-label="Zamknij modal"
            className="ui-modal__close"
            type="button"
            onClick={onClose}
          >
            Zamknij
          </button>
        </div>
        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  )
}
