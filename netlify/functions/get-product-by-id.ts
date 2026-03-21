export default async () => {
  return new Response(
    JSON.stringify({
      message:
        'TODO: implementacja Netlify Function get-product-by-id zostanie dodana w Etapie 2.',
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
      status: 501,
    },
  )
}
