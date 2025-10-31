import mongoose from "mongoose";

const statement_schema = new mongoose.Schema({
  CashflowID: { type: Number, required: true },
  Metric: { type: String, required: true },
  Unit: { type: String, required: true },
});

export default mongoose.model("statement_of_cashflows", statement_schema);
