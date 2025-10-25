import Company from "../models/company.model.js";

// return list of companies and its industry id
export async function list_companies_service() {
  const rows = await Company.find().select("-_id -__v").lean();

  return rows.map((r) => ({
    companyId: r.CompanyID,
    companyName: r.CompanyName,
    industryId: r.IndustryID,
  }));
}
