import dataModel from "../models/company_data.model.js";

const results = (r) => ({
  CompanyID: r.CompanyID,
  CompanyName: r.CompanyName,
  Industry: r.Industry,
  IndustryID: r.IndustryID,
  ApplicationID: r.ApplicationID,
  YearEstablished: r.YearEstablished,
  Location: r.Location,
  UsageOfFunds: r.UsageOfFunds,
  Amount: r.Amount,
  EnvironmentalScore: r.EnvironmentalScore,
  SocialScore: r.SocialScore,
  GovernanceScore: r.GovernanceScore,
  ShortGeneralDescription: r.ShortGeneralDescription,
  LongGeneralDescription: r.LongGeneralDescription,
  ShortApplicationDescription: r.ShortApplicationDescription,
  LongApplicationDescription: r.LongApplicationDescription,
});

export async function companyDataService(filters = {}) {
  const matching_params = {};
  if (filters.companyid != null) matching_params.CompanyID = Number(filters.companyid);
  if (filters.applicationid != null) matching_params.ApplicationID = Number(filters.applicationid);

  const values = await dataModel.find(matching_params).select("-__v -_id").lean();
  if (values.length === 0) return [];

  return values.map(results);
}
