import { derive_success_rates } from "../services/category.service.js";

export async function fetch_success_rates(req, res) {
  try {
    const filters = req.query;
    const data = await derive_success_rates(filters);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in fetching success rates:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
