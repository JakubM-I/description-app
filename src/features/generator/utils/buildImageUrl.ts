export const buildImageUrl = (
  assetRoot: string | null | undefined,
  basePath: string | null | undefined,
  fileName: string | null | undefined,
) => {
  if (!assetRoot || !basePath || !fileName) {
    return null
  }

  const normalizedAssetRoot = assetRoot.endsWith('/')
    ? assetRoot.slice(0, -1)
    : assetRoot

  const normalizedBasePath = basePath.endsWith('/')
    ? basePath.slice(0, -1)
    : basePath

  return `${normalizedAssetRoot}/${normalizedBasePath}/${fileName}`
}
