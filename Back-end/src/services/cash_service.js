import cash_schema from '../models/cash_equivalences.js'
import cash_values_schema from '../models/cash_values.js'
import { get_period } from './timeline_service.js'

export async function filter_cash_equivalences(filters = {}) {
    const matching_params = {}

    if (filters.cashid) matching_params.CashID = Number(filters.cashid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)

    const value = await cash_values_schema.find(matching_params).lean()

    const document = await cash_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(c => mapped_document.set(c.CashID, c))

    const fileIDs = [...new Set(value.map(v => v.FileID))]
    const timelineMap = await get_period(fileIDs)

    return value.map(v => {
        const cash = mapped_document.get(v.CashID)
        return {
            CashID: cash.CashID,
            MetricName: cash.Metric,
            Unit: cash.Unit,
            ApplicationID: v.ApplicationID,
            Timeline: timelineMap.get(v?.FileID),
            Value: parseFloat(v.Value)
        }
    })
}