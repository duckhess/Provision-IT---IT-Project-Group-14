import { filter_abs } from '../services/abs.service.js'

export const fetch_abs = async (req, res) => {
    try {
        const filter_querries = {}
        for (const key in req.query) {
            filter_querries[key.toLowerCase()] = req.query[key]
        }
        const abs_document = await filter_abs(filter_querries)
        res.json(abs_document)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}