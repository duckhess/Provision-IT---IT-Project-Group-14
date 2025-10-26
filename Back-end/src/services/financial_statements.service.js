import financial_schema from '../models/financial_statements.js'
import financial_values_schema from '../models/financial_statements_values.js'
import { get_period } from './timeline_service.js'

export async function filter_statements(filters = {}) {
    const matching_params = {}

    if (filters.financialid) matching_params.FinancialID = Number(filters.financialid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)

    const value = await financial_values_schema.find(matching_params).lean()

    const document = await financial_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(f => mapped_document.set(f.FinancialID, f))

    const fileIDs = [...new Set(value.map(v => v.FileID))]
    const timelineMap = await get_period(fileIDs)

    return value.map(v => {
        const financials = mapped_document.get(v.FinancialID)
        return  {
            FinancialID: v.FinancialID,
            MetricName: financials.Metric,
            Unit: financials.Unit,
            ApplicationID: v.ApplicationID,
            Timeline: timelineMap.get(v.FileID),
            Value: parseFloat(v.Value)
        }
    })
}