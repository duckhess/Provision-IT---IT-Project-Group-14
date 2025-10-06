import forecast_schema from '../models/forecast.js'
import forecast_values_schema from '../models/forecast_values.js'
import forecast_forecasts_schema from '../models/forecast_forecasts.js'
// import timeline_schema from '../models/timelines.js'

const filter_forecasts = async (filters = {}) => {
    const matching_params = {}

    if (filters.forecastid) matching_params.ForecastID = Number(filters.forecastid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)

    const value = await forecast_values_schema.find(matching_params).lean()

    const forecast_filters = value.map(v => ({
        ForecastID: v.ForecastID,
        ApplicationID: v.ApplicationID
    }))

    const all_forecast = await forecast_forecasts_schema.find({$or: forecast_filters}).lean()
    const mapped_forecast = new Map()
    all_forecast.forEach(f => {
        const key = `${f.ForecastID}_${f.ApplicationID}`
        mapped_forecast.set(key, f)
    })
    
    const document = await forecast_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(f => mapped_document.set(f.ForecastID, f))

    return value.map(v => {
        const forecasting = mapped_document.get(v.ForecastID)
        const key = `${v.ForecastID}_${v.ApplicationID}`
        const fc = mapped_forecast.get(key)
        return {
            ForecastID: v.ForecastID,
            AccountDescription: forecasting.AccountDescription,
            Unit: forecasting?.Unit,
            ApplicationID: v.ApplicationID,
            // Period: 
            Value: parseFloat(v.Value.toString()),
            "Avg Hist Forecast": parseFloat(fc?.["Avg Hist Forecast"]),
            "Avg Hist % Change": parseFloat(fc?.["Avg Hist % Change"]),
            "Avg Hist % to Revenue": parseFloat(fc?.["Avg Hist % to Revenue"]),
            "Avg Hist Ratio Expression": parseInt(fc?.["Avg Hist Ratio Expression"]),
            "Cashflow Movement Avg Hist": parseFloat(fc?.["Cashflow Movement Avg Hist"]),
            "User Forecast": parseFloat(fc?.["User Forecast"]),
            "User Forecast % Change": parseFloat(fc?.["User Forecast % Change"]),
            "User Ratio Expression": parseInt(fc?.["User Ratio Expression"]),
            "Cashflow Movement User Forecast": parseFloat(fc?.["Cashflow Movement User Forecast"])
        }
    })
}

export default {
    filter_forecasts
}