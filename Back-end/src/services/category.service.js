import { filter_covenants } from "./covenants.service.js";
import { ratio_service } from "./key_ratio.service.js";

export async function derive_success_rates(filters = {}) {
  const { applicationid } = filters;
  if (!applicationid) throw new Error("ApplicationID is required");

  // --- Spot % Success from covenants
  const covenants = await filter_covenants({ applicationid });
  const spot_counts = {};

  for (const cov of covenants) {
    // alias DB fields (PascalCase) to snake_case locals to satisfy ESLint
    const { Category: category_name, Analysis: analysis } = cov;
    if (!category_name) continue;

    if (!spot_counts[category_name]) {
      spot_counts[category_name] = { total: 0, pass: 0 };
    }
    spot_counts[category_name].total += 1;
    if (analysis === true) {
      spot_counts[category_name].pass += 1;
    }
  }

  // --- 3yr Avg % Success from key_ratios
  const ratios = await ratio_service({ applicationid });
  const ratio_groups = new Map();

  for (const r of ratios) {
    const key_ratio_id = `${r.KeyRatioID}`;
    if (!ratio_groups.has(key_ratio_id)) {
      ratio_groups.set(key_ratio_id, []);
    }
    ratio_groups.get(key_ratio_id).push(r);
  }

  const avg_counts = {};

  for (const [, values] of ratio_groups.entries()) {
    const numeric_values = values
      .filter((v) => v.Timeline != null)
      .sort((a, b) => a.Timeline - b.Timeline);

    if (numeric_values.length === 0) continue;

    const latest = numeric_values[numeric_values.length - 1];
    const avg = numeric_values.reduce((sum, v) => sum + Number(v.Value), 0) / numeric_values.length;

    const passed = Number(latest.Value) <= avg;
    const category = latest.Category;
    if (!category) continue;

    if (!avg_counts[category]) {
      avg_counts[category] = { total: 0, pass: 0 };
    }
    avg_counts[category].total += 1;
    if (passed) avg_counts[category].pass += 1;
  }

  // --- Merge results (API JSON KEYS KEPT IDENTICAL)
  const all_categories = new Set([...Object.keys(spot_counts), ...Object.keys(avg_counts)]);

  const result = [];
  for (const category of all_categories) {
    const spot = spot_counts[category] || { total: 0, pass: 0 };
    const avg = avg_counts[category] || { total: 0, pass: 0 };

    result.push({
      ApplicationID: Number(applicationid),
      Category: category,
      "Spot % Success": spot.total ? (spot.pass / spot.total) * 100 : 0,
      "3 yr Average % Success": avg.total ? (avg.pass / avg.total) * 100 : 0,
    });
  }

  return result;
}
