import wcm_schema from '../models/working_capital_movements.js'
import wcm_values_schema from '../models/wcm_values.js'
import wcm_forecasts_schema from '../models/wcm_forecasts.js'
import { get_period } from './timeline_service.js'

export async function filter_wcm(filters = {}) {
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

    const fileIDs = [...new Set(value.map(v => v.FileID))]
    const timelineMap = await get_period(fileIDs)

    return value.map(v => {
        const movements = mapped_document.get(v.CapitalID)
        const key = `${v.CapitalID}_${v.ApplicationID}`
        const forecast = mapped_forecast.get(key)
        return {
            CapitalID: v.CapitalID,
            Metric: movements.Metric,
            Unit: movements.Unit,
            ApplicationID: v.ApplicationID,
            Timeline: timelineMap.get(v.FileID),
            Value: parseFloat(v.Value),
            "Avg Historical Forecast": parseFloat(forecast?.["Avg Historical Forecast"].toString()),
            "User Forecast": parseFloat(forecast?.["User Forecast"].toString())
        }
    })

}