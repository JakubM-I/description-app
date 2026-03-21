export const copyText = async (value: string) => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is not available.')
  }

  await navigator.clipboard.writeText(value)
}
