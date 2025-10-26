import axios from "axios";
import fs from "fs";
import path from "path";

const endpoints = [
  "company_data",
  "abs_benchmarkings",
  "assets",
  "liabilities",
  "income_statements",
  "equities",
  "financial_statements",
  "key_ratios",
  "working_capital_movements",
  "forecasts",
  "cash_equivalences",
  "covenants",
];


// Create a folder to save JSON data
const outputDir = path.resolve("./data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const applicationID = 1;

const fetchAll = async () => {
  for (const endpoint of endpoints) {
    const url = `http://localhost:3000/${endpoint}?applicationID=${applicationID}`;
    console.log(`Fetching: ${url}`);

    try {
      const { data } = await axios.get(url);
      const filePath = path.join(outputDir, `${endpoint}.json`);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`✅ Saved ${endpoint}.json (${data.length} records)`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${endpoint}:`, err.message);
    }
  }

  console.log("🎉 All done! Data saved to ./data/");
};

fetchAll();
