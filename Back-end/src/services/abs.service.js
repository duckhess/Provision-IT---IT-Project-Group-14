import abs_schema from "../models/abs_benchmarkings.js";
import abs_values_schema from "../models/abs_values.js";

export async function filter_abs(filters = {}) {
  const matching_params = {};

  if (filters.absid) matching_params.ABSID = Number(filters.absid);
  if (filters.applicationid) matching_params.ApplicationID = Number(filters.applicationid);
  if (filters.anziccode) matching_params.ANZICCode = Number(filters.anziccode);
  if (filters.analysis !== undefined) matching_params.Analysis = filters.analysis === "true";

  const value_rows = await abs_values_schema.find(matching_params).lean();

  const bench_docs = await abs_schema.find().lean();
  const mapped_bench = new Map();
  bench_docs.forEach((a) => mapped_bench.set(a.ABSID, a));

  const response = value_rows.map((v) => {
    const benchmark = mapped_bench.get(v.ABSID);
    return {
      ABSID: v.ABSID,
      Benchmark: benchmark?.Benchmark,
      Unit: benchmark?.Unit,
      ApplicationID: v.ApplicationID,
      ANZICCode: v.ANZICCode,
      Field: v.Field,
      ABSValue: v.ABSValue,
      CalcValue: v.CalcValue,
      Analysis: v.Analysis,
    };
  });

  return response;
}

export default {
  filter_abs,
};
