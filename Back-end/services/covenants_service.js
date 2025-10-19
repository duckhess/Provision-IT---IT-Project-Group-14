import covenants_schema from '../models/covenants.js'
import covenants_values_schema from '../models/covenants_values.js'

export async function filter_covenants(filters = {}) {
    const matching_params = {}

    if(filters.covenantsid) matching_params.CovenantsID = Number(filters.covenantsid)
    if(filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if(filters.analysis !== undefined) matching_params.Analysis = filters.analysis === 'true'

    const value = await covenants_values_schema.find(matching_params).lean()

    const document = await covenants_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(c => mapped_document.set(c.CovenantsID, c))

    return value.map(v => {
        const covenants = mapped_document.get(v.CovenantsID)
        return {
            CovenantsID: v.CovenantsID,
            Metric: covenants.Metric,
            Benchmark: covenants.Benchmark,
            Category: covenants.Category,
            Unit: covenants.Unit,
            ApplicationID: v.ApplicationID,
            Value: v.Value,
            Comparator: v.Comparator,
            Analysis: v.Analysis
        }
    })
}