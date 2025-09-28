import wcm_schema from '../models/working_capital_movements.js'
import wcm_values_schema from '../models/wcm_values.js'
import wcm_forecasts_schema from '../models/wcm_forecasts.js'
import timelines_schema from '../models/timelines.js'

const filter_wcm = async (filters = {}) => {
    const matching_params = {}

    if (filters.capitalid) matching_params.CapitalID = Number(filters.CapitalID)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.ApplicationID)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)
    
    const value = await wcm_values_schema.find(matching_params).lean()

    const document = await wcm_schema.find().lean()


    return value.map(v => {
        
    })

}

export default {
    filter_wcm,
}