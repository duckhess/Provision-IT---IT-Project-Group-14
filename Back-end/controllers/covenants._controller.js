import service from '../services/covenants_service.js'

const fetch_covenants = async (req, res) => {
    try {
        const filter_querries = {}
        for (const key in req.query) {
            filter_querries[key.toLowerCase()] = req.query[key]
        }
        const covenants_document = await service.filter_covenants(filter_querries)
        res.json(covenants_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    fetch_covenants
}