import { Select } from '../../../components/ui/Select'
import { BRAND_OPTIONS } from '../../../config/brands'
import type { BrandId } from '../types'

type BrandSelectorProps = {
  value: BrandId | null
  onChange: (value: BrandId | null) => void
}

export const BrandSelector = ({ value, onChange }: BrandSelectorProps) => (
  <Select
    id="brand"
    hint="Wybierz markę, by załadować produkty."
    label="Marka"
    options={BRAND_OPTIONS.map((brand) => ({
      value: brand.id,
      label: brand.label,
    }))}
    placeholder="Wybierz markę"
    value={value ?? ''}
    onChange={(nextValue) => onChange((nextValue || null) as BrandId | null)}
  />
)
