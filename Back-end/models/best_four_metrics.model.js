import mongoose from "mongoose";

const CompanyBestMetricSchema = new mongoose.Schema(
  {
    CompanyID:      { type: Number, required: true, index: true },
    ApplicationID:  { type: Number, required: true, index: true },
    MetricID:       { type: Number, required: true, index: true },
    Metric:         { type: String, required: true, trim: true }, 
    Table: {type: String, required: true, trim: true, lowercase: true,
      enum: [
        "key_ratios",
        "financial_statements",
        "working_capital_movements",
        "statement_of_cashflows"
      ]
    },

  },
  {collection: "best_four_metrics", timestamps: false}
);

export default mongoose.model("best_four_metrics", CompanyBestMetricSchema);
