import { Button } from '../../../components/ui/Button'

type GenerateButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export const GenerateButton = ({
  onClick,
  disabled = false,
}: GenerateButtonProps) => (
  <Button disabled={disabled} onClick={onClick}>
    Generuj kod HTML
  </Button>
)
