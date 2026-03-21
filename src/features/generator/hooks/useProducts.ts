import { useEffect, useState } from 'react'

import { getProductsByBrand } from '../services/products.service'
import type { BrandId, ProductListItem } from '../types'

type UseProductsState = {
  loadedBrand: BrandId | null
  products: ProductListItem[]
  error: string | null
}

const initialState: UseProductsState = {
  loadedBrand: null,
  products: [],
  error: null,
}

export const useProducts = (brand: BrandId | null) => {
  const [state, setState] = useState<UseProductsState>(initialState)

  useEffect(() => {
    let isMounted = true

    if (!brand) {
      return () => {
        isMounted = false
      }
    }

    void getProductsByBrand(brand)
      .then((products) => {
        if (!isMounted) {
          return
        }

        setState({
          loadedBrand: brand,
          products,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Nie udało się przygotować listy produktów.'

        setState({
          loadedBrand: brand,
          products: [],
          error: message,
        })
      })

    return () => {
      isMounted = false
    }
  }, [brand])

  if (!brand) {
    return {
      products: [],
      isLoading: false,
      error: null,
    }
  }

  return {
    products: state.loadedBrand === brand ? state.products : [],
    isLoading: state.loadedBrand !== brand,
    error: state.loadedBrand === brand ? state.error : null,
  }
}
