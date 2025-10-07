import service from '../services/cash_service.js'

const fetch_cash_equivalences = async (req, res) => {
    try {
        const filter_querries = {}
        for (const key in req.query) {
            filter_querries[key.toLowerCase()] = req.query[key]
        }
        const cash_document = await service.filter_cash_equivalences(filter_querries)
        res.json(cash_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    fetch_cash_equivalences
}