import type { SectionItem } from '../types'

export const groupSectionItems = (
  items: SectionItem[],
  groupSize = 2,
): SectionItem[][] => {
  if (groupSize <= 0) {
    return [items]
  }

  const groups: SectionItem[][] = []

  for (let index = 0; index < items.length; index += groupSize) {
    groups.push(items.slice(index, index + groupSize))
  }

  return groups
}
