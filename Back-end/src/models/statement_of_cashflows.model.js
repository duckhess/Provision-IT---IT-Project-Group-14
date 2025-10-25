import mongoose from "mongoose";

const SocSchema = new mongoose.Schema(
  {
    CashflowID: { type: Number, required: true, unique: true, index: true },
    Metric: { type: String, required: true, index: true },
    Unit: { type: String, required: true },
  },
  { collection: "statement_of_cashflows", timestamps: false },
);

export default mongoose.model("statement_of_cashflows", SocSchema);
