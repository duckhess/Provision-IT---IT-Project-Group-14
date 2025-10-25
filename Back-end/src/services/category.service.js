// services/success_rate.service.js
import { filter_covenants } from "./covenants.service.js";
import { ratioService } from "./key_ratio.service.js";

export async function derive_success_rates(filters = {}) {
  const { applicationid } = filters;
  if (!applicationid) throw new Error("ApplicationID is required");

  // --- Spot % Success from covenants
  const covenants = await filter_covenants({ applicationid });
  const spotCounts = {};

  for (const cov of covenants) {
    const { Category, Analysis } = cov;
    if (!Category) continue;

    if (!spotCounts[Category]) {
      spotCounts[Category] = { total: 0, pass: 0 };
    }
    spotCounts[Category].total += 1;
    if (Analysis === true) {
      spotCounts[Category].pass += 1;
    }
  }

  // --- 3yr Avg % Success from key_ratios
  const ratios = await ratioService({ applicationid });
  const ratioGroups = new Map();

  for (const r of ratios) {
    const key = `${r.KeyRatioID}`;
    if (!ratioGroups.has(key)) {
      ratioGroups.set(key, []);
    }
    ratioGroups.get(key).push(r);
  }

  const avgCounts = {};

  for (const [_, values] of ratioGroups.entries()) {
    const numericValues = values
      .filter((v) => v.Timeline != null)
      .sort((a, b) => a.Timeline - b.Timeline);

    if (numericValues.length === 0) continue;

    const latest = numericValues[numericValues.length - 1];
    const avg = numericValues.reduce((sum, v) => sum + v.Value, 0) / numericValues.length;

    const passed = latest.Value <= avg;
    const category = latest.Category;

    if (!category) continue;

    if (!avgCounts[category]) {
      avgCounts[category] = { total: 0, pass: 0 };
    }

    avgCounts[category].total += 1;
    if (passed) avgCounts[category].pass += 1;
  }

  // Merge results
  const allCategories = new Set([...Object.keys(spotCounts), ...Object.keys(avgCounts)]);

  const result = [];
  for (const category of allCategories) {
    const spot = spotCounts[category] || { total: 0, pass: 0 };
    const avg = avgCounts[category] || { total: 0, pass: 0 };

    result.push({
      ApplicationID: Number(applicationid),
      Category: category,
      "Spot % Success": spot.total ? (spot.pass / spot.total) * 100 : 0,
      "3 yr Average % Success": avg.total ? (avg.pass / avg.total) * 100 : 0,
    });
  }

  return result;
}
