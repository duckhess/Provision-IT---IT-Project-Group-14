import { derive_success_rates } from "../services/category.service.js";

export async function fetch_success_rates(req, res) {
  try {
    const filter_queries = {}
      for (const key in req.query) {
        filter_queries[key.toLowerCase()] = req.query[key]
      }
    const data = await derive_success_rates(filter_queries)
    res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
