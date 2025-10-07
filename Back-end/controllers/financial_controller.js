import service from '../services/financial_statements_service.js'

const fetch_statements = async (req, res) => {
    try {
        const filter_querries = {}
        for (const key in req.query) {
            filter_querries[key.toLowerCase()] = req.query[key]
        }
        const financial_document = await service.filter_statements(filter_querries)
        res.json(financial_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    fetch_statements
}