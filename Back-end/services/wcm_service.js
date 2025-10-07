import wcm_schema from '../models/working_capital_movements.js'
import wcm_values_schema from '../models/wcm_values.js'
import wcm_forecasts_schema from '../models/wcm_forecasts.js'
// import timeline_service from './timeline_service.js'

const filter_wcm = async (filters = {}) => {
    const matching_params = {}

    if (filters.capitalid) matching_params.CapitalID = Number(filters.capitalid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)
    
    const value = await wcm_values_schema.find(matching_params).lean()

    const forecast_filters = value.map(v => ({
        CapitalID: v.CapitalID,
        ApplicationID: v.ApplicationID
    }))

    const all_forecast = await wcm_forecasts_schema.find({$or: forecast_filters}).lean()
    const mapped_forecast = new Map()
    all_forecast.forEach(f => {
        const key = `${f.CapitalID}_${f.ApplicationID}`
        mapped_forecast.set(key, f)
    })

    const document = await wcm_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(w => mapped_document.set(w.CapitalID, w))

    // let timeline = new Map()
    // if (filters.fileid) {
    //     const period = await timeline_service.get_period(filters.fileid)
    //     timeline.set(filters.fileid, period)
    // } else {
        // const unique_fileids = [...new Set(value.map(v => v.FileID))]
        // const timeline = await timeline_service.get_period(unique_fileids)
    // }

    // const timeline = await timeline_service.filter(value)

    return value.map(v => {
        const movements = mapped_document.get(v.CapitalID)
        const key = `${v.CapitalID}_${v.ApplicationID}`
        const forecast = mapped_forecast.get(key)
        return {
            CapitalID: v.CapitalID,
            Metric: movements.Metric,
            Unit: movements.Unit,
            ApplicationID: v.ApplicationID,
            // Period: parseInt((timeline.get(`${v.FileID}`))?.period.toString()),
            Value: parseFloat(v.Value),
            "Avg Historical Forecast": parseFloat(forecast?.["Avg Historical Forecast"].toString()),
            "User Forecast": parseFloat(forecast?.["User Forecast"].toString())
        }
    })

}

export default {
    filter_wcm
}