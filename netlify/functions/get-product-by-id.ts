import {
  HttpError,
  errorResponse,
  getAirtableRecord,
  getBrandFromRequest,
  getDetailTableName,
  getLinkedContentFieldName,
  getProductRecordIdFromRequest,
  jsonResponse,
  readLinkedRecordId,
} from './_shared/airtable'

export default async (request: Request) => {
  try {
    const brand = getBrandFromRequest(request)
    const productRecordId = getProductRecordIdFromRequest(request)
    const productRecord = await getAirtableRecord({
      tableName: 'products',
      recordId: productRecordId,
      notFoundMessage: `Nie znaleziono produktu "${productRecordId}".`,
    })

    const linkedContentFieldName = getLinkedContentFieldName(brand)
    const detailRecordId = readLinkedRecordId(
      productRecord.fields,
      linkedContentFieldName,
    )

    if (!detailRecordId) {
      throw new HttpError(
        422,
        `Produkt "${productRecordId}" nie ma powiązanego rekordu treści w polu "${linkedContentFieldName}".`,
      )
    }

    const detailRecord = await getAirtableRecord({
      tableName: getDetailTableName(brand),
      recordId: detailRecordId,
      notFoundMessage: `Nie znaleziono rekordu content "${detailRecordId}" dla marki "${brand}".`,
    })

    return jsonResponse(200, {
      detailRecord,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
