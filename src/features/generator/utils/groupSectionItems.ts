import type { ContentBlock } from '../types'

export const groupSectionItems = (
  items: ContentBlock[],
  groupSize = 2,
): ContentBlock[][] => {
  if (groupSize <= 0) {
    return [items]
  }

  const groups: ContentBlock[][] = []

  for (let index = 0; index < items.length; index += groupSize) {
    groups.push(items.slice(index, index + groupSize))
  }

  return groups
}
