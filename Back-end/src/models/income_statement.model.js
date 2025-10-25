import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    IncomeID: { type: Number, required: true, unique: true, index: true },
    Metric: { type: String, required: true, index: true },
    Unit: { type: String, required: true },
  },
  { collection: "income_statement", timestamps: false },
);

export default mongoose.model("income_statement", IncomeSchema);
