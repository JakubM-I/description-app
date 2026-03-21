export const buildImageUrl = (
  basePath: string | null | undefined,
  fileName: string | null | undefined,
) => {
  if (!basePath || !fileName) {
    return null
  }

  const normalizedBasePath = basePath.endsWith('/')
    ? basePath.slice(0, -1)
    : basePath

  return `${normalizedBasePath}/${fileName}`
}
