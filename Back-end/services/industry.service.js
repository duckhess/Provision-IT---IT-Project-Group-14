import Industry from "../models/industry.model.js"

const results = (r) => ({
  IndustryId: r.IndustryID,  
  IndustryName: r.IndustryName,
})

export async function get_industry_by_id_service(id) {

  const row = await Industry.findOne({ IndustryID: id }).lean()

  return row ? results(row) : null
}

export async function list_industries_service() {
  const rows = await Industry.find().select("-_id -__v").lean()
  return rows.map(results)
}
