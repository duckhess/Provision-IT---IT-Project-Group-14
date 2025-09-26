import abs_schema from '../models/abs_benchmarkings.js'
import abs_values_schema from '../models/abs_values.js'

const filter_abs = async (filters = {}) => {
    const matching_params = {}

    if (filters.absid) matching_params.ABSID = Number(filters.absid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.anziccode) matching_params.ANZICCode = Number(filters.anziccode)
    if (filters.analysis !== undefined) matching_params.Analysis = filters.analysis === 'true'

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
    filter_abs,
}