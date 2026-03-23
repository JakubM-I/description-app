import { Select } from '../../../components/ui/Select'
import type { ProductListItem } from '../types'

type ProductSelectorProps = {
  value: string
  products: ProductListItem[]
  onChange: (value: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export const ProductSelector = ({
  value,
  products,
  onChange,
  disabled = false,
  isLoading = false,
}: ProductSelectorProps) => {
  const hint = disabled
    ? 'Najpierw wybierz markę.'
    : isLoading
      ? 'Ładowanie listy produktów z lokalnego mocka...'
      : products.length === 0
        ? 'Dla tej marki nie ma jeszcze produktów w mock danych.'
        : undefined

  return (
    <Select
      disabled={disabled || isLoading}
      hint={hint}
      id="product"
      label="Produkt"
      options={products.map((product) => ({
        value: product.productRecordId,
        label: product.label,
      }))}
      placeholder="Wybierz produkt"
      value={value}
      onChange={onChange}
    />
  )
}
