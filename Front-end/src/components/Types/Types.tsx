export type Metric = "Ratio" | "EGS" | "Forecast" | "Statement of Cashflow" | "ABS Benchmarking" | "Liabilities" | "Income Statements" | "Equities" | "Financial Statements" | "Key Ratios" | "Working Capital Movements" | "equities" | "liabilities" | "income_statements" |"financial_statements" | "key_ratios" | "working_capital_movements" | "cash_equivalences" | "covenants" | "assets" | "Covenant Summary";
export type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio" | "ratio";

export interface Dataset {
  name: string;
  data: any[];
  metric: Metric;
  unit: Unit;
  metadata?: Record<string, any>;
}

export interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

export interface BackendCompanyData {
  CompanyID: number;
  CompanyName: string;
  Industry: string;
  IndustryID: number;
  ApplicationID: number;
  YearEstablished: string;
  Location: string;
  UsageOfFunds: string;
  Amount: string;
  EnvironmentalScore: number;
  SocialScore: number;
  ShortGeneralDescription: string;
  LongGeneralDescription: string;
  ShortApplicationDescription: string;
  LongApplicationDescription: string;
}