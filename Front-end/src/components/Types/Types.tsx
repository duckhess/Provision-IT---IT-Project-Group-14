export type Metric = "Ratio" | "Revenue" | "Duration" | "Forecast" | "Statement of Cashflow" | "ABS Benchmarking" | "Liabilities" | "Income Statements" | "Equities" | "Financial Statements" | "Key Ratios" | "Working Capital Movements" | "equities" | "liabilities" | "income_statements" |"financial_statements" | "key_ratios" | "working_capital_movements";
export type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

export interface Dataset {
  // Metric ID
  id: Number;

  // Metric/Section Name
  metric: Metric;

  // Unit of value
  unit: Unit;

  // Name of the specific mmetric
  name: string;
  applicationID: Number;
}