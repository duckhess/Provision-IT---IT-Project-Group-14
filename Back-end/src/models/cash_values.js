import mongoose from "mongoose";

const cash_values_schema = new mongoose.Schema({
  CashID: { type: Number, required: true },
  ApplicationID: { type: Number, required: true },
  FileID: { type: Number, required: true },
  Value: { type: mongoose.Types.Decimal128, required: true },
});

export default mongoose.model("cash_equivalence_values", cash_values_schema);
