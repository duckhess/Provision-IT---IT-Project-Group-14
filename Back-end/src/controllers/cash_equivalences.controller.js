import { filter_cash_equivalences } from "../services/cash_equivalences.service.js";

export const fetch_cash_equivalences = async (req, res) => {
  try {
    const filter_queries = {};
    for (const key in req.query) {
      filter_queries[key.toLowerCase()] = req.query[key];
    }
    const cash_document = await filter_cash_equivalences(filter_queries);
    res.json(cash_document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
