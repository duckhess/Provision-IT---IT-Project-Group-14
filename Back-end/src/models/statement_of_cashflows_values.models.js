import mongoose from "mongoose";

const SocValueSchema = new mongoose.Schema(
  {
    CashflowID: { type: Number, required: true, unique: true, index: true },
    ApplicationID: { type: Number, required: true, index: true },
    FileID: { type: Number, required: true, index: true },
    Value: { type: mongoose.Types.Decimal128, required: true },
  },
  { collection: "statement_of_cashflows_values", timestamps: false },
);

export default mongoose.model("statement_of_cashflows_values", SocValueSchema);
