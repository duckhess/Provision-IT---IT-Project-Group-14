import { list_companies_service } from '../services/company.service.js'

export const list_companies_controller = async (req,res) => {
  try {
    const data = await list_companies_service()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

