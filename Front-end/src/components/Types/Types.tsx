export type Metric = "Ratio" | "EGS" | "Forecast" | "Statement of Cashflow" | "ABS Benchmarking" | "Liabilities" | "Income Statements" | "Equities" | "Financial Statements" | "Key Ratios" | "Working Capital Movements" | "equities" | "liabilities" | "income_statements" |"financial_statements" | "key_ratios" | "working_capital_movements" | "cash_equivalences" | "covenants" | "assets" | "Covenant Summary";
export type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

export interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
}