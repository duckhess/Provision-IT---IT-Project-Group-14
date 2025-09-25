import service from '../services/abs_service.js'

const fetch_abs = async (req, res) => {
    try {
        const abs_document = await service.filter_abs_id(req.query)
        res.json(abs_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    fetch_abs,
}