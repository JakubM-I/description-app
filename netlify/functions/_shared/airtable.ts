import {
  BRAND_DETAIL_TABLE_MAP,
  BRAND_LINKED_CONTENT_FIELD_MAP,
} from '../../../src/config/brands'
import type {
  AirtableRecord,
  AirtableRecordFields,
  BrandId,
  DetailTableName,
  LinkedContentFieldName,
} from '../../../src/features/generator/types'

const AIRTABLE_API_ROOT = 'https://api.airtable.com/v0'

type AirtableListResponse = {
  records?: AirtableRecord[]
  offset?: string
}

type AirtableErrorPayload = {
  error?: {
    type?: string
    message?: string
  }
}

const isAirtableListResponse = (
  payload: AirtableListResponse | AirtableErrorPayload | null,
): payload is AirtableListResponse =>
  Boolean(payload && typeof payload === 'object' && 'records' in payload)

class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
}

const parseJsonSafely = async (response: Response) => {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

const getAirtableErrorMessage = (payload: unknown) => {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    payload.error &&
    typeof payload.error === 'object' &&
    'message' in payload.error &&
    typeof payload.error.message === 'string'
  ) {
    return payload.error.message
  }

  return null
}

const buildAirtableUrl = (
  baseId: string,
  tableName: string,
  params?: URLSearchParams,
  recordId?: string,
) => {
  const encodedTableName = encodeURIComponent(tableName)
  const encodedRecordId = recordId ? `/${encodeURIComponent(recordId)}` : ''
  const queryString = params && params.size > 0 ? `?${params.toString()}` : ''

  return `${AIRTABLE_API_ROOT}/${baseId}/${encodedTableName}${encodedRecordId}${queryString}`
}

const getEnv = () => {
  const baseId = process.env.AIRTABLE_BASE_ID?.trim()
  const personalAccessToken = process.env.AIRTABLE_PAT?.trim()

  if (!baseId) {
    throw new HttpError(500, 'Brak zmiennej środowiskowej AIRTABLE_BASE_ID.')
  }

  if (!personalAccessToken) {
    throw new HttpError(500, 'Brak zmiennej środowiskowej AIRTABLE_PAT.')
  }

  return {
    baseId,
    personalAccessToken,
  }
}

const getAirtableHeaders = () => {
  const { personalAccessToken } = getEnv()

  return {
    Authorization: `Bearer ${personalAccessToken}`,
  }
}

const fetchFromAirtable = async (
  tableName: string,
  params?: URLSearchParams,
  recordId?: string,
) => {
  const { baseId } = getEnv()

  return fetch(buildAirtableUrl(baseId, tableName, params, recordId), {
    headers: getAirtableHeaders(),
  })
}

export const jsonResponse = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    headers: JSON_HEADERS,
    status,
  })

export const errorResponse = (error: unknown) => {
  if (error instanceof HttpError) {
    return jsonResponse(error.status, {
      message: error.message,
    })
  }

  console.error(error)

  return jsonResponse(500, {
    message: 'Wystąpił nieoczekiwany błąd po stronie funkcji.',
  })
}

export const getBrandFromRequest = (request: Request): BrandId => {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand')?.trim()

  if (!brand) {
    throw new HttpError(400, 'Parametr "brand" jest wymagany.')
  }

  if (!Object.prototype.hasOwnProperty.call(BRAND_DETAIL_TABLE_MAP, brand)) {
    throw new HttpError(400, `Marka "${brand}" nie jest obsługiwana.`)
  }

  return brand as BrandId
}

export const getProductRecordIdFromRequest = (request: Request) => {
  const { searchParams } = new URL(request.url)
  const productRecordId = searchParams.get('productRecordId')?.trim()

  if (!productRecordId) {
    throw new HttpError(400, 'Parametr "productRecordId" jest wymagany.')
  }

  return productRecordId
}

export const getLinkedContentFieldName = (
  brand: BrandId,
): LinkedContentFieldName => {
  const linkedContentFieldName = BRAND_LINKED_CONTENT_FIELD_MAP[brand]

  if (!linkedContentFieldName) {
    throw new HttpError(500, `Brak mapowania pola linked record dla marki "${brand}".`)
  }

  return linkedContentFieldName
}

export const getDetailTableName = (brand: BrandId): DetailTableName => {
  const detailTableName = BRAND_DETAIL_TABLE_MAP[brand]

  if (!detailTableName) {
    throw new HttpError(500, `Brak mapowania tabeli content dla marki "${brand}".`)
  }

  return detailTableName
}

export const readLinkedRecordId = (
  fields: AirtableRecordFields,
  linkedContentFieldName: LinkedContentFieldName,
) => {
  const linkedRecords = fields[linkedContentFieldName]

  if (!Array.isArray(linkedRecords)) {
    return null
  }

  const firstLinkedRecord = linkedRecords[0]

  return typeof firstLinkedRecord === 'string' && firstLinkedRecord.trim()
    ? firstLinkedRecord
    : null
}

export const listAirtableRecords = async (
  tableName: string,
  params: URLSearchParams,
) => {
  const records: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const nextParams = new URLSearchParams(params)
    nextParams.set('pageSize', '100')

    if (offset) {
      nextParams.set('offset', offset)
    }

    const response = await fetchFromAirtable(tableName, nextParams)
    const payload = (await parseJsonSafely(response)) as AirtableListResponse | AirtableErrorPayload | null

    if (!response.ok) {
      const airtableMessage = getAirtableErrorMessage(payload)

      throw new HttpError(
        502,
        airtableMessage
          ? `Airtable API zwróciło błąd podczas pobierania listy produktów: ${airtableMessage}`
          : 'Nie udało się pobrać listy produktów z Airtable API.',
      )
    }

    if (!isAirtableListResponse(payload) || !Array.isArray(payload.records)) {
      throw new HttpError(502, 'Airtable API zwróciło nieprawidłową odpowiedź listy rekordów.')
    }

    records.push(...payload.records)
    offset = payload.offset
  } while (offset)

  return records
}

export const getAirtableRecord = async (params: {
  tableName: string
  recordId: string
  notFoundMessage: string
}) => {
  const response = await fetchFromAirtable(params.tableName, undefined, params.recordId)
  const payload = (await parseJsonSafely(response)) as AirtableRecord | AirtableErrorPayload | null

  if (response.status === 404) {
    throw new HttpError(404, params.notFoundMessage)
  }

  if (!response.ok) {
    const airtableMessage = getAirtableErrorMessage(payload)

    throw new HttpError(
      502,
      airtableMessage
        ? `Airtable API zwróciło błąd podczas pobierania rekordu: ${airtableMessage}`
        : 'Nie udało się pobrać rekordu z Airtable API.',
    )
  }

  if (!payload || typeof payload !== 'object' || !('fields' in payload)) {
    throw new HttpError(502, 'Airtable API zwróciło nieprawidłową odpowiedź rekordu.')
  }

  return payload as AirtableRecord
}

export { HttpError }
