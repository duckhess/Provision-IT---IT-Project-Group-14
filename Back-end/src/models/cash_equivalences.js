import mongoose, { mongo } from "mongoose";

const cash_schema = new mongoose.Schema({
  CashID: { type: Number, required: true },
  Metric: { type: String, required: true },
  Unit: { type: String, required: true },
});

export default mongoose.model("cash_equivalences", cash_schema);
