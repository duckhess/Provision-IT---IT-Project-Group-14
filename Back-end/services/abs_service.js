import abs_schema from '../models/abs_benchmarkings.js'
import abs_values_schema from '../models/abs_values.js'

const filter_abs_id = async (filters = {}) => {
    const matching_params = {}

    if (filters.ABSID) matching_params.ABSID = Number(filters.ABSID)
    if (filters.ApplicationID) matching_params.ApplicationID = Number(filters.ApplicationID)
    if (filters.Analysis !== undefined) matching_params.Analysis = filters.Analysis === 'true'

    const value = await abs_values_schema.find(matching_params).lean()

    const document = await abs_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(b => mapped_document.set(b.ABSID, b))

    const response = value.map(value => {
        const benchmark = mapped_document.get(value.ABSID)
        return {    
            ABSID: value.ABSID,
            Benchmark: benchmark.Benchmark,
            Unit: benchmark.Unit,
            ApplicationID: value.ApplicationID,
            ANZICCode: value.ANZICCode,
            Field: value.Field,
            ABSValue: value.ABSValue,
            CalcValue: value.CalcValue,
            Analysis: value.Analysis
        }
    })

    return response
}

export default {
    filter_abs_id,
}