import { Button } from '../../../components/ui/Button'

type PreviewButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export const PreviewButton = ({
  onClick,
  disabled = false,
}: PreviewButtonProps) => (
  <Button disabled={disabled} variant="secondary" onClick={onClick}>
    Generuj podgląd
  </Button>
)
