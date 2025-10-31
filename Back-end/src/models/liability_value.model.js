import mongoose from "mongoose";

const LiabilityValueSchema = new mongoose.Schema(
  {
    LiabilitiesID: { type: Number, required: true, unique: true, index: true },
    FileID: { type: Number, required: true, index: true },
    ApplicationID: { type: Number, required: true, index: true },
    Value: { type: mongoose.Types.Decimal128, required: true },
  },
  { collection: "liabilities_values", timestamps: false },
);

export default mongoose.model("liabilities_values", LiabilityValueSchema);
