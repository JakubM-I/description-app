import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (!isOpen) {
      setCopyState('idle')
    }
  }, [isOpen, code])

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
          Wynik został wygenerowany lokalnie na podstawie mock danych i lekkiego,
          brand-aware generatora Etapu 1.
        </p>
        <pre className="result-panel__code">
          <code>{code}</code>
        </pre>
        <div className="result-panel__actions">
          <Button disabled={!code} variant="secondary" onClick={handleCopy}>
            Kopiuj do schowka
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Zamknij
          </Button>
        </div>
        {copyState === 'success' ? (
          <p className="status-message">Kod HTML został skopiowany do schowka.</p>
        ) : null}
        {copyState === 'error' ? (
          <p className="status-message status-message--error">
            Nie udało się skopiować kodu HTML.
          </p>
        ) : null}
      </div>
    </Modal>
  )
}
