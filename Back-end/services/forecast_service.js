import forecast_schema from '../models/forecast.js'
import forecast_values_schema from '../models/forecast_values.js'
import forecast_forecasts_schema from '../models/forecast_forecasts.js'
// import timeline_schema from '../models/timelines.js'

const filter_forecasts = async (filters = {}) => {
    const matching_params = {}

    if (filters.forecastid) matching_params.ForecastID = Number(filters.forecastid)
    if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid)
    if (filters.fileid) matching_params.FileID = Number(filters.fileid)

    const document = await forecast_schema.find().lean()
    const mapped_document = new Map()
    document.forEach(f => mapped_document.set(f.ForecastID, f))

    const forecast = await forecast_forecasts_schema.find(matching_params).lean()

    const forecast_filters = forecast.map(d => ({
        ForecastID: d.ForecastID,
        ApplicationID: d.ApplicationID
    }))

    const value = await forecast_values_schema.find({$or: forecast_filters}).lean()
    const mapped_value = new Map()
    value.forEach(f => {
        const key = `${f.ForecastID}`
        mapped_value.set(key, f)
    })

    return forecast.map(f => {
        const forecasting = mapped_document.get(f.ForecastID)
        const key = `${f.ForecastID}`
        const v = mapped_value.get(key)
        return {
            ForecastID: f.ForecastID,
            AccountDescription: forecasting.AccountDescription,
            Unit: forecasting.Unit,
            ApplicationID: f.ApplicationID,
            // Period: 
            ...(v && {Value: parseFloat(v?.Value)}),
            "Avg Hist Forecast": parseFloat(f["Avg Hist Forecast"]),
            "Avg Hist % Change": parseFloat(f["Avg Hist % Change"]),
            "Avg Hist % to Revenue": parseFloat(f["Avg Hist % to Revenue"]),
            "Avg Hist Ratio Expression": parseInt(f["Avg Hist Ratio Expression"]),
            "Cashflow Movement Avg Hist": parseFloat(f["Cashflow Movement Avg Hist"]),
            "User Forecast": parseFloat(f["User Forecast"]),
            "User Forecast % Change": parseFloat(f["User Forecast % Change"]),
            "User Ratio Expression": parseInt(f["User Ratio Expression"]),
            "Cashflow Movement User Forecast": parseFloat(f["Cashflow Movement User Forecast"])
        }
    })
}

export default {
    filter_forecasts
}