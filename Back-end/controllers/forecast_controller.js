import service from '../services/forecast_service.js'

const fetch_forecasts = async (req, res) => {
    try {
        const filter_querries = {}
        for (const key in req.query) {
            filter_querries[key.toLowerCase()] = req.query[key]
        }
        const forecast_document = await service.filter_forecasts(filter_querries)
        res.json(forecast_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    fetch_forecasts,
}