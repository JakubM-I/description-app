import { useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { copyText } from '../../../lib/clipboard/copyText'

type HtmlCodeModalProps = {
  isOpen: boolean
  code: string
  onClose: () => void
}

export const HtmlCodeModal = ({
  isOpen,
  code,
  onClose,
}: HtmlCodeModalProps) => {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCopy = async () => {
    try {
      await copyText(code)
      setCopyState('success')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <Modal isOpen={isOpen} title="Wygenerowany HTML" onClose={onClose}>
      <div className="result-panel">
        <p className="result-panel__text">
          Etap 0 udostępnia placeholder gotowy pod finalny generator marki.
        </p>
        <pre className="result-panel__code">
          <code>{code}</code>
        </pre>
        <div className="result-panel__actions">
          <Button variant="secondary" onClick={handleCopy}>
            Kopiuj placeholder
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Zamknij
          </Button>
        </div>
        {copyState === 'success' ? (
          <p className="status-message">Placeholder został skopiowany do schowka.</p>
        ) : null}
        {copyState === 'error' ? (
          <p className="status-message status-message--error">
            Nie udało się skopiować treści.
          </p>
        ) : null}
      </div>
    </Modal>
  )
}
